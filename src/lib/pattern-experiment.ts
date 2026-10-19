export const buttons = {left: 4, right: 8, fire: 16} as const;
export function pressEdges(current: number, previous: number) { return (current & ~previous) & 0xff; }
export type Point = {x: number; y: number};
export const player: Point = {x: 5, y: 3};
export const start: Point = {x: 3, y: 3};
export const walls: Point[] = [{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:2,y:4},{x:3,y:4},{x:4,y:4}];
export const turnOrder = [{name:'Up',x:0,y:-1},{name:'Left',x:-1,y:0},{name:'Down',x:0,y:1},{name:'Right',x:1,y:0}];
export function targetFor(ahead: boolean): Point { return ahead ? {x: player.x, y: player.y - 2} : {...player}; }
export function isOpen(p: Point) { return p.x>0 && p.x<8 && p.y>0 && p.y<6 && !walls.some(w=>w.x===p.x && w.y===p.y); }
export function turnOptions(position: Point, target: Point) {
  return turnOrder.map(d => {
    const next = {x: position.x+d.x, y: position.y+d.y};
    return {name:d.name, next, legal:isOpen(next), distance:(next.x-target.x)**2+(next.y-target.y)**2};
  });
}
export function chooseTurn(position: Point, target: Point) {
  return turnOptions(position,target).filter(d=>d.legal).reduce<ReturnType<typeof turnOptions>[number] | undefined>(
    (best,d)=>!best || d.distance<best.distance ? d : best, undefined);
}
/** Original browser tone. No emulation or historic waveform claim. */
export function scheduleTone(context: BaseAudioContext, at = context.currentTime) {
  const oscillator = context.createOscillator(); const gain = context.createGain();
  oscillator.type='sine'; oscillator.frequency.setValueAtTime(440,at);
  gain.gain.setValueAtTime(0,at); gain.gain.linearRampToValueAtTime(0.09,at+0.005);
  gain.gain.linearRampToValueAtTime(0,at+0.09);
  oscillator.connect(gain); gain.connect(context.destination);
  oscillator.start(at); oscillator.stop(at+0.1);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
}
