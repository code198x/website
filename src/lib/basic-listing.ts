import {createHighlighterCore} from 'shiki/core';
import {createOnigurumaEngine} from 'shiki/engine/oniguruma';
import grammar from '../syntax/sinclair-basic.tmLanguage.json';
import {listingChanges} from './listing-changes';

const highlighter=createHighlighterCore({
 themes:[{name:'lesson-paper',type:'light',colors:{'editor.foreground':'#1b1a17','editor.background':'#fcfbf8'},tokenColors:[
  {scope:['keyword','support.function'],settings:{foreground:'#c20000'}},
  {scope:['constant.numeric','comment'],settings:{foreground:'#6b6559'}},
  {scope:['string','variable'],settings:{foreground:'#1b1a17'}},
 ]}],langs:[{...grammar,name:'sinclair-basic'}],engine:createOnigurumaEngine(import('shiki/wasm')),
});
const cleanups=new Set<()=>void>();
function initialise(){
for(const listing of document.querySelectorAll<HTMLElement>('[data-basic-listing]')){
 if(listing.dataset.highlightReady)continue;listing.dataset.highlightReady='true';
 const source=listing.querySelector<HTMLTextAreaElement>('textarea')!;
 const original=JSON.parse(listing.querySelector('.listing-original')!.textContent!);
 const editor=listing.querySelector<HTMLElement>('.listing-editor')!;
 const mirror=listing.querySelector<HTMLElement>('.listing-mirror')!;
 const changes=listing.querySelector<HTMLElement>('.listing-changes')!;
 let hl:Awaited<typeof highlighter>|null=null;
 function refresh(){
  const comparison=listingChanges(original,source.value);
  const count=comparison.lines.filter(line=>line.changed).length;
  changes.textContent=!comparison.changed?'Original code':[
   count?`${count} ${count===1?'line':'lines'} edited`:null,
   comparison.removedLines?`${comparison.removedLines} ${comparison.removedLines===1?'line':'lines'} removed`:null,
  ].filter(Boolean).join(' · ') || 'Line order changed';
  const style=getComputedStyle(source);
  source.style.height=`${Math.min(440,Math.max(3,source.value.split('\n').length)*parseFloat(style.lineHeight)+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom))}px`;
  if(!hl)return;
  const fragment=document.createDocumentFragment();
  const lines=hl.codeToTokens(source.value,{lang:'sinclair-basic',theme:'lesson-paper'}).tokens;
  lines.forEach((tokens,index)=>{
   const diff=comparison.lines[index];let offset=0;
   for(const token of tokens){
    const start=offset,end=start+token.content.length;
    const cuts=[start,...[diff?.from,diff?.to].filter((n):n is number=>n!==undefined&&n>start&&n<end),end].sort((a,b)=>a-b);
    for(let i=0;i<cuts.length-1;i++){
     const marked=diff?.changed&&cuts[i]>=diff.from&&cuts[i]<diff.to;
     const span=document.createElement(marked?'mark':'span');span.textContent=token.content.slice(cuts[i]-start,cuts[i+1]-start);span.style.color=token.color??'#1b1a17';fragment.append(span);
    }
    offset=end;
   }
   if(index<lines.length-1)fragment.append('\n');
  });
  fragment.append(' ');mirror.replaceChildren(fragment);editor.classList.add('highlighted');syncScroll();
 }
 function syncScroll(){mirror.scrollTop=source.scrollTop;mirror.scrollLeft=source.scrollLeft;}
 source.addEventListener('input',refresh);source.addEventListener('scroll',syncScroll);
 addEventListener('resize',refresh);
 listing.querySelector('.listing-reset')!.addEventListener('click',()=>{source.value=original;source.dispatchEvent(new Event('input'));source.focus();});
 cleanups.add(()=>removeEventListener('resize',refresh));
 refresh();void highlighter.then(value=>{if(!listing.isConnected)return;hl=value;refresh();}).catch(()=>{/* Native editing remains available if highlighting cannot load. */});
}

}
initialise();
document.addEventListener('astro:page-load',initialise);
document.addEventListener('astro:before-swap',()=>{for(const clean of cleanups)clean();cleanups.clear();});
