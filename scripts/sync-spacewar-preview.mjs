/** Sync a committed documentation study into the development-only specimen. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const args = process.argv.slice(2);
const sourceIndex = args.indexOf('--source-dir');
if (sourceIndex < 0 || !args[sourceIndex + 1]) throw new Error('Pass --source-dir <documentation studies/spacewar directory>');
const source = path.resolve(args[sourceIndex + 1]);
const check = args.includes('--check');
const revision = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
if (execFileSync('git', ['-C', source, 'status', '--porcelain', '--', '.'], {encoding:'utf8'}).trim()) throw new Error('Commit the source study before syncing; the preview must identify a reproducible revision.');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const outputs = new Map();
const records = [];
const files = [
 ['study.md','study.mdx'],
 ['companions/shooting-from-a-moving-ship.md','moving-shot.mdx'],
 ['companions/designing-a-duel.md','duel-design.mdx'],
 ['captures/README.md','capture-credits.mdx'],
];
const routeMap = {
 'companions/shooting-from-a-moving-ship.md':'/catalogue/editorial-study/moving-shot/',
 'companions/designing-a-duel.md':'/catalogue/editorial-study/duel-design/',
};
const figureTitles = {'opening.png':'Meet the two ships','exchange.png':'A shot crosses the duel','destruction.png':'Both ships lost','coast.svg':'Facing and moving','thrust.svg':'Add thrust to existing motion','gravity.svg':'Gravity changes velocity','control-response.svg':'From a control to a change of position'};
for (const [name, output] of files) {
 const bytes = await fs.readFile(path.join(source,name));
 let markdown = bytes.toString('utf8');
 const title = markdown.match(/^# (.+)$/m)?.[1];
 if (!title) throw new Error(`Missing title: ${name}`);
 markdown = markdown.replace(/^# .+\n+/, '');
 // Keep published-site destinations local while reviewing newly drafted entries.
 markdown = markdown.replaceAll('](https://code198x.com/', '](/');
 if (name === 'study.md') {
  let figures = 0;
  markdown = markdown.replace(/!\[([^\]]+)\]\(([^)]+)\)\n\n\*([^\n]+)\*/g, (_, alt, src, caption) => {
   figures++;
   const base = path.basename(src);
   const pixels = src.startsWith('captures/');
   const attrs = {src:'/images/studies/spacewar/'+src, alt, width:512, height:512, caption, title:figureTitles[base], size:pixels?'aside':'wide'};
   if (!pixels) {
    const svg = execFileSync('git',['-C',source,'show',`${revision}:studies/spacewar/${src}`],{encoding:'utf8'});
    const width = svg.match(/<svg[^>]*\bwidth="([0-9]+)"/);const height = svg.match(/<svg[^>]*\bheight="([0-9]+)"/);
    if (!width || !height) throw new Error(`Missing SVG dimensions: ${src}`);
    attrs.width=Number(width[1]);attrs.height=Number(height[1]);
   }
   const props=Object.entries(attrs).map(([key,value])=>`${key}={${JSON.stringify(value)}}`).join(' ');
   return `<ArticleFigure ${props}${pixels?' pixels={true}':''} />`;
  });
  if (figures!==7) throw new Error(`Expected seven curated figures, found ${figures}; review the mapping.`);
  const sentence="That's why escaping takes more thought than pointing away from trouble.";
  if (!markdown.includes(sentence)) throw new Error('Motion anchor changed; review pull quote placement.');
  markdown = markdown.replace(sentence, `<ArticlePullQuote text="Facing and moving are different things." duplicate={true} />\n\n${sentence}`);
  const anchor='## Before the spaceships';
  if (!markdown.includes(anchor)) throw new Error('Cultural anchor changed; review pull quote placement.');
  markdown = markdown.replace(anchor, '<ArticlePullQuote text="You get a ship, another pilot and a situation." duplicate={true} />\n\n'+anchor);
 }
 markdown = markdown.replace(/\]\(([^)]+\.md)\)/g,(all,href)=>routeMap[href]?`](${routeMap[href]})`:all);
 // Companion/credit research links stay useful without inventing public routes.
 markdown = markdown.replace(/\]\(([^)]+)\)/g,(all,href)=>{
  if (/^(https?:|\/|#)/.test(href)) return all;
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(name),href));
  if (routeMap[target]) return `](${routeMap[target]})`;
  if (target==='study.md') return '](/catalogue/editorial-study/)';
  return `](https://github.com/code198x/docs/blob/${revision}/studies/spacewar/${target})`;
 });
 const imports='import ArticleFigure from \'@components/editorial/ArticleFigure.astro\';\nimport ArticlePullQuote from \'@components/editorial/ArticlePullQuote.astro\';\n\n';
 const text=`---\ntitle: ${JSON.stringify(title)}\n---\n\n${imports}${markdown}`;
 outputs.set('src/previews/spacewar/'+output,Buffer.from(text));
 records.push({source:name,output,sha256:digest(bytes)});
}
for (const dir of ['captures','figures']) {
 for (const name of await fs.readdir(path.join(source,dir))) {
  if (!/\.(png|svg)$/.test(name)) continue;
  const bytes=await fs.readFile(path.join(source,dir,name));
  outputs.set(`public/images/studies/spacewar/${dir}/${name}`,bytes);
  records.push({source:`${dir}/${name}`,sha256:digest(bytes)});
 }
}
outputs.set('src/previews/spacewar/source.json', Buffer.from(JSON.stringify({revision,canonical:`https://github.com/code198x/docs/blob/${revision}/studies/spacewar/study.md`,records},null,2)+'\n'));
const mismatches=[];
for(const [file,bytes] of outputs){
 if(check){let current;try{current=await fs.readFile(file)}catch{mismatches.push(file);continue}if(!current.equals(bytes))mismatches.push(file)}
 else{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes)}
}
if(mismatches.length)throw new Error('Preview differs from the committed study: '+mismatches.join(', '));
console.log(`${check?'Verified':'Synced'} ${outputs.size} files from documentation ${revision.slice(0,12)}; captures/diagrams copied byte for byte.`);
