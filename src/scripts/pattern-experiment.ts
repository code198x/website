import {buttons,pressEdges,scheduleTone,player,start,targetFor,turnOptions,chooseTurn,type Point} from '../lib/pattern-experiment';
function initialise(){
 document.querySelectorAll<HTMLElement>('[data-input-experiment]').forEach(root=>{
  if(root.dataset.ready)return;root.dataset.ready='true';root.querySelectorAll<HTMLElement>('[data-enhanced]').forEach(e=>e.hidden=false);
  let previous=0,samples=0,events=0,audio:AudioContext|undefined;
  const checkboxes=[...root.querySelectorAll<HTMLInputElement>('[data-button]')];
  const held=()=>checkboxes.reduce((v,c)=>v|(c.checked?buttons[c.dataset.button as keyof typeof buttons]:0),0);
  const text=(selector:string,value:string)=>{root.querySelector(selector)!.textContent=value;};
  const binary=(n:number)=>n.toString(2).padStart(8,'0');
  const display=(current:number,edges:number)=>{text('[data-current]',binary(current));text('[data-edges]',binary(edges));text('[data-events]',String(events));};
  root.querySelector('[data-sample]')!.addEventListener('click',()=>{
   const current=held(),edges=pressEdges(current,previous),fire=Boolean(edges&buttons.fire);samples++;if(fire){events++;if(audio?.state==='running')scheduleTone(audio);}
   display(current,edges);text('[data-input-status]',`Sample ${samples}: ${edges?'new pressed bits '+edges:'no new press'}. ${events} sound ${events===1?'event':'events'}.`);
   const row=document.createElement('tr');for(const value of [samples,previous,current,edges,fire?'Trigger':'—']){const cell=document.createElement('td');cell.textContent=String(value);row.append(cell);}
   const trace=root.querySelector('[data-trace]')!;trace.prepend(row);while(trace.children.length>8)trace.lastElementChild!.remove();previous=current;
  });
  root.querySelector('[data-seed]')!.addEventListener('click',()=>{previous=held();display(previous,0);text('[data-input-status]','History seeded from the held controls. Release and press Fire again to create its next edge.');});
  root.querySelector('[data-reset]')!.addEventListener('click',()=>{previous=0;samples=0;events=0;checkboxes.forEach(c=>c.checked=false);display(0,0);root.querySelector('[data-trace]')!.replaceChildren();text('[data-input-status]','Reset. No held controls or input history.');});
  const audioButton=root.querySelector<HTMLButtonElement>('[data-audio]')!;
  if(!window.AudioContext){audioButton.disabled=true;text('[data-audio-status]','Audio is unavailable here. The event trace still works.');}
  audioButton.addEventListener('click',async()=>{
   audioButton.disabled=true;
   try{
    if(audio?.state==='running'){await audio.suspend();audioButton.textContent='Enable sound';audioButton.setAttribute('aria-pressed','false');text('[data-audio-status]','Sound is off. Events remain visible.');}
    else{audio??=new AudioContext();await audio.resume();audioButton.textContent='Mute sound';audioButton.setAttribute('aria-pressed','true');text('[data-audio-status]','Sound is on. A new Fire press plays one short browser tone.');}
   }catch{text('[data-audio-status]','Sound could not start. Try Enable sound again; the event trace still works.');}
   finally{audioButton.disabled=false;}
  });
  const release=()=>{checkboxes.forEach(c=>c.checked=false);};
  window.addEventListener('blur',release);
  const visibility=()=>{if(document.hidden){release();audio?.suspend();audioButton.textContent='Enable sound';audioButton.setAttribute('aria-pressed','false');text('[data-audio-status]','Sound is off. Events remain visible.');}};
  document.addEventListener('visibilitychange',visibility);
  document.addEventListener('astro:before-swap',()=>{window.removeEventListener('blur',release);document.removeEventListener('visibilitychange',visibility);void audio?.close();},{once:true});
 });
 document.querySelectorAll<HTMLElement>('[data-pursuit-experiment]').forEach(root=>{
  if(root.dataset.ready)return;root.dataset.ready='true';root.querySelectorAll<HTMLElement>('[data-enhanced]').forEach(e=>e.hidden=false);
  let position:Point={...start};const mode=root.querySelector<HTMLSelectElement>('[data-target]')!;
  const step=root.querySelector<HTMLButtonElement>('[data-step]')!;
  function draw(message?:string){
   const target=targetFor(mode.value==='ahead'),choice=chooseTurn(position,target);
   const mark=root.querySelector('[data-target-mark]')!;mark.setAttribute('x',String(target.x*60+3));mark.setAttribute('y',String(target.y*60+3));
   const actor=root.querySelector('[data-pursuer]')!;actor.setAttribute('cx',String(position.x*60+30));actor.setAttribute('cy',String(position.y*60+30));
   const reached=position.x===player.x&&position.y===player.y;step.disabled=reached||!choice;
   root.querySelector('[data-turns]')!.replaceChildren(...turnOptions(position,target).map(o=>{const tr=document.createElement('tr');if(choice?.name===o.name)tr.className='chosen-turn';for(const value of [o.name,o.legal?o.distance:'—',!o.legal?'Wall':choice?.name===o.name?'Chosen':'']){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}return tr;}));
   root.querySelector('[data-pursuit-status]')!.textContent=message??`Pursuer (${position.x}, ${position.y}); target (${target.x}, ${target.y}). ${reached?'Reached the player’s tile. Restart to compare.':choice?'Next turn: '+choice.name+'.':'No legal move.'}`;
   root.querySelector('#board-desc')!.textContent=`Blue pursuer at (${position.x}, ${position.y}), amber player at (5, 3) facing Up; target (${target.x}, ${target.y}).`;
  }
  mode.addEventListener('change',()=>{position={...start};draw();});step.addEventListener('click',()=>{const choice=chooseTurn(position,targetFor(mode.value==='ahead'));if(choice)position=choice.next;draw();});
  root.querySelector('[data-restart]')!.addEventListener('click',()=>{position={...start};draw();});draw();
 });
}
initialise();document.addEventListener('astro:page-load',initialise);
