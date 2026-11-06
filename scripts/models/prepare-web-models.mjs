/** Prepare separate, compressed viewing assets; original CAD/GLB files stay untouched. */
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, flatten, join, weld, prune, simplify, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';

const [library, specialExports] = process.argv.slice(2);
if (!library || !specialExports) throw new Error('Usage: node prepare-web-models.mjs <family workspace> <special-export directory>');
const site = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(site, 'public/models');
await mkdir(output, { recursive: true });
const sources = {
  'commodore-amiga': resolve(library, 'assets/models/exterior-refinements/output-amiga-special-key-fit/amiga-special-key-fit.glb'),
  'commodore-64': resolve(library, 'assets/models/exterior-refinements/output-c64-port-surrounds/c64-lettered.glb'),
  'nintendo-entertainment-system': resolve(library, 'assets/models/exterior-refinements/output-nes-two/nes-lettered.glb'),
  'sinclair-zx-spectrum': resolve(specialExports, 'sinclair-zx-spectrum.glb'),
  'game-boy': resolve(specialExports, 'game-boy.glb'),
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const manifest = {};
for (const [system, source] of Object.entries(sources)) {
  const bytes = await readFile(source);
  const doc = await io.read(source);
  const root = doc.getRoot();
  // Viewing assets contain no authoring paths, research notes or private extras.
  for (const properties of [root.listNodes(), root.listMeshes(), root.listMaterials(), root.listTextures(), root.listScenes(), root.listAccessors(), root.listBuffers(), root.listAnimations()]) {
    for (const property of properties) property.setExtras({});
  }
  root.setExtras({});
  const originalTriangles = root.listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives().reduce((n, p) => n + (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3, 0), 0);
  // Preserve glyph borders; remove redundant interior triangles at a small visual tolerance.
  // Merge equivalent data/draw calls, then use fine quantisation
  // (about 0.007 mm across the Amiga) and bundled Meshopt decoding for transfer size.
  await doc.transform(dedup(), flatten(), join(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio: .25, error: .00005, lockBorder: true }), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium', quantizePosition: 16, quantizeNormal: 12, quantizeTexcoord: 14 }));
  const result = await io.writeBinary(doc);
  const target = resolve(output, `${system}.glb`);
  await writeFile(`${target}.tmp`, result);
  await rename(`${target}.tmp`, target);
  const json = JSON.parse(new TextDecoder().decode(result.slice(20, 20 + new DataView(result.buffer, result.byteOffset).getUint32(12, true))));
  if (json.buffers.some(buffer => buffer.uri) || json.images?.some(image => image.uri)) throw new Error('Viewing model has external resources');
  const webTriangles = root.listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives().reduce((n, p) => n + (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3, 0), 0);
  const primitives = root.listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives().length, 0);
  manifest[system] = { source_sha256: hash(bytes), source_bytes: bytes.length, sha256: hash(result), bytes: result.length, source_triangles: originalTriangles, triangles: webTriangles, simplification_error_fraction: .00005, primitives, position_bits: 16, normals_bits: 12, units: 'metres', self_contained: true };
  console.log(`${system}: ${(bytes.length / 1048576).toFixed(1)} → ${(result.length / 1048576).toFixed(2)} MB; ${primitives} primitives`);
}
await writeFile(resolve(output, 'provenance.json'), JSON.stringify(manifest, null, 2) + '\n');
