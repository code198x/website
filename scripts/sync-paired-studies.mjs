/** Adapt the two agreed studies from committed canonical documentation. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2);
const option=name=>{const i=args.indexOf(name);if(i<0||!args[i+1])throw Error(`Pass ${name}`);return args[i+1]};
const slug=option('--slug');
const settings={
 'monty-mole':{sources:6,figures:3,quotes:[['## The crusher problem','Knowing where to jump is only part of knowing what to do.'],['## Coal was not an abstract collectible','A game can grow out of hardship and still be funny.']]},
 elite:{sources:11,figures:4,quotes:[['The historical table also lists enslaved people as a commodity.','We have not earned anything by buying cheaply. We have exchanged cash for a possibility.'],['## What does “Elite” actually measure?','An upgrade can have value because of what it lets us stop doing.']]},
}[slug];
if(!settings)throw Error('Choose monty-mole or elite');
const source=path.resolve(option('--source-dir'));const check=args.includes('--check');
const revision=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(execFileSync('git',['-C',source,'status','--porcelain','--','.'],{encoding:'utf8'}).trim())throw Error('Commit the source study before syncing.');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const records=[];const outputs=new Map();
const raw=await fs.readFile(path.join(source,'study.md'));let body=raw.toString('utf8');
const title=body.match(/^# (.+)$/m)?.[1];if(!title)throw Error('Missing title');
body=body.replace(/^# .+\n+/,'').replaceAll('](https://code198x.com/','](/');
let figures=0;
body=body.replace(/!\[([^\]]+)\]\(((?:figures|captures)\/[^)]+)\)\n\n\*([^\n]+)\*/g,(_,alt,src,caption)=>{
 figures++;const bytes=execFileSync('git',['-C',source,'show',`${revision}:studies/${slug}/${src}`]);
 const attrs={src:`/images/studies/${slug}/${src}`,alt,caption,size:src.startsWith('captures/')?'reading':'wide'};
 if(src.endsWith('.png')){attrs.width=bytes.readUInt32BE(16);attrs.height=bytes.readUInt32BE(20);attrs.pixels=true;}
 else{
  const dimensions=bytes=>{const s=bytes.toString();const w=s.match(/<svg[^>]*\bwidth="(\d+)"/);const h=s.match(/<svg[^>]*\bheight="(\d+)"/);if(!w||!h)throw Error('SVG needs dimensions');return [Number(w[1]),Number(h[1])]};
  [attrs.width,attrs.height]=dimensions(bytes);const phone=src.replace('.svg','-phone.svg');const phoneBytes=execFileSync('git',['-C',source,'show',`${revision}:studies/${slug}/${phone}`]);
  attrs.phoneSrc=`/images/studies/${slug}/${phone}`;[attrs.phoneWidth,attrs.phoneHeight]=dimensions(phoneBytes);
 }
 return '<ArticleFigure '+Object.entries(attrs).map(([k,v])=>`${k}={${JSON.stringify(v)}}`).join(' ')+' />';
});
if(figures!==settings.figures)throw Error(`Expected ${settings.figures} figures; got ${figures}`);
for(const [anchor,quote] of settings.quotes){
 const prose=body.slice(0,body.indexOf('## Sources and further reading'));
 // Quotes may span adjacent sentences, but must reproduce real prose.
 if(!prose.replaceAll('\n\n',' ').includes(quote)||!body.includes(anchor))throw Error('Missing pull-quote text/anchor');
 body=body.replace(anchor,`<ArticlePullQuote text={${JSON.stringify(quote)}} duplicate={true} />\n\n${anchor}`);
}
const marker='## Sources and further reading';const split=body.indexOf(marker);if(split<0)throw Error('Missing bibliography');
const main=body.slice(0,split).replace(/\[(\d+)\](?!\()/g,(_,n)=>`[${n}](#source-${n})`);
const bibliography=body.slice(split).replace(/^(\d+)\. /gm,(_,n)=>`${n}. <span id="source-${n}"></span>`);
if((bibliography.match(/id="source-/g)??[]).length!==settings.sources)throw Error('Unexpected source count');
body=(main+bibliography).replace(/\]\(([^)]+)\)/g,(all,href)=>/^(https?:|\/|#)/.test(href)?all:`](https://github.com/code198x/docs/blob/${revision}/studies/${slug}/${href})`);
outputs.set(`src/previews/${slug}/study.mdx`,Buffer.from(`---\ntitle: ${JSON.stringify(title)}\n---\n\nimport ArticleFigure from '@components/editorial/ArticleFigure.astro';\nimport ArticlePullQuote from '@components/editorial/ArticlePullQuote.astro';\n\n${body}`));
records.push({source:'study.md',sha256:digest(raw)});
for(const dir of ['figures','captures','artwork']){
 for(const name of (await fs.readdir(path.join(source,dir))).sort()){
  const bytes=await fs.readFile(path.join(source,dir,name));
  const dest=dir==='artwork'?(name.startsWith('header-')?name:`artwork-${name}`):`${dir}/${name}`;
  outputs.set(`public/images/studies/${slug}/${dest}`,bytes);records.push({source:`${dir}/${name}`,output:dest,sha256:digest(bytes)});
 }
}
outputs.set(`src/previews/${slug}/source.json`,Buffer.from(JSON.stringify({revision,canonical:`https://github.com/code198x/docs/blob/${revision}/studies/${slug}/study.md`,records},null,2)+'\n'));
const mismatches=[];
for(const [file,bytes] of outputs){
 if(check){let current;try{current=await fs.readFile(file)}catch{mismatches.push(file);continue}if(!current.equals(bytes))mismatches.push(file)}
 else{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes)}
}
if(mismatches.length)throw Error('Canonical source mismatch: '+mismatches.join(', '));
console.log(`${check?'Verified':'Synced'} ${slug}: ${outputs.size} files from ${revision.slice(0,12)}.`);
