"""Project the editable Blender model into an Inkscape technical plate.
Run: Blender --background de9-male.blend --python technical_plate.py
Visible feature edges are tested against the evaluated mesh, not traced from a render.
"""
import bpy, math
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from html import escape
OUT=Path(__file__).resolve().parent
scene=bpy.context.scene
INK='#3a2c1f'; PAPER='#f4f1e8'
view=Vector((30,-48,85)).normalized()
right=Vector((0,0,1)).cross(view).normalized()
up=view.cross(right).normalized()
# Camera screen right should preserve world X towards the right.
assert right.x>0
parts=list(bpy.data.collections['DE-9 • editable parts'].objects)
def geometry(frame):
    scene.frame_set(frame); dg=bpy.context.evaluated_depsgraph_get()
    meshes=[]; vertices=[]; triangles=[]
    for ob in parts:
        ev=ob.evaluated_get(dg); mesh=ev.to_mesh(); mesh.calc_loop_triangles()
        vs=[ev.matrix_world@v.co for v in mesh.vertices]
        fs=[tuple(p.vertices) for p in mesh.polygons]
        norms=[]
        for p in mesh.polygons: norms.append((ev.matrix_world.to_3x3()@p.normal).normalized())
        adj={}
        for idx,p in enumerate(mesh.polygons):
            for key in p.edge_keys: adj.setdefault(tuple(sorted(key)),[]).append(idx)
        base=len(vertices); vertices+=vs
        tris=[tuple(t.vertices) for t in mesh.loop_triangles]
        triangles += [tuple(base+i for i in t) for t in tris]
        meshes.append((ob.name,vs,fs,norms,adj))
        ev.to_mesh_clear()
    return meshes,BVHTree.FromPolygons(vertices,triangles,all_triangles=True)
def project(v,cx,cy,scale): return (cx+v.dot(right)*scale,cy-v.dot(up)*scale)
def svg_model(frame,cx,cy,scale,prefix):
    meshes,bvh=geometry(frame); faces=[]; edges=[]
    for name,vs,fs,norms,adj in meshes:
        for f,n in zip(fs,norms):
            if n.dot(view)<=0: continue
            depth=sum(vs[i].dot(view) for i in f)/len(f)
            light=n.dot(Vector((-.4,-.5,.8)).normalized())
            if name.startswith('04'): fill='#d9c49c' if light>.55 else '#e7d9bd'
            elif name.startswith('03'): fill='#dedbd2' if light>.55 else '#c9c6bd'
            else: fill='#faf8f2' if light>.55 else '#e8e5dc'
            points=' '.join('%.2f,%.2f'%project(vs[i],cx,cy,scale) for i in f)
            faces.append((depth,f'<polygon points="{points}" fill="{fill}"/>'))
        for key,polys in adj.items():
            ns=[norms[i] for i in polys]
            silhouette=len(ns)==1 or (min(n.dot(view) for n in ns)<0<max(n.dot(view) for n in ns))
            crease=len(ns)==2 and ns[0].dot(ns[1])<math.cos(math.radians(38)) and max(n.dot(view) for n in ns)>0
            if not (silhouette or crease): continue
            a,b=(vs[i] for i in key); steps=max(2,math.ceil((b-a).length/.14)); run=[]
            for j in range(steps+1):
                p=a.lerp(b,j/steps)
                hit,normal,idx,dist=bvh.ray_cast(p+view*150,-view,151)
                visible=hit is None or (hit-p).length<.055
                if visible: run.append(project(p,cx,cy,scale))
                if (not visible or j==steps) and run:
                    if len(run)>1:
                        points=' '.join('%.2f,%.2f'%v for v in run)
                        edges.append(f'<polyline points="{points}"/>')
                    run=[]
    return f'<g id="{prefix}" inkscape:groupmode="layer" inkscape:label="{prefix}">'+''.join(x[1] for x in sorted(faces,key=lambda x:x[0]))+f'<g fill="none" stroke="{INK}" stroke-width="{1.35 if scale>15 else 1.05}" stroke-linecap="round" stroke-linejoin="round">'+''.join(edges)+'</g></g>'
svg=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="1600" height="1250" viewBox="0 0 1600 1250"><title>DE-9 male connector: exploded technical illustration</title><desc>Exploded axonometric projection of the Blender model, with six keyed part descriptions and an assembled inset.</desc><rect width="1600" height="1250" fill="{PAPER}"/>']
def txt(x,y,text,size=18,family='sans-serif',weight='normal',fill=INK):
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}">{escape(text)}</text>'
svg += [txt(65,61,'198x  /  HARDWARE STUDIES',15,'monospace'),txt(65,121,'Inside a nine-pin D-sub',48,'serif'),txt(65,157,'DE-9 male · exploded axonometric view',20),f'<path d="M65 187 H1535" stroke="{INK}" stroke-width="1"/>',txt(1500,61,'01',18,'monospace')]
# Model fills occlude the assembly centreline as they would on a drawing.
cx,cy,scale=545,690,23
p0=project(Vector((0,0,-17)),cx,cy,scale); p1=project(Vector((0,0,28)),cx,cy,scale)
svg.append(f'<path d="M{p0[0]},{p0[1]} L{p1[0]},{p1[1]}" fill="none" stroke="#a9a292" stroke-width="1" stroke-dasharray="10 5 2 5"/>')
svg.append(svg_model(90,cx,cy,scale,'Exploded model'))
# Callout bubbles attached to visible points. Text is editable and separate from geometry.
callouts=[('01',Vector((0,4.17,23.9)),(835,285)),('02',Vector((-12.495,0,16.6)),(200,360)),('03',Vector((4.60,-1.42,5.5)),(880,480)),('04',Vector((15,0,-.4)),(940,720)),('05',Vector((14.4,-.8,-5.85)),(940,900)),('06',Vector((0,-3.725,-10)),(730,1090))]
svg.append('<g id="Callouts" inkscape:groupmode="layer" inkscape:label="Callouts">')
for number,anchor,(bx,by) in callouts:
    ax,ay=project(anchor,cx,cy,scale)
    svg.append(f'<path d="M{ax:.2f} {ay:.2f} L{bx-28 if bx>ax else bx+28} {by} H{bx}" fill="none" stroke="{INK}" stroke-width="1"/><circle cx="{ax:.2f}" cy="{ay:.2f}" r="2.6" fill="{INK}"/><circle cx="{bx}" cy="{by}" r="19" fill="{PAPER}" stroke="{INK}" stroke-width="1.2"/>')
    svg.append(f'<text x="{bx}" y="{by+5}" font-family="monospace" font-size="14" text-anchor="middle" fill="{INK}">{number}</text>')
svg.append('</g>')
svg.append(f'<path d="M1055 222 V1130" stroke="#ccc5b6"/>')
notes=[('01','Formed metal shell',['The D-shaped surround gives','the connector its orientation.']),('02','Hex jackposts',['Mounting hardware. Internal','threads are omitted here.']),('03','Nine individual contacts',['Five above, four below.','Shown with simplified straight tails.']),('04','Mounting flange',['Supports the connector and','locates the mounting hardware.']),('05','Rear washers',['Separate pieces around the','mounting openings.']),('06','Insulating insert',['Keeps the contacts positioned','and separated from the shell.'])]
y=252
for number,title,lines in notes:
    svg += [txt(1100,y,number,15,'monospace'),txt(1150,y,title,22,'serif')]
    for i,line in enumerate(lines): svg.append(txt(1150,y+29+i*23,line,16))
    y+=101
svg += [f'<path d="M1100 866 H1535" stroke="#ccc5b6"/>',txt(1100,899,'ASSEMBLED',14,'monospace')]
svg.append(svg_model(1,1320,1030,10,'Assembled inset'))
svg += [f'<path d="M65 1161 H1535" stroke="{INK}"/>',txt(65,1196,'Illustrative construction · not to scale · not a manufacturing drawing',17,'serif'),txt(65,1224,'Views derived from the editable 3D model. Separation is explanatory, not a verified disassembly sequence.',14),'</svg>']
(OUT/'technical-plate.svg').write_text('\n'.join(svg))
print('Wrote technical-plate.svg')
