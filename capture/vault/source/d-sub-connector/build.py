"""Run with Blender --background --python build.py. Units are millimetres."""
import bpy, math, os
from pathlib import Path
from mathutils import Vector
OUT = Path(__file__).resolve().parent
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for c in list(bpy.data.collections):
    if c.name != 'Collection': bpy.data.collections.remove(c)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'; scene.unit_settings.scale_length=.001
scene.unit_settings.length_unit='MILLIMETERS'
scene.render.engine='CYCLES'; scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.resolution_x=1600; scene.render.resolution_y=1200; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.world.color=(.35,.35,.35)
scene.view_settings.view_transform='AgX'
model=bpy.data.collections.new('DE-9 • editable parts'); scene.collection.children.link(model)
studio=bpy.data.collections.new('Studio • cameras and lighting'); scene.collection.children.link(studio)
def move_collection(o,c):
    for old in list(o.users_collection): old.objects.unlink(o)
    c.objects.link(o)
def mat(name,col,metal=0,rough=.4):
    m=bpy.data.materials.new(name); m.diffuse_color=(*col,1); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*col,1); bs.inputs['Metallic'].default_value=metal; bs.inputs['Roughness'].default_value=rough
    return m
steel=mat('Nickel-plated steel',(.49,.55,.59),.85,.27)
gold=mat('Gold-plated contacts',(.65,.36,.08),.8,.24)
plastic=mat('Charcoal thermoplastic',(.027,.038,.047),0,.32)
paper=mat('Warm studio ground',(.72,.68,.60),0,.8)
parts=[]
def finish(o,name,material,bevel=.1):
    o.name=name; move_collection(o,model); o.data.materials.append(material)
    if bevel:
        mod=o.modifiers.new('Manufactured edge radii','BEVEL'); mod.width=bevel; mod.segments=3
        mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    parts.append(o); return o
# Rounded trapezoid: the wide edge is at +Y, the mating direction is +Z.
def outline(wtop=16.79,wbottom=14.6,h=8.35,r=.9):
    pts=[Vector((-wbottom/2,-h/2)),Vector((wbottom/2,-h/2)),Vector((wtop/2,h/2)),Vector((-wtop/2,h/2))]
    out=[]
    for i,p in enumerate(pts):
        a=p+(pts[(i-1)%4]-p).normalized()*r
        b=p+(pts[(i+1)%4]-p).normalized()*r
        for j in range(9):
            t=j/8; q=(1-t)**2*a+2*(1-t)*t*p+t*t*b; out.append(tuple(q))
    return out
def solid(name,pts,z0,z1,material,bevel=.08):
    n=len(pts); verts=[(x,y,z) for z in (z0,z1) for x,y in pts]
    faces=[tuple(reversed(range(n))),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    ob=bpy.data.objects.new(name,mesh); model.objects.link(ob); return finish(ob,name,material,bevel)
def ring(name,outer,inner,z0,z1,material):
    n=len(outer); vs=[(x,y,z) for z,pts in [(z0,outer),(z1,outer),(z0,inner),(z1,inner)] for x,y in pts]; fs=[]
    for i in range(n):
        j=(i+1)%n
        fs.extend([(i,j,n+j,n+i),(2*n+j,2*n+i,3*n+i,3*n+j),(n+i,n+j,3*n+j,3*n+i),(j,i,2*n+i,2*n+j)])
    me=bpy.data.meshes.new(name); me.from_pydata(vs,[],fs); me.update(); ob=bpy.data.objects.new(name,me); model.objects.link(ob)
    return finish(ob,name,material,.055)
def cube(name,dim,loc,material,bevel=.2):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.dimensions=dim; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); return finish(o,name,material,bevel)
def cylinder(name,r,depth,loc,material,vertices=48,bevel=.05):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc); return finish(bpy.context.object,name,material,bevel)
def subtract(o,cutter):
    bpy.context.view_layer.objects.active=o
    mod=o.modifiers.new('Machined opening','BOOLEAN'); mod.operation='DIFFERENCE'; mod.solver='EXACT'; mod.object=cutter
    bpy.ops.object.modifier_move_up(modifier=mod.name)
    # Apply all through the boolean to leave stable, exportable holes.
    while o.modifiers:
        name=o.modifiers[0].name; bpy.ops.object.modifier_apply(modifier=name)
    if cutter in parts: parts.remove(cutter)
    bpy.data.objects.remove(cutter,do_unlink=True)
flange=cube('01 • Mounting flange',(30.81,12.55,.8),(0,0,-.4),steel,.65)
cut=solid('cut',outline(16.1,13.9,7.65),-2,2,steel,0); subtract(flange,cut)
for x in (-12.495,12.495):
    subtract(flange,cylinder('cut',1.6,4,(x,0,0),steel,48,0))
shell=ring('02 • Formed D shell',outline(),outline(16.15,13.96,7.71,.75),0,5.9,steel)
insert=solid('03 • Insulating insert',outline(15.9,13.7,7.45,.8),-4.2,.65,plastic,.13)
contacts=[]
for row,count in [(1,5),(-1,4)]:
    for j in range(count):
        x=(j-(count-1)/2)*2.74; y=row*1.42
        subtract(insert,cylinder('cut',.56,8,(x,y,-1.5),steel,32,0))
        number=j+1 if row==1 else j+6
        pin=cylinder(f'04 • Contact {number:02d}',.49,10.8,(x,y,-.6),gold,48,.20)
        pin['contact_number']=number; pin['termination']='Simplified straight tail; not a solder cup'; contacts.append(pin)
# Hex jackposts are separate pieces; thread is intentionally omitted.
hardware=[]
for side,x in [('Left',-12.495),('Right',12.495)]:
    post=cylinder(f'05 • {side} hex jackpost',2.35,4.6,(x,0,2.3),steel,6,.12)
    subtract(post,cylinder('cut',1.02,6,(x,0,2.3),steel,40,0))
    hardware.append(post)
    washer=cylinder(f'06 • {side} rear washer',2.15,.5,(x,0,-1.1),steel,64,.06)
    subtract(washer,cylinder('cut',1.6,2,(x,0,-1.1),steel,40,0)); hardware.append(washer)
# Animate only locations; stored mesh geometry stays editable.
for ob in parts:
    ob['purpose']='Illustrative geometry, not a manufacturing model'
    ob.keyframe_insert(data_path='location',frame=1)
    dz=18 if ob==shell else (-10 if ob==insert else (8 if ob in contacts else (12 if ob in hardware and 'jackpost' in ob.name else (-5 if ob in hardware else 0))))
    ob.location.z+=dz; ob.keyframe_insert(data_path='location',frame=90)
scene.frame_start=1; scene.frame_end=90
scene.timeline_markers.new('ASSEMBLED',frame=1); scene.timeline_markers.new('EXPLODED',frame=90)
scene['Model notes']='DE-9 male illustrative study. +Z mating direction. +Y wide row. No machine-specific pinout. See README.md.'
# Ground, studio lights and orthographic camera.
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-17)); ground=bpy.context.object; ground.name='Studio ground'; ground.data.materials.append(paper); move_collection(ground,studio)
def aim(ob,target): ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
for name,loc,power,size in [('Large key',(-25,-30,55),50000,40),('Cool fill',(35,15,35),35000,30),('Rim',(-20,35,15),40000,25)]:
    dat=bpy.data.lights.new(name,'AREA'); dat.energy=power; dat.shape='DISK'; dat.size=size
    ob=bpy.data.objects.new(name,dat); studio.objects.link(ob); ob.location=loc; aim(ob,(0,0,0))
dat=bpy.data.cameras.new('Presentation camera'); camera=bpy.data.objects.new('Presentation camera',dat); studio.objects.link(camera); scene.camera=camera; dat.type='ORTHO'; dat.clip_end=1000
camera.location=(32,-42, sixty:=64); aim(camera,(0,0,0)); dat.ortho_scale=43
scene.frame_set(1)
# Export model only, in metres (Blender glTF honours scene scale).
bpy.ops.object.select_all(action='DESELECT')
for ob in parts: ob.select_set(True)
bpy.context.view_layer.objects.active=flange
bpy.ops.export_scene.gltf(filepath=str(OUT/'de9-male.glb'),export_format='GLB',use_selection=True,export_animations=False,export_apply=True)
scene.render.filepath=str(OUT/'assembled.png'); bpy.ops.render.render(write_still=True)
scene.frame_set(90); camera.location=(42,-60,76); aim(camera,(0,0,5)); dat.ortho_scale= sixty
scene.render.filepath=str(OUT/'exploded.png'); bpy.ops.render.render(write_still=True)
scene.frame_set(1); camera.location=(32,-42,64); aim(camera,(0,0,0)); dat.ortho_scale=43
# Make opening the blend useful immediately.
for area in bpy.context.screen.areas:
    if area.type=='VIEW_3D':
        area.spaces.active.region_3d.view_perspective='CAMERA'
        area.spaces.active.clip_end=1000
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'de9-male.blend'))
# Front orthographic technical SVG, editable in Inkscape. Model-coordinate projection.
def path(pts): return 'M '+' L '.join(f'{x:.3f},{-y:.3f}' for x,y in pts)+' Z'
s=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="-21 -13 42 25.2">','<rect x="-21" y="-13" width="42" height="25.2" fill="#f4f1e8"/>','<g stroke="#3a2c1f" stroke-width=".065" stroke-linejoin="round">','<rect x="-15.405" y="-6.275" width="30.81" height="12.55" rx=".65" fill="#d0d5d6"/>']
for pts,fill in [(outline(),'#bcc4c7'),(outline(16.15,13.96,7.71,.75),'#edf0ed')]: s.append(f'<path d="{path(pts)}" fill="{fill}"/>')
for x in (-12.495,12.495):
    pp=[(x+2.35*math.cos(k*math.tau/6),2.35*math.sin(k*math.tau/6)) for k in range(6)]
    s.append(f'<path d="{path(pp)}" fill="#e3e4df"/><circle cx="{x}" cy="0" r="1.02" fill="#635e55"/>')
for row,count in [(1,5),(-1,4)]:
    for j in range(count):
        x=(j-(count-1)/2)*2.74; y=-row*1.42; num=j+1 if row==1 else j+6
        s.append(f'<circle cx="{x}" cy="{y}" r=".49" fill="#c39b50"/><text x="{x}" y="{y-.9}" text-anchor="middle" stroke="none" font-family="monospace" font-size=".68" fill="#3a2c1f">{num}</text>')
s+=['</g>','<g fill="#3a2c1f" font-family="sans-serif"><text x="-18" y="-9.5" font-size="1.3">DE-9 / MALE</text><text x="-18" y="8.6" font-size=".8">Mating face • wide row at top • illustrative geometry</text><text x="-18" y="10.2" font-size=".65">Numbers identify contacts, not electrical functions. Not a manufacturing drawing.</text></g></svg>']
(OUT/'front-view.svg').write_text('\n'.join(s))
print('DELIVERABLES COMPLETE:',OUT)
