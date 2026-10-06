/** BASIC line numbers let inserted lines keep later unchanged lines aligned. */
export function listingChanges(original: string, edited: string) {
 const key=(line:string,index:number)=>line.match(/^\s*(\d+)\b/)?.[1] ?? `row-${index}`;
 const before=original.split('\n');
 const originals=new Map(before.map((line,index)=>[key(line,index),line]));
 const seen=new Set<string>();
 const lines=edited.split('\n').map((line,index)=>{
  const id=key(line,index);seen.add(id);
  const baseline=originals.get(id);
  if(baseline===line)return {from:0,to:0,changed:false,removed:false};
  if(baseline===undefined)return {from:0,to:line.length,changed:true,removed:false};
  let from=0,end=line.length,oldEnd=baseline.length;
  while(from<end&&from<oldEnd&&line[from]===baseline[from])from++;
  while(end>from&&oldEnd>from&&line[end-1]===baseline[oldEnd-1]){end--;oldEnd--;}
  // A deletion has no surviving glyph to mark; mark its line and keep the original available.
  return {from:end===from?0:from,to:end===from?line.length:end,changed:true,removed:oldEnd-from>end-from};
 });
 return {lines,removedLines:[...originals.keys()].filter(id=>!seen.has(id)).length,changed:original!==edited};
}
