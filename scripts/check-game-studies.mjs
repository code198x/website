/** Verify declared study routes against the production artefact, not just metadata. */
import fs from 'node:fs';
import path from 'node:path';
import {gameStudyPaths, unreviewedStudyPaths} from '../src/data/game-studies.mjs';
const root=process.argv[2]??'dist';
if(!fs.existsSync(root))throw Error('Build the site before checking study routes.');
const sitemapFiles=fs.readdirSync(root).filter(name=>/^sitemap.*\.xml$/.test(name));
if(!sitemapFiles.length)throw Error('Missing built sitemap.');
const sitemap=sitemapFiles.map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n');
for(const route of gameStudyPaths){
 const file=path.join(root,route,'index.html');
 if(!fs.existsSync(file))throw Error(`Declared study route was not built: ${route}`);
 const html=fs.readFileSync(file,'utf8');
 if((html.match(/<h1(?:\s|>)/g)??[]).length!==1)throw Error(`Expected one title: ${route}`);
 if(html.includes('href="/catalogue/editorial-study'))throw Error(`Production links to development specimen: ${route}`);
 const noindex=/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
 if(noindex!==unreviewedStudyPaths.has(route))throw Error(`Review and indexing state differ: ${route}`);
 const listed=sitemap.includes('https://code198x.com'+route+'</loc>');
 if(listed===unreviewedStudyPaths.has(route))throw Error(`Review and sitemap state differ: ${route}`);
}
if(fs.existsSync(path.join(root,'catalogue/editorial-study')))throw Error('Development specimen was published.');
console.log(`${gameStudyPaths.length} study/index/companion routes built; title, publication and sitemap states agree.`);
