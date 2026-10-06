import {expect,it} from 'vitest';
import {listingChanges} from './listing-changes';
const original='10 PRINT "Welcome"\n20 PRINT "from the Spectrum"';
it('marks the changed words and leaves unchanged lines clear',()=>{
 const edited=original.replace('Welcome','Hello');
 const diff=listingChanges(original,edited);
 expect(edited.split('\n')[0].slice(diff.lines[0].from,diff.lines[0].to)).toBe('Hello');
 expect(diff.lines[1].changed).toBe(false);
});
it('aligns existing BASIC lines after an insertion',()=>{
 const diff=listingChanges(original,'5 REM Greeting\n'+original);
 expect(diff.lines.map(line=>line.changed)).toEqual([true,false,false]);
 expect(diff.removedLines).toBe(0);
});
it('reports removals even when there is no remaining text to mark',()=>{
 const diff=listingChanges(original,'20 PRINT "from the Spectrum"');
 expect(diff.removedLines).toBe(1);
 expect(diff.lines[0].changed).toBe(false);
 expect(diff.changed).toBe(true);
 const deletion=listingChanges(original,original.replace('Welcome',''));
 expect(deletion.lines[0].removed).toBe(true);
 expect(deletion.lines[0].to).toBeGreaterThan(deletion.lines[0].from);
});
it('clears every marker when the source is restored',()=>{
 const diff=listingChanges(original,original);
 expect(diff.changed).toBe(false);
 expect(diff.removedLines).toBe(0);
 expect(diff.lines.every(line=>!line.changed)).toBe(true);
});
