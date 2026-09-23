// Isolate assembly from the page. The caller terminates this worker on timeout.
import init, {assemble} from '/wasm/asm198x-mos6502/asm198x_web.js';
self.onmessage=async ({data})=>{
 try {
  if(typeof data.source!=='string' || data.source.length>262144)throw new Error('Keep this example below 256 KiB of source.');
  await init();
  const json=assemble('ca65',data.source);
  if(!json)throw new Error('The assembler could not process this source.');
  const result=JSON.parse(json);
  if(Array.isArray(result)){self.postMessage({diagnostics:result});return;}
  const bytes=new Uint8Array(result.bytes);
  if(bytes.length<16 || bytes.length>2097152 || bytes[0]!==78 || bytes[1]!==69 || bytes[2]!==83 || bytes[3]!==26)throw new Error('The source must produce an iNES cartridge smaller than 2 MiB. Check the HEADER segment.');
  self.postMessage({bytes,warnings:result.warnings || []},[bytes.buffer]);
 }catch(error){self.postMessage({error:error.message || String(error)});}
};
