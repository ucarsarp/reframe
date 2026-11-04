"""
ReFrame — build_models.py
Builds the vintage film camera and the Fresnel stage light in Blender, then exports:

  blender/reframe-models.blend   open this in Blender to look at / edit the models
  public/models/reframe-models.glb      standard glTF file (for any 3D viewer or other sites)
  public/models/reframe-models.js       the same meshes as a small JS file that three-scene.js loads
                                 (works even when index.html is opened straight from disk)
  blender/preview.png            quick render to check the result

Run it from the project folder:
  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python blender/build_models.py

Conventions (Blender is Z-up; the export converts to Three.js Y-up):
  - Film camera: lens points +X, side door faces -Y (toward the viewer).
  - Stage light: the head points -Y (toward the viewer). The "Head" empty is the tilt pivot.
  - Material names (metal, dark, silver, glass, lens, ridge) match the materials in three-scene.js,
    so the site keeps using the colors from styles.css.
"""
import bpy
import bmesh
import json
import math
import os
from mathutils import Matrix, Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
H = math.pi / 2


# --------------------------------------------------------------------------
# Scene + materials
# --------------------------------------------------------------------------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def srgb(hex_color):
    """'#2b2b2e' -> linear RGBA, which is what Blender colors expect."""
    h = hex_color.lstrip('#')
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def material(name, color, metallic, roughness, glow=0.0):
    m = bpy.data.materials.new(name)
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = srgb(color)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if glow:
        bsdf.inputs['Emission Color'].default_value = srgb(color)
        bsdf.inputs['Emission Strength'].default_value = glow
    return m


# Same colors as the --stage-* variables in styles.css
MAT = {
    'metal':  material('metal', '#2b2b2e', 0.65, 0.42),
    'dark':   material('dark', '#121214', 0.45, 0.6),
    'silver': material('silver', '#b9b9bf', 1.0, 0.25),
    'glass':  material('glass', '#07090c', 0.9, 0.06),
    'lens':   material('lens', '#ffcc88', 0.0, 0.35, glow=4.0),
    'ridge':  material('ridge', '#ffcc88', 0.0, 0.5, glow=1.5),
}


# --------------------------------------------------------------------------
# Building blocks. Every part is a mesh object parented to a group empty.
# --------------------------------------------------------------------------
def empty(name, loc=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.2
    e.location = loc
    e.parent = parent
    scene.collection.objects.link(e)
    return e


def finish(bm, name, mat, parent, loc, rot, bevel=0.0, segments=3, smooth_angle=40):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(MAT[mat])
    me.shade_smooth()
    me.set_sharp_from_angle(angle=math.radians(smooth_angle))
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    ob.rotation_euler = rot
    ob.parent = parent
    scene.collection.objects.link(ob)
    if bevel:
        mod = ob.modifiers.new('Bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = 'ANGLE'
        mod.harden_normals = True
    return ob


def box(name, size, mat, parent, loc=(0, 0, 0), rot=(0, 0, 0), bevel=0.02):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    return finish(bm, name, mat, parent, loc, rot, bevel)


def cylinder(name, r1, r2, depth, mat, parent, loc=(0, 0, 0), rot=(0, 0, 0), seg=48, bevel=0.0):
    """Along local Z: r1 at the bottom (-Z), r2 at the top (+Z)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg,
                          radius1=r1, radius2=r2, depth=depth)
    return finish(bm, name, mat, parent, loc, rot, bevel)


def knurled(name, r, depth, mat, parent, loc=(0, 0, 0), rot=(0, 0, 0), teeth=36):
    """Ring with grip ridges (focus ring, knobs)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=teeth * 2,
                          radius1=r, radius2=r, depth=depth)
    for v in bm.verts:
        a = math.atan2(v.co.y, v.co.x)
        step = round(a / (math.pi / teeth))
        if step % 2:
            v.co.x *= 0.95
            v.co.y *= 0.95
    return finish(bm, name, mat, parent, loc, rot, smooth_angle=20)


def torus(name, major, minor, mat, parent, loc=(0, 0, 0), rot=(0, 0, 0), seg=48, ring=12):
    """Ring lying in local XY (axis = Z)."""
    bm = bmesh.new()
    verts = []
    for i in range(seg):
        a = i / seg * 2 * math.pi
        row = []
        for j in range(ring):
            b = j / ring * 2 * math.pi
            rr = major + minor * math.cos(b)
            row.append(bm.verts.new((rr * math.cos(a), rr * math.sin(a), minor * math.sin(b))))
        verts.append(row)
    for i in range(seg):
        for j in range(ring):
            bm.faces.new((verts[i][j], verts[(i + 1) % seg][j],
                          verts[(i + 1) % seg][(j + 1) % ring], verts[i][(j + 1) % ring]))
    return finish(bm, name, mat, parent, loc, rot, smooth_angle=80)


def sphere(name, r, mat, parent, loc=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=r)
    return finish(bm, name, mat, parent, loc, (0, 0, 0), smooth_angle=80)


def lathe(name, profile, mat, parent, loc=(0, 0, 0), rot=(0, 0, 0), seg=64, smooth_angle=30):
    """Spins a (radius, height) profile around local Z — used for the Fresnel lens."""
    bm = bmesh.new()
    vs = [bm.verts.new((r, 0, z)) for r, z in profile]
    es = [bm.edges.new((vs[i], vs[i + 1])) for i in range(len(vs) - 1)]
    bmesh.ops.spin(bm, geom=vs + es, cent=(0, 0, 0), axis=(0, 0, 1),
                   angle=2 * math.pi, steps=seg, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    return finish(bm, name, mat, parent, loc, rot, smooth_angle=smooth_angle)


# --------------------------------------------------------------------------
# Vintage film camera (about 3.3 units long). Lens points +X.
# --------------------------------------------------------------------------
cam = empty('FilmCamera')
cam_crank = empty('Crank', (0.25, -0.44, -0.1), cam)

box('Body', (1.6, 0.76, 1.0), 'metal', cam, bevel=0.06)
box('SideDoor', (1.2, 0.04, 0.68), 'dark', cam, (-0.05, -0.39, 0), bevel=0.015)
box('BackDoor', (1.2, 0.04, 0.68), 'dark', cam, (-0.05, 0.39, 0), bevel=0.015)
box('Badge', (0.34, 0.012, 0.08), 'silver', cam, (-0.35, -0.414, 0.22), bevel=0.004)
for i, (x, z) in enumerate([(-0.6, 0.29), (0.5, 0.29), (-0.6, -0.29), (0.5, -0.29)]):
    sphere(f'Screw{i}', 0.03, 'silver', cam, (x, -0.415, z))
    sphere(f'ScrewBack{i}', 0.03, 'silver', cam, (x, 0.415, z))
# Door latch
cylinder('Latch', 0.05, 0.05, 0.04, 'silver', cam, (0.38, -0.43, 0), (H, 0, 0), seg=24, bevel=0.008)

# Film magazine: mount + two reels with rims, hubs and spoke holes
box('MagazineMount', (0.5, 0.42, 0.2), 'dark', cam, (0, 0, 0.58), bevel=0.02)
for side, x in (('L', -0.45), ('R', 0.45)):
    cylinder(f'Reel{side}', 0.45, 0.45, 0.3, 'metal', cam, (x, 0, 1.1), (H, 0, 0), seg=64, bevel=0.02)
    for y in (-0.15, 0.15):
        torus(f'ReelRim{side}{y}', 0.45, 0.025, 'silver', cam, (x, y, 1.1), (H, 0, 0), seg=64)
    cylinder(f'ReelHub{side}', 0.08, 0.08, 0.36, 'silver', cam, (x, 0, 1.1), (H, 0, 0), seg=24, bevel=0.01)
    for k in range(3):
        a = k / 3 * 2 * math.pi + (0.5 if side == 'R' else 0)
        for y in (-0.152, 0.152):
            cylinder(f'ReelHole{side}{k}{y}', 0.1, 0.1, 0.006, 'dark', cam,
                     (x + math.cos(a) * 0.26, y, 1.1 + math.sin(a) * 0.26), (H, 0, 0), seg=24)
# Film strip running from each reel down into the body
for side, x in (('L', -0.2), ('R', 0.2)):
    box(f'Film{side}', (0.05, 0.16, 0.42), 'dark', cam, (x, 0, 0.78),
        (0, 0.5 if side == 'L' else -0.5, 0), bevel=0.0)

# Lens: mount, barrel (wider at the front), knurled focus ring, aperture ring, front ring, glass
cylinder('LensMount', 0.34, 0.34, 0.12, 'silver', cam, (0.86, 0, 0), (0, H, 0), seg=48, bevel=0.015)
cylinder('LensBarrel', 0.27, 0.33, 0.72, 'dark', cam, (1.28, 0, 0), (0, H, 0), seg=48)
knurled('FocusRing', 0.315, 0.12, 'silver', cam, (1.1, 0, 0), (0, H, 0))
torus('ApertureRing', 0.315, 0.014, 'silver', cam, (1.3, 0, 0), (0, H, 0))
torus('ApertureRing2', 0.322, 0.014, 'silver', cam, (1.4, 0, 0), (0, H, 0))
torus('FrontRing', 0.34, 0.045, 'silver', cam, (1.64, 0, 0), (0, H, 0))
torus('InnerRing', 0.25, 0.02, 'dark', cam, (1.64, 0, 0), (0, H, 0))
lathe('LensGlass', [(0.31, 0), (0.2, 0.02), (0.1, 0.03), (0, 0.033)], 'glass', cam,
      (1.635, 0, 0), (0, H, 0), seg=48, smooth_angle=80)

# Viewfinder + eyecup on the back
cylinder('Viewfinder', 0.13, 0.1, 0.4, 'dark', cam, (-0.98, -0.26, 0.22), (0, -H, 0), seg=24, bevel=0.01)
torus('Eyecup', 0.11, 0.03, 'silver', cam, (-1.18, -0.26, 0.22), (0, H, 0), seg=32)
box('ViewfinderMount', (0.2, 0.12, 0.12), 'dark', cam, (-0.86, -0.26, 0.22), bevel=0.02)

# Pistol-grip handle with a trigger
box('Grip', (0.26, 0.32, 0.62), 'dark', cam, (-0.28, 0, -0.78), (0, 0.25, 0), bevel=0.08)
box('Trigger', (0.06, 0.08, 0.14), 'silver', cam, (-0.08, 0, -0.6), (0, 0.25, 0), bevel=0.02)

# Hand crank (three-scene.js turns this group around its axis)
cylinder('CrankDisc', 0.12, 0.12, 0.05, 'silver', cam_crank, rot=(H, 0, 0), seg=32, bevel=0.01)
box('CrankArm', (0.05, 0.03, 0.34), 'silver', cam_crank, (0, -0.04, -0.17), bevel=0.01)
knurled('CrankKnob', 0.045, 0.16, 'dark', cam_crank, (0, -0.12, -0.32), (H, 0, 0), teeth=10)


# --------------------------------------------------------------------------
# Fresnel stage light on a tripod stand. Head points -Y; "Head" is the tilt pivot.
# --------------------------------------------------------------------------
light = empty('StageLight', (6, 0, 0))
head = empty('Head', (0, 0, 0), light)

# Housing (front slightly wider) with cooling fins, rear cap and a top vent
cylinder('Housing', 0.36, 0.42, 0.86, 'metal', head, rot=(H, 0, 0), seg=64, bevel=0.02)
for i, y in enumerate((0.3, 0.2, 0.1, 0.0, -0.1)):
    r = 0.36 + (0.43 - y) / 0.86 * 0.06
    cylinder(f'Fin{i}', r + 0.035, r + 0.035, 0.022, 'dark', head, (0, y, 0), (H, 0, 0), seg=64)
cylinder('RearCap', 0.24, 0.2, 0.1, 'dark', head, (0, 0.47, 0), (H, 0, 0), seg=32, bevel=0.015)
knurled('RearKnob', 0.06, 0.08, 'silver', head, (0, 0.55, 0), (H, 0, 0), teeth=12)
box('TopVent', (0.26, 0.46, 0.05), 'dark', head, (0, 0.02, 0.405), bevel=0.015)
for i in range(4):
    box(f'VentSlat{i}', (0.22, 0.02, 0.02), 'silver', head, (0, -0.12 + i * 0.09, 0.435), bevel=0.0)
box('Handle', (0.06, 0.06, 0.12), 'dark', head, (0, 0.35, 0.42), bevel=0.01)

# Bezel + stepped Fresnel lens (concentric sawtooth rings, spun on a lathe)
torus('Bezel', 0.42, 0.045, 'silver', head, (0, -0.43, 0), (H, 0, 0), seg=64)
rings = [0.0, 0.1, 0.18, 0.26, 0.33, 0.39]
profile = [(0.0, 0.03)]
for a, b in zip(rings, rings[1:]):
    if a > 0:
        profile.append((a, 0.03))          # step up at the start of each ring
    profile.append((b - 0.002, 0.0))      # slope back down across the ring
profile.append((0.39, 0.0))
lathe('FresnelLens', [(r, z) for r, z in profile], 'lens', head, (0, -0.41, 0), (H, 0, 0))
for i, r in enumerate(rings[1:-1]):
    torus(f'Ridge{i}', r, 0.006, 'ridge', head, (0, -0.442, 0), (H, 0, 0), seg=64, ring=6)

# Barn doors: square frame at the bezel + four flaps opened outward, with hinge pins
box('DoorFrameTop', (0.94, 0.04, 0.04), 'dark', head, (0, -0.46, 0.45), bevel=0.008)
box('DoorFrameBottom', (0.94, 0.04, 0.04), 'dark', head, (0, -0.46, -0.45), bevel=0.008)
box('DoorFrameRight', (0.04, 0.04, 0.94), 'dark', head, (0.45, -0.46, 0), bevel=0.008)
box('DoorFrameLeft', (0.04, 0.04, 0.94), 'dark', head, (-0.45, -0.46, 0), bevel=0.008)
a, ln = 0.5, 0.36
fy = -(0.47 + math.cos(a) * ln / 2)
box('DoorTop', (0.74, ln, 0.02), 'dark', head, (0, fy, 0.45 + math.sin(a) * ln / 2), (-a, 0, 0), bevel=0.006)
box('DoorBottom', (0.74, ln, 0.02), 'dark', head, (0, fy, -0.45 - math.sin(a) * ln / 2), (a, 0, 0), bevel=0.006)
ln2 = ln * 0.9
fy2 = -(0.47 + math.cos(a) * ln2 / 2)
box('DoorRight', (0.02, ln2, 0.62), 'dark', head, (0.45 + math.sin(a) * ln2 / 2, fy2, 0), (0, 0, a), bevel=0.006)
box('DoorLeft', (0.02, ln2, 0.62), 'dark', head, (-0.45 - math.sin(a) * ln2 / 2, fy2, 0), (0, 0, -a), bevel=0.006)
cylinder('HingeTop', 0.015, 0.015, 0.76, 'silver', head, (0, -0.47, 0.45), (0, H, 0), seg=12)
cylinder('HingeBottom', 0.015, 0.015, 0.76, 'silver', head, (0, -0.47, -0.45), (0, H, 0), seg=12)
cylinder('HingeRight', 0.015, 0.015, 0.64, 'silver', head, (0.45, -0.47, 0), seg=12)
cylinder('HingeLeft', 0.015, 0.015, 0.64, 'silver', head, (-0.45, -0.47, 0), seg=12)

# Yoke (U-bracket) with knurled tilt knobs
box('YokeRight', (0.04, 0.08, 0.62), 'dark', light, (0.5, 0, -0.26), bevel=0.012)
box('YokeLeft', (0.04, 0.08, 0.62), 'dark', light, (-0.5, 0, -0.26), bevel=0.012)
box('YokeBottom', (1.04, 0.08, 0.05), 'dark', light, (0, 0, -0.57), bevel=0.012)
for side, x in (('R', 0.55), ('L', -0.55)):
    knurled(f'TiltKnob{side}', 0.075, 0.07, 'silver', light, (x, 0, 0), (0, H, 0), teeth=12)
    cylinder(f'TiltBolt{side}', 0.03, 0.03, 0.04, 'dark', light, (x * 1.1, 0, 0), (0, H, 0), seg=16)

# Telescoping stand: upper pole, lock collar, lower pole, leg hub and three legs with feet
cylinder('PoleUpper', 0.028, 0.028, 0.75, 'silver', light, (0, 0, -0.95), seg=16)
knurled('PoleCollar', 0.06, 0.08, 'dark', light, (0, 0, -1.32), teeth=12)
cylinder('LockScrew', 0.015, 0.015, 0.14, 'silver', light, (0.1, 0, -1.32), (0, H, 0), seg=12)
cylinder('PoleLower', 0.04, 0.04, 0.8, 'dark', light, (0, 0, -1.72), seg=16)
cylinder('LegHub', 0.07, 0.07, 0.1, 'silver', light, (0, 0, -2.1), seg=24, bevel=0.01)
leg_top = Vector((0, 0, -2.1))
for i in range(3):
    ang = i / 3 * 2 * math.pi + 0.4
    d = Vector((math.sin(ang) * 0.6, -math.cos(ang) * 0.6, -0.8)).normalized()
    rot = Vector((0, 0, 1)).rotation_difference(d).to_euler()
    cylinder(f'Leg{i}', 0.025, 0.02, 0.85, 'dark', light, leg_top + d * 0.425, rot, seg=12)
    sphere(f'Foot{i}', 0.035, 'dark', light, leg_top + d * 0.86)


# --------------------------------------------------------------------------
# Export: .blend, .glb, and a JS data file for three-scene.js
# --------------------------------------------------------------------------
os.makedirs(os.path.join(ROOT, 'public', 'models'), exist_ok=True)
bpy.context.view_layer.update()
depsgraph = bpy.context.evaluated_depsgraph_get()


def to_three(v):
    """Blender Z-up -> Three.js Y-up."""
    return (v.x, v.z, -v.y)


def export_model(root, group_names):
    """Merges each group's meshes by material, in the group's own space (so it can be animated)."""
    groups = []
    for gname, node in group_names.items():
        inv = node.matrix_world.inverted()
        buckets = {}
        for ob in root.children_recursive:
            if ob.type != 'MESH' or ob.parent != node:
                continue
            ev = ob.evaluated_get(depsgraph)
            me = ev.to_mesh()
            me.calc_loop_triangles()
            mtx = inv @ ob.matrix_world
            nmtx = mtx.to_3x3().inverted().transposed()
            normals = me.corner_normals
            mat_name = me.materials[0].name
            b = buckets.setdefault(mat_name, {'p': [], 'n': [], 'i': [], 'lookup': {}})
            for tri in me.loop_triangles:
                for li in tri.loops:
                    p = to_three(mtx @ me.vertices[me.loops[li].vertex_index].co)
                    n = to_three((nmtx @ normals[li].vector).normalized())
                    k = (tuple(round(c, 4) for c in p), tuple(round(c, 3) for c in n))
                    idx = b['lookup'].get(k)
                    if idx is None:
                        idx = len(b['p']) // 3
                        b['lookup'][k] = idx
                        b['p'].extend(k[0])
                        b['n'].extend(k[1])
                    b['i'].append(idx)
            ev.to_mesh_clear()
        offset = to_three(root.matrix_world.inverted() @ node.matrix_world.translation)
        groups.append({
            'name': gname,
            'position': [round(c, 4) for c in offset],
            'parts': [{'m': m, 'p': b['p'], 'n': b['n'], 'i': b['i']} for m, b in buckets.items()],
        })
    return {'groups': groups}


data = {
    'camera': export_model(cam, {'body': cam, 'crank': cam_crank}),
    'light': export_model(light, {'stand': light, 'head': head}),
}
with open(os.path.join(ROOT, 'public', 'models', 'reframe-models.js'), 'w') as f:
    f.write('/* Generated by blender/build_models.py — do not edit by hand; re-run the script instead. */\n')
    f.write('window.REFRAME_MODELS = ')
    json.dump(data, f, separators=(',', ':'))
    f.write(';\n')

verts = sum(len(p['p']) // 3 for m in data.values() for g in m['groups'] for p in g['parts'])
tris = sum(len(p['i']) // 3 for m in data.values() for g in m['groups'] for p in g['parts'])
print(f'[build_models] {verts} vertices, {tris} triangles')

bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT, 'public', 'models', 'reframe-models.glb'),
                          export_format='GLB', export_apply=True, export_yup=True)

# Preview render: dark studio, warm key, cool rim
world = bpy.data.worlds.new('World')
world.color = (0.01, 0.01, 0.012)
scene.world = world
for name, loc, energy, color in (('Key', (-4, -6, 5), 900, (1, 1, 1)),
                                 ('Rim', (6, 6, 4), 1200, (0.78, 0.84, 1)),
                                 ('Fill', (3, -6, -1), 200, (1, 0.8, 0.55))):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.energy, ld.color, ld.size = energy, color, 3
    lo = bpy.data.objects.new(name, ld)
    lo.location = loc
    lo.rotation_euler = (Vector((3, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    scene.collection.objects.link(lo)
cam.rotation_euler = (0, 0, -0.6)
light.rotation_euler = (0, 0, -0.5)
head.rotation_euler = (0.15, 0, 0)
cd = bpy.data.cameras.new('PreviewCam')
cd.lens = 50
co = bpy.data.objects.new('PreviewCam', cd)
co.location = (3, -15, 1.2)
co.rotation_euler = (math.radians(88), 0, 0)
scene.collection.objects.link(co)
scene.camera = co
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.device = 'CPU'
scene.render.resolution_x, scene.render.resolution_y = 1200, 700
scene.render.filepath = os.path.join(ROOT, 'blender', 'preview.png')
bpy.ops.render.render(write_still=True)

# Reset the preview poses before saving so the .blend matches the export
cam.rotation_euler = light.rotation_euler = head.rotation_euler = (0, 0, 0)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'blender', 'reframe-models.blend'))
print('[build_models] done')
