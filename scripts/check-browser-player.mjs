import {existsSync, readFileSync, readdirSync} from 'node:fs';
const root=new URL('../public/emulators/',import.meta.url);
for(const file of ['index.html','catalog.json','worker.js','player.js','embed.js','template.html','player.css','audio.js','mouse.js','session-controls.js','storage.js','save-file.js','preferences.js','player-extras.js']) {
  if(!existsSync(new URL(file,root)))throw new Error('Browser player missing. Run npm run build:player with an Emu198x checkout available.');
}
const build=JSON.parse(readFileSync(new URL('build.json',root),'utf8'));
for(const family of build.families) {
  const name=`emu198x_${family.replaceAll('-','_')}_web`;
  for(const ext of ['js','wasm']) {
    const file=`modules/${family}/${name}${ext==='wasm'?'_bg':''}.${ext}`;
    if(!existsSync(new URL(file,root)))throw new Error(`Player module missing: ${file}. Run npm run build:player.`);
  }
}

if(process.argv.includes('--built')) {
  const catalog=JSON.parse(readFileSync(new URL('catalog.json',root),'utf8'));
  const codeSite=true;
  for(const entry of catalog) {
    // The site's system page is whichever alias it builds as a real page; an
    // alias may now be an old ID that only redirects (zx81 -> sinclair-zx81).
    const systemPage=(s)=>{const u=new URL(`../dist/systems/${s}/index.html`,import.meta.url);if(!existsSync(u))return null;const html=readFileSync(u,'utf8');return html.includes('http-equiv="refresh"')?null:html;};
    const slug=codeSite ? entry.aliases.find((a)=>systemPage(a)) ?? entry.aliases[0] : entry.siteId || entry.id;
    const page=systemPage(slug) ?? readFileSync(new URL(`../dist/systems/${slug}/index.html`,import.meta.url),'utf8');
    if(!page.includes(`<emu198x-player system="${entry.id}"`))throw new Error(`Inline player missing from ${slug}`);
    if(page.includes(`src="/emulators/index.html?`))throw new Error(`Old iframe player remains on ${slug}`);
    if(codeSite)for(const [alias,variant] of Object.entries(entry.variantAliases || {})) {
      const clone=readFileSync(new URL(`../dist/systems/${alias}/index.html`,import.meta.url),'utf8');
      if(!clone.includes(`<emu198x-player system="${entry.id}" variant="${variant}"`))throw new Error(`Variant player missing from ${alias}`);
    }
  }
  for(const family of build.families) {
    const name=`emu198x_${family.replaceAll('-','_')}_web_bg.wasm`;
    if(!existsSync(new URL(`../dist/emulators/modules/${family}/${name}`,import.meta.url)))throw new Error(`Built site missing ${family} WASM`);
  }
  console.log(`${catalog.length} system embeds and all browser modules verified in built site.`);
}

for(const family of build.fleetFamilies || []) {
  for(const file of ['emu198x_fleet_web.js','emu198x_fleet_web_bg.wasm']) {
    if(!existsSync(new URL(`modules/${family}/${file}`,root)))throw new Error(`Missing fleet module: ${family}/${file}`);
    if(process.argv.includes('--built') && !existsSync(new URL(`../dist/emulators/modules/${family}/${file}`,import.meta.url)))throw new Error(`Built site missing ${family}/${file}`);
  }
}

const catalogue=JSON.parse(readFileSync(new URL('catalog.json',root),'utf8'));
for(const entry of catalogue)if(entry.demo) {
 if(!existsSync(new URL(entry.demo.url,root)))throw new Error(`Missing demo: ${entry.id}`);
 if(process.argv.includes('--built') && !existsSync(new URL(`../dist/emulators/${entry.demo.url}`,import.meta.url)))throw new Error(`Built site missing demo: ${entry.id}`);
}

if(process.argv.includes('--built')) {
 const site=new URL('../dist/',import.meta.url);
 let lessons=0;
 function inspect(directory) {
  for(const item of readdirSync(directory,{withFileTypes:true})) {
   const file=new URL(item.name+(item.isDirectory()?'/':''),directory);
   if(item.isDirectory()){inspect(file);continue;}
   if(item.name!=='index.html')continue;
   const html=readFileSync(file,'utf8');
   if(!html.includes('class="lesson-player"'))continue;
   lessons++;
   for(const [,src] of html.matchAll(/<emu198x-player[^>]*src="([^" ]+)"/g)) {
    if(!src.startsWith('/code-samples/') || !existsSync(new URL(src.slice(1),site)))throw new Error(`Missing lesson media: ${src}`);
   }
  }
 }
 inspect(new URL('systems/',site));
 console.log(`${lessons} lesson pages checked for runnable media.`);
}
