import { SpectrumRunner } from './spectrum-runner';
import { SoundControl } from './lesson-audio';

const cleanups = new Set<() => void>();
function initialise() {
 for (const root of document.querySelectorAll<HTMLElement>('.basic-playground')) {
  if (root.dataset.ready) continue;
  root.dataset.ready = 'true';
  const controller = new AbortController();
  const {signal} = controller;
  const panel = root.querySelector<HTMLDialogElement>('dialog')!;
  const listing = root.querySelector<HTMLElement>('.lesson-listing')!;
  const source = listing.querySelector<HTMLTextAreaElement>('textarea')!;
  const run = listing.querySelector<HTMLButtonElement>('.listing-run')!;
  const back = root.querySelector<HTMLButtonElement>('.return-spectrum')!;
  const download = listing.querySelector<HTMLButtonElement>('.listing-download')!;
  const status = listing.querySelector<HTMLElement>('.listing-status')!;
  const error = listing.querySelector<HTMLElement>('.listing-error')!;
  const canvas = panel.querySelector<HTMLCanvasElement>('canvas')!;
  const pause = panel.querySelector<HTMLButtonElement>('.pause-machine')!;
  const restart = panel.querySelector<HTMLButtonElement>('.restart-machine')!;
  const keys = panel.querySelector<HTMLFieldSetElement>('.machine-input-keys')!;
  const machineStatus = panel.querySelector<HTMLElement>('.machine-status')!;
  const failure = panel.querySelector<HTMLElement>('.machine-failure')!;
  const pausedNote = panel.querySelector<HTMLElement>('.paused-note')!;
  const transcript = panel.querySelector<HTMLElement>('.machine-transcript pre')!;
  let runner: SpectrumRunner | null = null;
  let selected: {source: string; tape: Uint8Array} | null = null;
  let hasStarted=false;
  let busy = false, disposed = false, opener: HTMLElement = run;
  let taps: string[] = [], activeTap: string | null = null, tapAt = 0, ticks = 0;
  const say = (text: string) => { machineStatus.textContent = text; };
  const sound = new SoundControl(panel.querySelector<HTMLInputElement>('.machine-sound')!, {
   running: () => runner !== null, attach: sink => runner?.setAudio(sink), unavailable: say,
  });
  const release = () => { runner?.releaseKeys(); taps=[]; activeTap=null; tapAt=0; };
  function frame() {
   const now=performance.now();
   if(activeTap && now>=tapAt){runner?.setKey(activeTap,false);activeTap=null;tapAt=now+100;}
   else if(!activeTap && taps.length && now>=tapAt){activeTap=taps.shift()!;runner?.setKey(activeTap,true);tapAt=now+100;}
   if(++ticks%10===0 && runner) transcript.textContent=runner.screenText().join('\n');
  }
  function paused() {
   if (!runner) return;
   runner.wanted=false;release();keys.disabled=true;pause.textContent='Resume';pausedNote.hidden=false;
   say('Paused · Resume to continue.');
  }
  function open(button:HTMLElement) {
   opener=button;panel.showModal();document.body.classList.add('machine-active');
  }
  async function tape(text:string) {
   let api:typeof import('@emu198x/zx-spectrum');
   try {api=await import('@emu198x/zx-spectrum');await api.default();}
   catch(cause){throw new Error('The Spectrum could not load. Check your connection and try again.',{cause});}
   return api.basicTape(text,root.dataset.name!);
  }
  function clearError() {error.hidden=true;source.removeAttribute('aria-invalid');}
  async function start(program:{source:string;tape:Uint8Array}|null, audio: ReturnType<SoundControl['prepare']>) {
   failure.hidden=true;pausedNote.hidden=true;pause.disabled=restart.disabled=keys.disabled=true;
   canvas.setAttribute('aria-busy','true');say('Starting Spectrum… You can return to the lesson while it loads.');
   selected=program;hasStarted=true;
   try {
    release();runner?.dispose();runner=null;
    const created=await SpectrumRunner.create(canvas,say);
    if(disposed){created.dispose();return;}
    runner=created;
    if(audio){await audio.ready;if(disposed)return;runner.setAudio(audio);}
    if(program)runner.load(program.tape,'tape');runner.observeFrame(frame);runner.visible=true;runner.wanted=panel.open;
    pause.disabled=false;back.hidden=false;
    if(panel.open){pause.textContent='Pause';keys.disabled=false;say(program?'Running your code.':'Running · empty 48K Spectrum');canvas.focus({preventScroll:true});}
    else paused();
    status.textContent=program&&source.value===program.source?'Your code is in the Spectrum.':'New edits are ready to run.';
   } catch(problem) {
    runner?.dispose();runner=null;
    say('The Spectrum could not start. Check your connection, then choose Restart Spectrum to try again.');
    failure.querySelector('pre')!.textContent=String(problem);failure.hidden=false;
   } finally {restart.disabled=false;canvas.removeAttribute('aria-busy');}
  }
  async function runSource() {
   if(busy)return;
   busy=true;run.disabled=download.disabled=back.disabled=true;clearError();status.textContent='Preparing your code…';
   const text=source.value;
   const audio=sound.prepare();
   try {
    const bytes=await tape(text);
    if(disposed)return;
    open(run);await start({source:text,tape:bytes},audio);
   } catch(problem) {
    error.textContent=problem instanceof Error?problem.message:String(problem);error.hidden=false;
    status.textContent='Check the listing, then try again.';source.setAttribute('aria-invalid','true');source.focus();
   } finally {busy=false;run.disabled=download.disabled=back.disabled=false;}
  }
  for(const button of document.querySelectorAll<HTMLButtonElement>('[data-basic-launch]')) {
   if(button.dataset.basicLaunch!==root.dataset.name)continue;
   button.addEventListener('click',async()=>{
    if(busy)return;busy=true;button.disabled=true;
    const audio=sound.prepare();
    try{
     const original=JSON.parse(listing.querySelector('.listing-original')!.textContent!);
     const program=button.dataset.basicMode==='example'?{source:original,tape:await tape(original)}:null;
     if(disposed)return;open(button);await start(program,audio);
    }catch(problem){error.textContent=String(problem);error.hidden=false;}
    finally{busy=false;button.disabled=false;}
   },{signal});
  }
  run.addEventListener('click' ,()=>void runSource(),{signal});
  source.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();void runSource();}},{signal});
  source.addEventListener('input',()=>{clearError();status.textContent='Ready to run your changes.';},{signal});
  back.addEventListener('click',()=>{open(back);paused();},{signal});
  restart.addEventListener('click',async()=>{
   if(busy||!hasStarted)return;busy=true;run.disabled=download.disabled=back.disabled=true;
   try{await start(selected,sound.prepare());}finally{busy=false;run.disabled=download.disabled=back.disabled=false;}
  },{signal});
  pause.addEventListener('click',()=>{
   if(!runner)return;
   if(runner.wanted)paused();else{runner.wanted=true;pause.textContent='Pause';pausedNote.hidden=true;keys.disabled=false;say('Running your code.');canvas.focus({preventScroll:true});}
  },{signal});
  for(const button of keys.querySelectorAll<HTMLButtonElement>('[data-key]'))button.addEventListener('click',()=>{if(runner?.wanted)taps.push(button.dataset.key!);},{signal});
  panel.querySelector('.return-reading')!.addEventListener('click',()=>panel.close(),{signal});
  panel.querySelector('.edit-basic')!.addEventListener('click',()=>{panel.close();requestAnimationFrame(()=>{if(disposed)return;source.scrollIntoView({block:'center'});source.focus({preventScroll:true});});},{signal});
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'&&event.target!==canvas){event.preventDefault();event.stopPropagation();panel.close();}}, {capture:true,signal});
  panel.addEventListener('cancel',event=>{if(document.activeElement===canvas)event.preventDefault();},{signal});
  panel.addEventListener('close',()=>{paused();document.body.classList.remove('machine-active');opener.focus({preventScroll:true});},{signal});
  window.addEventListener('blur',release,{signal});
  download.addEventListener('click',async()=>{
   if(busy)return;busy=true;download.disabled=run.disabled=true;clearError();
   try{
    const bytes=await tape(source.value);if(disposed)return;
    const url=URL.createObjectURL(new Blob([bytes as BlobPart],{type:'application/octet-stream'}));
    const link=document.createElement('a');link.href=url;link.download=`${root.dataset.name}.tap`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your tape is downloaded.';
   }catch(problem){error.textContent=String(problem);error.hidden=false;}
   finally{busy=false;download.disabled=run.disabled=false;}
  },{signal});
  cleanups.add(()=>{disposed=true;controller.abort();runner?.dispose();sound.dispose();if(panel.open)panel.close();document.body.classList.remove('machine-active');});
 }
}
initialise();
document.addEventListener('astro:page-load',initialise);
function dispose(){for(const cleanup of cleanups)cleanup();cleanups.clear();}
document.addEventListener('astro:before-swap',dispose);
addEventListener('pagehide',dispose);
