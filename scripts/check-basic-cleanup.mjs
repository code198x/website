import {readFileSync,existsSync} from 'node:fs';
import {load} from 'js-yaml';
import {basicRetirementRedirects} from '../src/lib/basic-retirement-redirects.mjs';
const modules=load(readFileSync('src/content/modules/sinclair-zx-spectrum/basic.yaml','utf8')).modules;
const retired=['story-builder','lucky-number','oracle-stone'];
for(const slug of retired){
 if(modules.some(m=>m.slug===slug)||existsSync(`src/content/curriculum/sinclair-zx-spectrum/basic/${slug}`))throw Error('Still published: '+slug);
}
for(const [from,to] of Object.entries(basicRetirementRedirects)){
 const html=readFileSync('dist'+from+'/index.html','utf8');
 if(!html.includes(to)||!existsSync('dist'+to+'index.html'))throw Error('Broken retirement redirect: '+from);
}
console.log(`PASS retired modules and ${Object.keys(basicRetirementRedirects).length} redirects`);
