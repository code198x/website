import {describe,it,expect} from 'vitest';
import {pressEdges,chooseTurn,turnOptions,targetFor,start,isOpen} from './pattern-experiment';
describe('sampled input',()=>{
 it('triggers once while held and again after release',()=>{
  let previous=0;const edges=[16,16,24,8,24].map(current=>{const edge=pressEdges(current,previous);previous=current;return edge;});
  expect(edges).toEqual([16,0,8,0,16]);
 });
 it('seeds entry history and bounds inversion to a byte',()=>{
  expect(pressEdges(16,16)).toBe(0);expect(pressEdges(0x1ff,0)).toBe(255);expect(pressEdges(0,255)).toBe(0);
 });
});
describe('target and local movement',()=>{
 it('changes the first turn by changing only the target',()=>{
  expect(chooseTurn(start,targetFor(false))?.name).toBe('Right');
  expect(chooseTurn(start,targetFor(true))?.name).toBe('Up');
  const options=turnOptions(start,targetFor(true));expect(options.find(o=>o.name==='Up')?.distance).toBe(options.find(o=>o.name==='Right')?.distance);
 });
 it('always chooses an open adjacent tile, including near walls and borders',()=>{
  for(let x=1;x<8;x++)for(let y=1;y<6;y++)if(isOpen({x,y}))for(const ahead of [false,true]){
   const choice=chooseTurn({x,y},targetFor(ahead));expect(choice).toBeDefined();expect(isOpen(choice!.next)).toBe(true);
   expect(Math.abs(choice!.next.x-x)+Math.abs(choice!.next.y-y)).toBe(1);
   const legal=turnOptions({x,y},targetFor(ahead)).filter(o=>o.legal);expect(choice!.distance).toBe(Math.min(...legal.map(o=>o.distance)));
  }
 });
});
