/** Validate the reviewed public projection, without fetching or requalifying it. */
const repositories = new Set([
  'code198x/code-samples', 'code198x/docs', 'code198x/website', 'emu198x/emu198x',
  'asm198x/asm198x', 'build198x/build198x', 'isa198x/isa198x', 'format198x/format198x',
  'debug198x/debug198x', 'cat198x/cat198x', 'play198x/play198x', 'forge198x/forge198x',
]);
const capabilityKeys = 'id title configuration state state_label checks metrics observations reference remaining issues projects recorded_at age_days host python samples_revision sources tools firmware run_url recipe_url records reference_image reference_tools independent_validation';
const projectIds = ['code', 'emu', 'asm', 'build', 'isa', 'format', 'debug', 'cat', 'play', 'forge'];
const bindings = { spectrum: 3, c64: 5, nes: 3, amiga: 5, aabb: 2 };
export const resultLabels = { verified: 'Execution verified', needs_revalidation: 'Needs revalidation', failed: 'Recorded checks failed' };

function require(value, reason) { if (!value) throw new Error(`Progress snapshot: ${reason}`); }
function shape(value, fields) {
  require(value && typeof value === 'object' && !Array.isArray(value), 'expected an object');
  const keys = fields.split(' ');
  require(Object.keys(value).length === keys.length && keys.every(k => Object.hasOwn(value, k)), 'unknown or missing public fields');
}
function text(value) { require(typeof value === 'string' && value.trim().length, 'empty text'); }
function hash(value) { require(typeof value === 'string' && /^[a-f0-9]{64}$/.test(value), 'invalid fingerprint'); }
function revision(value) { require(typeof value === 'string' && /^[a-f0-9]{40}$/.test(value), 'invalid revision'); }
function date(value) { require(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0,10) === value, 'invalid date'); }
function ids(values, expected) { require(Array.isArray(values) && values.length === expected.length && new Set(values).size === expected.length && expected.every(id => values.includes(id)), 'incomplete or duplicate membership'); }
function array(value) { require(Array.isArray(value), 'expected an array'); }

export function publicProgressUrl(value) {
  text(value);
  const u = new URL(value);
  require(!/[\\%\x00-\x20]/.test(value) && !value.split('/').some(x => x === '.' || x === '..'), 'unsafe public URL');
  require(u.protocol === 'https:' && u.hostname === 'github.com' && !u.port && !u.username && !u.password && !u.search && !u.hash, 'unsafe public URL');
  require(repositories.has(u.pathname.split('/').slice(1,3).join('/')), 'unreviewed public repository');
  return value;
}

function safeValues(value, key = '') {
  if (Array.isArray(value)) { value.forEach(v => safeValues(v, key)); return; }
  if (value && typeof value === 'object') {
    for (const [k,v] of Object.entries(value)) {
      require(!/^(secret|token|password|credential|private_note|payload|rom_bytes)$/i.test(k), 'private field');
      safeValues(v, k);
    }
    return;
  }
  if (typeof value === 'number') require(Number.isFinite(value), 'nonfinite observation');
  if (typeof value !== 'string') return;
  require(!/(\/Users\/|\/home\/|\/Volumes\/|accuracy-corpora|github_pat_|ghp_|file:|javascript:|data:)/i.test(value), 'private location or unsafe value');
  if (key === 'url' || key.endsWith('_url')) publicProgressUrl(value);
}

export function validateProgressSnapshot(data) {
  shape(data, 'schema_version checked_on checked_samples_revision manifest_sha256 scope briefing_sha256 briefing projects capabilities verified_count remaining');
  require(data.schema_version === 1, 'unsupported schema');
  safeValues(data);
  date(data.checked_on);
  if (data.checked_samples_revision !== null) revision(data.checked_samples_revision);
  hash(data.manifest_sha256); hash(data.briefing_sha256); text(data.scope);
  array(data.remaining); data.remaining.forEach(text);
  array(data.projects); ids(data.projects.map(p => p.id), projectIds);
  array(data.capabilities); ids(data.capabilities.map(c => c.id), Object.keys(bindings));
  array(data.briefing); ids(data.briefing.map(p => p.id), ['code','emu','asm']);
  for (const p of data.briefing) {
    shape(p, 'id name purpose headline assessment demonstrated gap checkpoint checkpoint_reason reviewed_on sources assessment_state assessment_label');
    for (const key of ['name','purpose','headline','assessment','demonstrated','gap','checkpoint','checkpoint_reason']) text(p[key]);
    date(p.reviewed_on); array(p.sources); require(p.sources.length > 0, 'assessment has no sources');
    for (const s of p.sources) {
      shape(s, 'label url sha256 current_sha256 matches'); text(s.label); publicProgressUrl(s.url); hash(s.sha256);
      if (s.current_sha256 !== null) hash(s.current_sha256);
      require(typeof s.matches === 'boolean' && s.matches === (s.sha256 === s.current_sha256), 'assessment freshness disagrees');
    }
    const current = p.sources.every(s => s.matches);
    require(p.assessment_state === (current ? 'current' : 'needs_review'), 'assessment state disagrees');
    require(p.assessment_label === (current ? 'Source records unchanged' : 'Assessment needs review'), 'assessment label disagrees');
  }
  for (const c of data.capabilities) {
    shape(c, capabilityKeys);
    for (const key of ['title','configuration','checks','reference','remaining','host']) text(c[key]);
    require(Object.hasOwn(resultLabels, c.state) && resultLabels[c.state] === c.state_label, 'execution label disagrees');
    require(Number.isInteger(c.age_days) && c.age_days >= 0 && Number.isFinite(Date.parse(c.recorded_at)), 'invalid run date');
    revision(c.samples_revision); publicProgressUrl(c.run_url); publicProgressUrl(c.recipe_url);
    array(c.projects); require(c.projects.length > 0 && c.projects.every(p => projectIds.includes(p)), 'unknown linked project');
    array(c.issues); c.issues.forEach(text);
    require(c.metrics && typeof c.metrics === 'object' && !Array.isArray(c.metrics), 'invalid metrics');
    for (const v of Object.values(c.metrics)) require(Number.isFinite(v) && v > 0, 'empty measurement');
    array(c.sources); require(c.sources.length === bindings[c.id], 'incomplete input bindings');
    for (const s of c.sources) {
      shape(s, 'url sha256 matches_current_source current_sha256'); publicProgressUrl(s.url); hash(s.sha256);
      if (s.current_sha256 !== null) hash(s.current_sha256);
      require(typeof s.matches_current_source === 'boolean' && s.matches_current_source === (s.sha256 === s.current_sha256), 'input freshness disagrees');
    }
    if (c.state === 'verified') require(Object.keys(c.metrics).length > 0 && !c.issues.length && c.sources.every(s => s.matches_current_source), 'unsupported passing state');
    array(c.tools); require(c.tools.length > 0, 'no recorded tools');
    for (const t of c.tools) {
      shape(t, 'name version archive_sha256 binary_sha256'); text(t.name); text(t.version);
      for (const k of ['archive_sha256','binary_sha256']) if (t[k] !== null) hash(t[k]);
    }
    array(c.reference_tools);
    for (const t of c.reference_tools) { shape(t, 'name version binary_sha256'); text(t.name); text(t.version); hash(t.binary_sha256); }
    array(c.firmware);
    for (const f of c.firmware) { shape(f, 'name sha256 bytes'); require(/^[\w.-]+$/.test(f.name), 'invalid firmware name'); hash(f.sha256); require(Number.isInteger(f.bytes) && f.bytes > 0, 'invalid firmware length'); }
    array(c.records); require(c.records.length >= 2, 'missing evidence fingerprints');
    for (const r of c.records) { shape(r, 'kind sha256'); text(r.kind); hash(r.sha256); }
    array(c.independent_validation); require(c.independent_validation.every(s => ['assembly','runtime'].includes(s)), 'unknown validation stage');
    if (c.reference_image !== null) require(/^ghcr\.io\/code198x\/commodore-(64|amiga)@sha256:[a-f0-9]{64}$/.test(c.reference_image), 'unreviewed reference image');
    const observations = (v, key = '') => {
      if (Array.isArray(v)) return v.forEach(x => observations(x, key));
      if (v && typeof v === 'object') return Object.entries(v).forEach(([k,x]) => observations(x,k));
      if (typeof v === 'string') {
        if (key.endsWith('_sha256')) return hash(v);
        require(['name','engine','model'].includes(key) && ['emu','vice','pal','ntsc','held-a4','octave','low-negate-sweep','low-sweep-00-mutes','timer-below-8-mutes','load-before-enable','length-expires'].includes(v), 'unknown observation text');
      } else require(v === null || (typeof v === 'number' && Number.isFinite(v)), 'invalid observation');
    };
    observations(c.observations);
  }
  const verified = data.capabilities.filter(c => c.state === 'verified');
  require(data.verified_count === verified.length, 'passing total disagrees');
  for (const p of data.projects) {
    shape(p, 'id name role phase url capabilities verified_count'); text(p.name); text(p.role);
    require(['active','deferred'].includes(p.phase), 'unknown activity'); if (p.url !== null) publicProgressUrl(p.url);
    const linked = data.capabilities.filter(c => c.projects.includes(p.id));
    ids(p.capabilities, linked.map(c => c.id));
    require(p.verified_count === linked.filter(c => c.state === 'verified').length, 'project count disagrees');
  }
  return data;
}
