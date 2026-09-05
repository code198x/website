/**
 * Curriculum routes — the road from where a learner is to the game they came for.
 *
 * Pure functions over plain data. No Astro imports, deliberately: the same
 * implementation serves the site and `scripts/check-curriculum-routes.mjs`, and
 * a resolver that needs a content collection can only be tested through one.
 *
 * See docs/website.md#content-and-navigation
 */

export type RouteRefRaw =
  | string
  | { module: string; thread?: string; why?: string };

export interface RouteModule {
  slug: string;
  name: string;
  requires?: RouteRefRaw[];
  suggests?: RouteRefRaw[];
  game?: string;
  pass?: number;
}

/** One catalogue file: a platform track (`{platform}/{track}`) or a section. */
export interface Scope {
  id: string;
  modules: RouteModule[];
}

export interface RouteRef {
  scope: string;
  slug: string;
  thread?: string;
  why?: string;
}

export interface RouteStep extends RouteRef {
  name: string;
}

/**
 * A bare string is a reference in `defaultScope` unless it carries slashes, in
 * which case the last segment is the slug and everything before it is the scope.
 * That keeps a scope id like `sinclair-zx-spectrum/machine` intact.
 */
export function normaliseRef(ref: RouteRefRaw, defaultScope: string): RouteRef {
  if (typeof ref === 'string') return splitQualified(ref, defaultScope);
  const { scope, slug } = splitQualified(ref.module, defaultScope);
  const out: RouteRef = { scope, slug };
  if (ref.thread !== undefined) out.thread = ref.thread;
  if (ref.why !== undefined) out.why = ref.why;
  return out;
}

function splitQualified(ref: string, defaultScope: string): RouteRef {
  const at = ref.lastIndexOf('/');
  if (at === -1) return { scope: defaultScope, slug: ref };
  return { scope: ref.slice(0, at), slug: ref.slice(at + 1) };
}

/**
 * A revisit continues the game its previous pass built, so it requires that
 * pass by definition. Derived rather than authored: a field that restates
 * `game` + `pass` is a field that can disagree with them.
 */
export function derivedRequires(scope: Scope, module: RouteModule): RouteRefRaw[] {
  if (!module.game || !module.pass || module.pass < 2) return [];
  const previous = scope.modules.find(
    (m) => m.game === module.game && m.pass === module.pass! - 1,
  );
  return previous ? [previous.slug] : [];
}

function allRefs(scope: Scope, module: RouteModule): RouteRef[] {
  const raw = [...derivedRequires(scope, module), ...(module.requires ?? [])];
  const seen = new Set<string>();
  const out: RouteRef[] = [];
  for (const ref of raw) {
    const n = normaliseRef(ref, scope.id);
    const key = `${n.scope}/${n.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out;
}

function lookup(scopes: Scope[], ref: RouteRef): { scope: Scope; module: RouteModule } | null {
  const scope = scopes.find((s) => s.id === ref.scope);
  const module = scope?.modules.find((m) => m.slug === ref.slug);
  return scope && module ? { scope, module } : null;
}

/**
 * The transitive closure of a module's requirements, dependencies first, each
 * shared module appearing once. The thread and why recorded against a step are
 * those of the edge that first pulled it onto the route.
 */
export function resolveRoute(scopes: Scope[], scopeId: string, slug: string): RouteStep[] {
  const start = lookup(scopes, { scope: scopeId, slug });
  if (!start) return [];

  const out: RouteStep[] = [];
  const done = new Set<string>();
  const active = new Set<string>();

  const visit = (ref: RouteRef): void => {
    const key = `${ref.scope}/${ref.slug}`;
    if (done.has(key) || active.has(key)) return;
    const found = lookup(scopes, ref);
    if (!found) return;
    active.add(key);
    for (const next of allRefs(found.scope, found.module)) visit(next);
    active.delete(key);
    done.add(key);
    const step: RouteStep = { scope: ref.scope, slug: ref.slug, name: found.module.name };
    if (ref.thread !== undefined) step.thread = ref.thread;
    if (ref.why !== undefined) step.why = ref.why;
    out.push(step);
  };

  for (const ref of allRefs(start.scope, start.module)) visit(ref);
  return out;
}

/** The first cycle found, as `scope/slug` keys, or null. */
export function findCycle(scopes: Scope[]): string[] | null {
  const active: string[] = [];
  const activeSet = new Set<string>();
  const done = new Set<string>();

  const visit = (ref: RouteRef): string[] | null => {
    const key = `${ref.scope}/${ref.slug}`;
    if (activeSet.has(key)) return [...active.slice(active.indexOf(key)), key];
    if (done.has(key)) return null;
    const found = lookup(scopes, ref);
    if (!found) return null;
    active.push(key);
    activeSet.add(key);
    for (const next of allRefs(found.scope, found.module)) {
      const cycle = visit(next);
      if (cycle) return cycle;
    }
    active.pop();
    activeSet.delete(key);
    done.add(key);
    return null;
  };

  for (const scope of scopes) {
    for (const module of scope.modules) {
      const cycle = visit({ scope: scope.id, slug: module.slug });
      if (cycle) return cycle;
    }
  }
  return null;
}

/**
 * In-scope edges pointing at a module later in the same catalogue. The
 * catalogue order is the recommended path, so a backwards edge means the order
 * and the dependencies disagree. Cross-scope edges are exempt: order between
 * scopes is fixed by the architecture, not by array position.
 */
export function forwardReferences(scope: Scope): Array<{ from: string; to: string }> {
  const position = new Map(scope.modules.map((m, i) => [m.slug, i]));
  const out: Array<{ from: string; to: string }> = [];
  scope.modules.forEach((module, i) => {
    for (const ref of allRefs(scope, module)) {
      if (ref.scope !== scope.id) continue;
      const at = position.get(ref.slug);
      if (at !== undefined && at > i) out.push({ from: module.slug, to: ref.slug });
    }
  });
  return out;
}

/**
 * Every `requires` or `suggests` reference that names a module nothing
 * defines. `field` names which one, so a bad `suggests` edge is not reported
 * as a missing `requires` — the two are validated the same way but authored
 * (and fixed) in different places.
 */
export function unresolvedReferences(
  scopes: Scope[],
): Array<{ from: string; ref: string; field: 'requires' | 'suggests' }> {
  const out: Array<{ from: string; ref: string; field: 'requires' | 'suggests' }> = [];
  for (const scope of scopes) {
    for (const module of scope.modules) {
      const refs: Array<{ ref: RouteRef; field: 'requires' | 'suggests' }> = [
        ...allRefs(scope, module).map((ref) => ({ ref, field: 'requires' as const })),
        ...(module.suggests ?? []).map((r) => ({
          ref: normaliseRef(r, scope.id),
          field: 'suggests' as const,
        })),
      ];
      for (const { ref, field } of refs) {
        if (!lookup(scopes, ref)) {
          out.push({ from: `${scope.id}/${module.slug}`, ref: `${ref.scope}/${ref.slug}`, field });
        }
      }
    }
  }
  return out;
}

/** Thread names used in a scope, and how often. A near-duplicate is the tell. */
export function threadVocabulary(scope: Scope): Map<string, number> {
  const counts = new Map<string, number>();
  for (const module of scope.modules) {
    for (const ref of allRefs(scope, module)) {
      if (!ref.thread) continue;
      counts.set(ref.thread, (counts.get(ref.thread) ?? 0) + 1);
    }
  }
  return counts;
}
