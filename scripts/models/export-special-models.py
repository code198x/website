"""Export existing Spectrum CAD meshes and Game Boy render lettering for web delivery.

Run with Blender's Python. Source native/Blender documents are read, never saved.
"""
import argparse
import sys
from pathlib import Path

import bpy

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--library', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
args.output.mkdir(parents=True, exist_ok=True)

# The final studio contains the same native parts plus the lettering visible in its renders.
bpy.ops.wm.open_mainfile(filepath=str(args.library / 'assets/by-system/nintendo-gameboy/model/complete-exterior/gameboy-exterior.blend'))
root = bpy.data.objects['DMG_exterior_review']
parts = [root, *root.children_recursive]
bpy.ops.object.select_all(action='DESELECT')
for part in parts:
    if part.type == 'FONT':
        part.select_set(True)
        bpy.context.view_layer.objects.active = part
        bpy.ops.object.convert(target='MESH')
        part.select_set(False)
bpy.ops.object.select_all(action='DESELECT')
for part in [root, *root.children_recursive]:
    part.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(args.output / 'game-boy.glb'), export_format='GLB', use_selection=True, export_extras=False)

# Only the selected exterior is imported; the third-party reference motherboard is excluded.
bpy.ops.wm.read_factory_settings(use_empty=True)
obj = args.library / 'assets/by-system/sinclair-zx-spectrum/model/solidcraft-issue3b-case/portraits-tapered/exterior.obj'
bpy.ops.wm.obj_import(filepath=str(obj), forward_axis='Y', up_axis='Z')
colours = {}
current = None
for line in obj.with_suffix('.mtl').read_text().splitlines():
    if line.startswith('newmtl '):
        current = line[7:]
    elif line.startswith('Kd ') and current:
        rgb = [float(v) for v in line.split()[1:4]]
        colours[current] = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb]
for material in bpy.data.materials:
    if material.name not in colours:
        continue
    colour = (*colours[material.name], 1)
    material.diffuse_color = colour
    shader = material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = colour
    shader.inputs['Roughness'].default_value = .85 if material.name == 'Rubber_mat' else .57
    shader.inputs['Metallic'].default_value = .65 if material.name.startswith('RCA_') else 0
for part in bpy.context.scene.objects:
    if part.type == 'MESH':
        part.scale = (.001, .001, .001)
bpy.ops.export_scene.gltf(filepath=str(args.output / 'sinclair-zx-spectrum.glb'), export_format='GLB', export_extras=False)
print('Game Boy lettering and selected Spectrum exterior exported; source documents unchanged.')
