from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib,re
r=Path(__file__).resolve().parents[3];ev=Path(__file__).resolve().parent
entries=json.loads((ev/'entries.json').read_text());unchanged=json.loads((ev/'unchanged-entries.json').read_text())
assert len(entries)==88 and len({e['path'] for e in entries})==88
class Page(HTMLParser):
 def __init__(self,text):super().__init__();self.ids=set();self.links=[];self.meta={};self.review=[];self.canonical=[];self.images=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if d.get('id'):self.ids.add(d['id'])
  if tag=='a' and d.get('href'):self.links.append(d['href'])
  if tag=='meta':self.meta[d.get('name')]=d.get('content')
  if d.get('id')=='article-status':self.review.append(d.get('data-reviewed'))
  if tag=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if tag=='img':self.images.append(d)
def page(route):
 p=r/'dist'/route.strip('/')/'index.html';assert p.is_file(),route;return Page(p.read_text())
xml=''.join(p.read_text() for p in (r/'dist').glob('sitemap*.xml'));results=[];links=0;images={}
for e in entries:
 path=e['path'];source=r/'src/content/vault'/(path+'.mdx');data=source.read_bytes();assert hashlib.sha256(data).hexdigest()==e['sha256'];restored=data.decode().replace('reviewed: true','reviewed: false',1)
 if e.get('dateCitationRepair'):
  restored=re.sub(r'^sources:\n  context: .+\n  released:\n(?:    - .+\n?)+',e['dateCitationRepair']['originalSourcesLine']+'\n',restored,count=1,flags=re.M)
  if e.get('addedVisibleSource'):restored=restored.replace(e['addedVisibleSource'],'',1)
 assert hashlib.sha256(restored.encode()).hexdigest()==e['beforeSha256'],e['path']
 route='/vault/'+path;p=page(route);assert p.review==['true'];assert 'noindex' not in p.meta.get('robots','');assert len(p.canonical)==1 and urlsplit(p.canonical[0]).path.rstrip('/')==route;assert route+'<' in xml or route+'/'+'<' in xml
 for href in p.links:
  u=urlsplit(href)
  if u.scheme or u.netloc:continue
  target=u.path or route
  if not target.startswith('/vault/'):continue
  q=page(target)
  if u.fragment:assert unquote(u.fragment) in q.ids,(path,href)
  links+=1
 for im in p.images:
  src=im.get('src','')
  if src.startswith('/images/vault/'):
   b=(r/'public'/src.lstrip('/')).read_bytes();assert im.get('alt');images[src]=hashlib.sha256(b).hexdigest()
 results.append({'path':path,'reviewed':True,'indexable':True,'canonical':p.canonical[0],'inSitemap':True})
for e in unchanged:assert hashlib.sha256((r/'src/content/vault'/(e['path']+'.mdx')).read_bytes()).hexdigest()==e['sha256'],e['path']
control=next((e for e in unchanged if re.search(r'^reviewed: false$',(r/'src/content/vault'/(e['path']+'.mdx')).read_text(),re.M)),None)
if control:
 p=page('/vault/'+control['path']);assert p.review==['false'];assert 'noindex' in p.meta['robots'];assert '/vault/'+control['path']+'<' not in xml
else:assert all(e['reviewed'] for e in unchanged)
(ev/'built-results.json').write_text(json.dumps({'entries':results,'outgoingVaultLinksChecked':links,'unchangedArticles':len(unchanged),'unreviewedControl':control['path'] if control else None,'images':images},indent=2)+'\n')
print('88 reviewed, indexable canonical pages in sitemap;',len(unchanged),'other articles unchanged;',links,'links;',len(images),'images')
