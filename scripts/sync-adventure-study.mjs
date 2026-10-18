/** Publish a reproducible, presentation-only adaptation of the committed study. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2);
const index=args.indexOf('--source-dir');
if(index<0||!args[index+1])throw Error('Pass --source-dir <documentation studies/adventure directory>');
const source=path.resolve(args[index+1]);
const check=args.includes('--check');
const revision=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(execFileSync('git',['-C',source,'status','--porcelain','--','.'],{encoding:'utf8'}).trim())throw Error('Commit the source study before syncing.');
const outputs=new Map();const records=[];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const bytes=await fs.readFile(path.join(source,'study.md'));
let markdown=bytes.toString('utf8');
const title=markdown.match(/^# (.+)$/m)?.[1];
if(!title)throw Error('Missing study title');
markdown=markdown.replace(/^# .+\n+/,'').replaceAll('](https://code198x.com/','](/');
let figures=0;
markdown=markdown.replace(/!\[([^\]]+)\]\((figures\/[^)]+\.svg)\)\n\n\*([^\n]+)\*/g,(_,alt,src,caption)=>{
 figures++;
 const svg=execFileSync('git',['-C',source,'show',`${revision}:studies/adventure/${src}`],{encoding:'utf8'});
 const phone=src.replace('.svg','-phone.svg');
 const phoneSVG=execFileSync('git',['-C',source,'show',`${revision}:studies/adventure/${phone}`],{encoding:'utf8'});
 const dimensions=text=>{const w=text.match(/<svg[^>]*\bwidth="([0-9]+)"/);const h=text.match(/<svg[^>]*\bheight="([0-9]+)"/);if(!w||!h)throw Error('Missing SVG dimensions');return [Number(w[1]),Number(h[1])];};
 const [width,height]=dimensions(svg);const [phoneWidth,phoneHeight]=dimensions(phoneSVG);
 const attrs={src:'/images/studies/adventure/'+src,phoneSrc:'/images/studies/adventure/'+phone,alt,width,height,phoneWidth,phoneHeight,caption,size:'wide'};
 return '<ArticleFigure '+Object.entries(attrs).map(([key,value])=>`${key}={${JSON.stringify(value)}}`).join(' ')+' />';
});
if(figures!==3)throw Error(`Expected three diagram subjects, found ${figures}`);
for(const [anchor,text] of [
 ['## Which Adventure are we playing?','The computer has remembered a change in the world.'],
 ['## The cave is data with rules attached','A good response lets a failed experiment narrow the field.'],
 ['## What does 350 measure?','The character may have lost everything, but the player remembers.'],
]){
 if(!markdown.includes(anchor)||!markdown.includes(text))throw Error('Review pull quote anchor/text: '+anchor);
 markdown=markdown.replace(anchor,`<ArticlePullQuote text={${JSON.stringify(text)}} duplicate={true} />\n\n${anchor}`);
}
const sourceMarker='## Sources and further reading';
const split=markdown.indexOf(sourceMarker);if(split<0)throw Error('Missing sources');
let body=markdown.slice(0,split).replace(/\[(\d+)\](?!\()/g,(_,n)=>`[${n}](#source-${n})`);
const bibliography=markdown.slice(split).replace(/^(\d+)\. /gm,(_,n)=>`${n}. <span id="source-${n}"></span>`);
if((bibliography.match(/id="source-/g)??[]).length!==16)throw Error('Expected sixteen numbered sources');
markdown=body+bibliography;
markdown=markdown.replace(/\]\(([^)]+)\)/g,(all,href)=>/^(https?:|\/|#)/.test(href)?all:`](https://github.com/code198x/docs/blob/${revision}/studies/adventure/${href})`);
outputs.set('src/previews/adventure/study.mdx',Buffer.from(`---\ntitle: ${JSON.stringify(title)}\n---\n\nimport ArticleFigure from '@components/editorial/ArticleFigure.astro';\nimport ArticlePullQuote from '@components/editorial/ArticlePullQuote.astro';\n\n${markdown}`));
records.push({source:'study.md',output:'study.mdx',sha256:digest(bytes)});
for(const name of (await fs.readdir(path.join(source,'figures'))).sort()){
 if(!name.endsWith('.svg'))continue;
 const bytes=await fs.readFile(path.join(source,'figures',name));
 outputs.set(`public/images/studies/adventure/figures/${name}`,bytes);
 records.push({source:`figures/${name}`,sha256:digest(bytes)});
}
outputs.set('src/previews/adventure/source.json',Buffer.from(JSON.stringify({revision,canonical:`https://github.com/code198x/docs/blob/${revision}/studies/adventure/study.md`,records},null,2)+'\n'));
const mismatches=[];
for(const [file,bytes] of outputs){
 if(check){let current;try{current=await fs.readFile(file)}catch{mismatches.push(file);continue}if(!current.equals(bytes))mismatches.push(file)}
 else{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes)}
}
if(mismatches.length)throw Error('Study differs from committed source: '+mismatches.join(', '));
console.log(`${check?'Verified':'Synced'} ${outputs.size} files from ${revision.slice(0,12)}; diagrams copied byte for byte.`);
