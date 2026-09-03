import { describe, expect, it } from 'vitest';
import {
  normaliseRef,
  derivedRequires,
  resolveRoute,
  findCycle,
  forwardReferences,
  unresolvedReferences,
  threadVocabulary,
  type Scope,
} from './routes';

/** A track shaped like Spectrum BASIC's real dependency threads. */
const basic: Scope = {
  id: 'sinclair-zx-spectrum/basic',
  modules: [
    { slug: 'meet-basic', name: 'Meet BASIC', requires: ['sinclair-zx-spectrum/machine/meet-the-machine'] },
    { slug: 'story-builder', name: 'Story Builder' },
    { slug: 'reflex', name: 'Reflex' },
    { slug: 'cipher', name: 'Cipher', requires: [{ module: 'story-builder', thread: 'Where the data lives', why: 'variables that hold words' }] },
    { slug: 'sonar', name: 'Sonar', requires: [{ module: 'cipher', thread: 'Reading a world', why: 'arrays you reach by number' }] },
    { slug: 'crates', name: 'Crates', requires: [
      { module: 'sonar', thread: 'Reading a world', why: 'a grid you can read' },
      { module: 'reflex', thread: 'Moving in real time', why: 'the keyboard, live' },
    ] },
  ],
};

const machine: Scope = {
  id: 'sinclair-zx-spectrum/machine',
  modules: [{ slug: 'meet-the-machine', name: 'Meet the Machine' }],
};

describe('normaliseRef', () => {
  it('reads a bare string as a reference in the default scope', () => {
    expect(normaliseRef('sonar', 'sinclair-zx-spectrum/basic'))
      .toEqual({ scope: 'sinclair-zx-spectrum/basic', slug: 'sonar' });
  });

  it('splits a qualified string on its last segment', () => {
    expect(normaliseRef('foundations/numbers-and-bits', 'sinclair-zx-spectrum/basic'))
      .toEqual({ scope: 'foundations', slug: 'numbers-and-bits' });
  });

  it('keeps a multi-segment scope intact', () => {
    expect(normaliseRef('sinclair-zx-spectrum/machine/meet-the-machine', 'x'))
      .toEqual({ scope: 'sinclair-zx-spectrum/machine', slug: 'meet-the-machine' });
  });

  it('carries thread and why through the object form', () => {
    expect(normaliseRef({ module: 'sonar', thread: 'Reading a world', why: 'a grid' }, 'basic'))
      .toEqual({ scope: 'basic', slug: 'sonar', thread: 'Reading a world', why: 'a grid' });
  });
});

describe('derivedRequires', () => {
  it('makes a revisit require the previous pass of the same game', () => {
    const scope: Scope = { id: 't', modules: [
      { slug: 'gloaming', name: 'Gloaming', game: 'gloaming', pass: 1 },
      { slug: 'the-long-night', name: 'The Long Night', game: 'gloaming', pass: 2 },
    ] };
    const derived = derivedRequires(scope, scope.modules[1]);
    expect(derived).toEqual(['gloaming']);
  });

  it('derives nothing for a first pass', () => {
    const scope: Scope = { id: 't', modules: [
      { slug: 'gloaming', name: 'Gloaming', game: 'gloaming', pass: 1 },
    ] };
    expect(derivedRequires(scope, scope.modules[0])).toEqual([]);
  });

  it('derives nothing for a module with no game', () => {
    const scope: Scope = { id: 't', modules: [{ slug: 'meet-basic', name: 'Meet BASIC' }] };
    expect(derivedRequires(scope, scope.modules[0])).toEqual([]);
  });
});

describe('resolveRoute', () => {
  it('returns the transitive closure, dependencies before dependants', () => {
    const route = resolveRoute([basic, machine], 'sinclair-zx-spectrum/basic', 'crates');
    const slugs = route.map((s) => s.slug);
    expect(slugs).toEqual(['story-builder', 'cipher', 'sonar', 'reflex']);
  });

  it('omits modules that are not on the route', () => {
    const route = resolveRoute([basic, machine], 'sinclair-zx-spectrum/basic', 'crates');
    expect(route.map((s) => s.slug)).not.toContain('meet-basic');
  });

  it('crosses a scope seam', () => {
    const route = resolveRoute([basic, machine], 'sinclair-zx-spectrum/basic', 'meet-basic');
    expect(route).toEqual([
      { scope: 'sinclair-zx-spectrum/machine', slug: 'meet-the-machine', name: 'Meet the Machine' },
    ]);
  });

  it('returns an empty route for an entry point', () => {
    expect(resolveRoute([basic, machine], 'sinclair-zx-spectrum/basic', 'reflex')).toEqual([]);
  });

  it('visits a shared dependency once', () => {
    const scope: Scope = { id: 't', modules: [
      { slug: 'a', name: 'A' },
      { slug: 'b', name: 'B', requires: ['a'] },
      { slug: 'c', name: 'C', requires: ['a'] },
      { slug: 'd', name: 'D', requires: ['b', 'c'] },
    ] };
    const slugs = resolveRoute([scope], 't', 'd').map((s) => s.slug);
    expect(slugs.filter((s) => s === 'a')).toHaveLength(1);
    expect(slugs.indexOf('a')).toBeLessThan(slugs.indexOf('b'));
  });

  it('carries the thread and why of the edge that pulled a module in', () => {
    const route = resolveRoute([basic, machine], 'sinclair-zx-spectrum/basic', 'crates');
    const sonar = route.find((s) => s.slug === 'sonar');
    expect(sonar?.thread).toBe('Reading a world');
    expect(sonar?.why).toBe('a grid you can read');
  });
});

describe('findCycle', () => {
  it('returns null when the graph is acyclic', () => {
    expect(findCycle([basic, machine])).toBeNull();
  });

  it('names the modules in a cycle', () => {
    const scope: Scope = { id: 't', modules: [
      { slug: 'a', name: 'A', requires: ['b'] },
      { slug: 'b', name: 'B', requires: ['a'] },
    ] };
    const cycle = findCycle([scope]);
    expect(cycle).not.toBeNull();
    expect(cycle).toContain('t/a');
  });
});

describe('forwardReferences', () => {
  it('finds a module requiring one later in the same catalogue', () => {
    const scope: Scope = { id: 't', modules: [
      { slug: 'early', name: 'Early', requires: ['late'] },
      { slug: 'late', name: 'Late' },
    ] };
    expect(forwardReferences(scope)).toEqual([{ from: 'early', to: 'late' }]);
  });

  it('ignores an edge that crosses a scope', () => {
    expect(forwardReferences(basic)).toEqual([]);
  });
});

describe('unresolvedReferences', () => {
  it('reports a reference to a module that does not exist', () => {
    const scope: Scope = { id: 't', modules: [{ slug: 'a', name: 'A', requires: ['ghost'] }] };
    expect(unresolvedReferences([scope])).toEqual([{ from: 't/a', ref: 't/ghost', field: 'requires' }]);
  });

  it('reports nothing when every reference resolves', () => {
    expect(unresolvedReferences([basic, machine])).toEqual([]);
  });

  it('checks suggests as well as requires, and names which field is bad', () => {
    const scope: Scope = { id: 't', modules: [{ slug: 'a', name: 'A', suggests: ['ghost'] }] };
    expect(unresolvedReferences([scope])).toEqual([{ from: 't/a', ref: 't/ghost', field: 'suggests' }]);
  });
});

describe('threadVocabulary', () => {
  it('counts how often each thread name is used', () => {
    const v = threadVocabulary(basic);
    expect(v.get('Reading a world')).toBe(2);
    expect(v.get('Moving in real time')).toBe(1);
  });
});
