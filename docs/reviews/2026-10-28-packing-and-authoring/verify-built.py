from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,hashlib
r=Path(__file__).resolve().parents[3];ev=r/'docs/reviews/2026-10-28-packing-and-authoring';entries=json.loads((ev/'entries.json').read_text());backlinks=json.loads((ev/'backlinks.json').read_text())
assert len(entries)==16 and len({e['path'] for e in entries})==16

class Page(HTMLParser):
 def __init__(self,s):super().__init__();self.ids=set();self.links=[];self.meta={};self.review=[];self.feed(s)
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if d.get('id'):self.ids.add(d['id'])
  if tag=='a' and d.get('href'):self.links.append(d['href'])
  if tag=='meta':self.meta[d.get('name')]=d.get('content')
  if d.get('id')=='article-status':self.review.append(d.get('data-reviewed'))
def page(slug):return Page((r/'dist'/slug.strip('/')/'index.html').read_text())
xml=''.join(p.read_text() for p in (r/'dist').glob('sitemap*.xml'));out=[]
for e in entries:
 slug='/vault/'+e['path'];p=page(slug);assert p.review==['false'];assert 'noindex' in p.meta['robots'];assert slug+'<' not in xml and slug+'/'+'<' not in xml
 assert hashlib.sha256((r/'src/content/vault'/(e['path']+'.mdx')).read_bytes()).hexdigest()==e['sha256']
 refs=0
 for href in p.links:
  u=urlsplit(href)
  if u.scheme or u.netloc or not u.fragment:continue
  target=u.path or slug
  if target.startswith('/vault/'):assert unquote(u.fragment) in page(target).ids,(slug,href);refs+=1
 out.append({'entry':e['path'],'reviewed':False,'noindex':True,'sitemap':False,'localFragmentTargets':refs})
for b in backlinks:
 if b['result'] not in ['added','already-linked']:continue
 href='/vault/'+b['to'];assert href in page('/vault/'+b['from']).links,b
 u=urlsplit(href)
 if u.fragment:assert unquote(u.fragment) in page(u.path).ids,b
control='/vault/hardware/vic-ii';assert page(control).review==['true'];assert control in xml
previous=[]
for p in (r/'docs/reviews').rglob('entries.json'):
 if p.parent==ev or not any(d in str(p) for d in ['2026-10-27','2026-10-28-music-and-sharing']):continue
 for e in json.loads(p.read_text()):
  if isinstance(e,dict):
   target=e.get('path') or ('hardware/'+e['slug'] if e.get('slug') and 'chips-and-displays' in str(p) else None)
   if target:
    assert page('/vault/'+target).review==['false'],target;previous.append(target)
(ev/'built-results.json').write_text(json.dumps({'entries':out,'backlinksVerified':sum(b['result'] in ['added','already-linked'] for b in backlinks),'priorUnreviewedPreserved':len(previous),'reviewedControl':{'path':control,'reviewed':True,'inSitemap':True}},indent=2)+'\n')
print('16 draft pages, incoming links/fragments and reviewed control verified; prior unreviewed pages:',len(previous))
