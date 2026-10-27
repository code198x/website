import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const diagrams=[['spc700-s-dsp','audio-memory','https://floating.muncher.se/bot/manual/book1_text.pdf'],['antic-gtia','fetch-interpret','https://www.atariarchives.org/dere/'],['mc6845-crtc','addresses-pixels','https://archive.decromancer.ca/bitsavers.org/components/motorola/_dataSheets/6845.pdf'],['8563-vdc','private-memory','https://www.zimmers.net/anonftp/pub/cbm/manuals/c128/C128_Programmers_Reference_Guide.pdf'],['mega-drive-vdp','window-plane','https://techdocs.exodusemulator.com/Console/SegaMegaDrive/Documentation.html']];
const browser=await chromium.launch();
try {
 const page=await browser.newPage({deviceScaleFactor:2});
 for(const [slug,name,source] of diagrams){
  const prefix=`public/images/vault/hardware/${slug}/${name}`;
  const svg=await readFile(`${prefix}.svg`,'utf8');
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  const file=await page.locator('svg').screenshot({path:`${prefix}.png`});
  const manifest={entry:`vault/hardware/${slug}`,image_dir:`vault/hardware/${slug}`,captures:[{screenshots:[`${name}.png`],class:'original-diagram',source,credit:'Code198x',changes:'Original explanatory schematic; no third-party artwork, scan, logo or program code.',rights:'Original Code198x illustration',purpose:'Explain the functional distinction described in the accompanying article; a schematic, not measured timing.',sha256:createHash('sha256').update(file).digest('hex'),source_file:`${prefix}.svg`,source_sha256:createHash('sha256').update(svg).digest('hex')}]};
  await writeFile(`capture/vault/hardware-${slug}.json`,JSON.stringify(manifest,null,2)+'\n');
 }
} finally {await browser.close();}
