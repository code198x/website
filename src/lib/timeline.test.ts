import { describe, expect, it } from 'vitest';
import { timelineEvents, timelineDecades, decadeEvents, eventTotals, startYear, resolveStories } from './timeline';

const entry = (id: string, data: object) => ({ id, data: { category: id.split('/')[0], title: id, summary: 'Context', reviewed: true, ...data } }) as Parameters<typeof startYear>[0];

describe('the chronology is one set of dated events', () => {
  it('index totals partition the exact decade events, including dates outside legacy decades', () => {
    const events = timelineEvents([
      entry('people/person', { born: 1899, died: 1985 }),
      entry('games/game', { released: 1985 }),
      entry('software/editor', { released: 1990 }),
      entry('companies/business', { ended: 2004, ended_as: 'acquired' }),
    ], [{ id: 'context', data: { title: 'World context', summary: 'Context', year: 1985, category: 'technology' } }]);
    const rows = timelineDecades(events).map(decade => decadeEvents(events, decade));
    expect(rows.flat().map(event => event.id).sort()).toEqual(events.map(event => event.id).sort());
    for (const row of rows) { const totals = eventTotals(row); expect(totals.total).toBe(totals.vault + totals.world); }
    expect(events.find(event => event.type === 'closure')?.title).toContain('is acquired');
    expect(events).toHaveLength(6);
  });
  it('includes the dated software, language, publishing and scene subjects already described by the Vault', () => {
    const entries = [entry('software/tool',{released:1985}),entry('languages/basic',{released:1980}),entry('magazines/issue',{founded:1984}),entry('groups/group',{founded:1987}),entry('demos/demo',{released:1993})];
    expect(timelineEvents(entries,[]).map(e=>e.url).sort()).toEqual(entries.map(e=>`/vault/${e.id}/`).sort());
  });
  it('does not invent dates, but retains a known death or ending with an unknown beginning', () => {
    const events = timelineEvents([entry('games/unknown',{released:null}),entry('people/person',{born:null,died:2001}),entry('companies/business',{founded:null,ended:1990})],[]);
    expect(events.map(e=>e.type).sort()).toEqual(['closure','death']);
    expect(events.every(e=>Number.isInteger(e.year))).toBe(true);
  });
  it('keeps review status explicit and refuses to feature unknown, undated or unreviewed articles', () => {
    const selection=[{id:'story',label:'Story',title:'Question',description:'Context',steps:[{article:'games/game',connection:'Connection'}]}];
    expect(()=>resolveStories(selection,[])).toThrow('reviewed article');
    expect(()=>resolveStories(selection,[entry('games/game',{reviewed:false,released:1982})])).toThrow('reviewed article');
    expect(()=>resolveStories(selection,[entry('games/game',{})])).toThrow('recorded date');
    expect(timelineEvents([entry('games/game',{reviewed:false,released:1982})],[])[0].reviewed).toBe(false);
  });
});
