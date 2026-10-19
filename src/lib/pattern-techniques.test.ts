import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {techniques} from '../data/pattern-techniques';
import {resolveTechniques,techniqueBySlug} from './pattern-techniques';
const entries=[...new Set(techniques.flatMap(t=>t.implementations.map(i=>i.id)))].map(id=>({id,body:readFileSync(new URL(`../content/patterns/${id}.mdx`,import.meta.url),'utf8'),data:{title:id,platform:id.split('/')[0]}}));
it('resolves every named implementation against its real source evidence',()=>{
 const result=resolveTechniques(entries);expect(result).toHaveLength(4);expect(result[3].implementations).toHaveLength(0);
 expect(result[0].implementations.find(i=>i.entry.data.platform==='commodore-64')?.evidence).toBe('emulator-executed');
});
it('fails on missing implementations and changed evidence',()=>{
 expect(()=>resolveTechniques(entries.slice(1))).toThrow('Missing pattern:');
 expect(()=>resolveTechniques(entries.map(e=>({...e,body:'Unverified'})))).toThrow('Evidence summary needs review:');
 expect(()=>techniqueBySlug('unknown')).toThrow('Unknown technique:');
});
