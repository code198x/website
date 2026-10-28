"""Verify positive publication evidence against the matching local build."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin,unquote
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,UTC
import json,hashlib,re,sys,xml.etree.ElementTree as ET
r=Path(__file__).resolve().parents[3];ev=Path(__file__).resolve().parent;base='https://code198x.com'
entries=json.loads((ev/'entries.json').read_text());assert len(entries)==88
class Page(HTMLParser):
 def __init__(self,s):super().__init__();self.ids=set();self.links=[];self.meta={};self.review=[];self.canonical=[];self.images=[];self.main=False;self.skip=0;self.text=[];self.feed(s)
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='main':self.main=True
  if tag in ['script','style']:self.skip+=1
  if d.get('id'):self.ids.add(d['id'])
  if tag=='a' and d.get('href'):self.links.append(d['href'])
  if tag=='meta':self.meta[d.get('name')]=d.get('content')
  if d.get('id')=='article-status':self.review.append(d.get('data-reviewed'))
  if tag=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if self.main and tag=='img':self.images.append(d)
 def handle_endtag(self,tag):
  if tag=='main':self.main=False
  if tag in ['script','style']:self.skip-=1
 def handle_data(self,s):
  if self.main and not self.skip:self.text.append(s)
 def prose(self):return ' '.join(' '.join(self.text).split())
def get(route):
 url=route if route.startswith('https://') else base+route
 with urlopen(Request(url,headers={'Cache-Control':'no-cache'}),timeout=25) as f:
  assert f.status==200,(url,f.status);return {'url':url,'finalUrl':f.url,'status':f.status,'data':f.read()}
def local(route):return Page((r/'dist'/route.strip('/')/'index.html').read_text())
routes={'/vault/'+e['path'] for e in entries};outgoing=set();incoming=set()
for route in routes:
 for href in local(route).links:
  u=urlsplit(href)
  if not u.scheme and not u.netloc and (u.path or route).startswith('/vault/'):
   outgoing.add((route,(u.path or route).rstrip('/'),u.fragment))
for file in (r/'dist/vault').rglob('index.html'):
 route='/'+str(file.parent.relative_to(r/'dist'))
 for href in Page(file.read_text()).links:
  u=urlsplit(href)
  if not u.scheme and not u.netloc and u.path.rstrip('/') in routes and route!=u.path.rstrip('/'):incoming.add((route,u.path.rstrip('/'),u.fragment))
needed=routes|{x[1] for x in outgoing}|{x[0] for x in incoming}|{'/vault/games/star-control'}
with ThreadPoolExecutor(max_workers=10) as pool:downloaded=dict(zip(sorted(needed),pool.map(get,sorted(needed))))
pages={route:Page(x['data'].decode()) for route,x in downloaded.items()};results=[]
for e in entries:
 route='/vault/'+e['path'];p=pages[route];expected=local(route)
 assert p.review==['true'],(route,p.review);assert 'noindex' not in p.meta.get('robots','');assert len(p.canonical)==1 and urlsplit(p.canonical[0]).path.rstrip('/')==route
 assert p.prose()==expected.prose(),('live article text differs from approved build',route)
 results.append({'id':e['id'],'path':e['path'],'url':base+route,'status':200,'reviewed':True,'indexable':True,'canonical':p.canonical[0],'mainTextSha256':hashlib.sha256(p.prose().encode()).hexdigest(),'matchesApprovedBuild':True})
for origin,target,fragment in outgoing:
 assert target in pages
 if fragment:assert unquote(fragment) in pages[target].ids,(origin,target,fragment)
for origin,target,fragment in incoming:
 assert any(urlsplit(h).path.rstrip('/')==target and urlsplit(h).fragment==fragment for h in pages[origin].links),(origin,target,fragment)
 if fragment:assert unquote(fragment) in pages[target].ids,(origin,target,fragment)
assets=json.loads((ev/'built-results.json').read_text())['images'];assert len(assets)==21
with ThreadPoolExecutor(max_workers=8) as pool:imagebytes=dict(zip(assets,pool.map(get,assets)))
for url,sha in assets.items():assert hashlib.sha256(imagebytes[url]['data']).hexdigest()==sha,url
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'};index=get('/sitemap-index.xml');tree=ET.fromstring(index['data']);locations=[x.text for x in tree.findall('s:sitemap/s:loc',ns)];assert locations
sitemap=set()
for url in locations:
 assert urlsplit(url).netloc=='code198x.com';xml=ET.fromstring(get(url)['data']);sitemap.update(urlsplit(x.text).path.rstrip('/') for x in xml.findall('s:url/s:loc',ns))
assert routes<=sitemap,routes-sitemap
control=pages['/vault/games/star-control'];assert control.review==['false'] and 'noindex' in control.meta.get('robots','') and '/vault/games/star-control' not in sitemap
assert len(results)==88 and all(e['matchesApprovedBuild'] for e in results)
report={'verifiedAt':datetime.now(UTC).isoformat(),'expectedDeploymentRevision':sys.argv[1] if len(sys.argv)>1 else None,'entries':results,'pagesFetched':len(pages),'outgoingVaultLinksChecked':len(outgoing),'incomingLinksChecked':len(incoming),'imageHashes':assets,'sitemapEntriesVerified':88,'unreviewedControl':'games/star-control'}
(ev/'live-results.json').write_text(json.dumps(report,indent=2)+'\n');print('LIVE: 88 reviewed canonical pages match approved build;',len(incoming),'incoming links;',len(outgoing),'outgoing links;',len(assets),'image hashes; all 88 in sitemap.')
