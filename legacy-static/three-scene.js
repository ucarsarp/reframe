/* ==========================================================================
   ReFrame — three-scene.js
   A vintage film camera and three Fresnel stage lights, drawn with Three.js
   on a canvas behind the hero content.

   Where to change things:
   - Colors ............ CSS variables --stage-* at the top of styles.css
   - Positions / sizes . layout() below
   - Rotation / float .. CONFIG.motion below
   - Light strength .... CONFIG.lights below

   The scene uses 1 world unit = 1 CSS pixel at the hero's depth, so positions
   and sizes in layout() are plain pixels measured from the hero's top-left.
   ========================================================================== */
(function () {
  'use strict';

  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('hero-canvas');
  if (!hero || !canvas || typeof THREE === 'undefined') return; // no Three.js (e.g. offline): skip quietly

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rootStyle = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => rootStyle.getPropertyValue(name).trim() || fallback;

  /* ------------------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------------------ */
  const CONFIG = {
    colors: {
      glow:   cssVar('--stage-glow', '#ffcc88'),
      metal:  cssVar('--stage-metal', '#2b2b2e'),
      dark:   cssVar('--stage-metal-dark', '#121214'),
      silver: cssVar('--stage-silver', '#b9b9bf'),
      key:    cssVar('--stage-key-light', '#ffffff'),
      rim:    cssVar('--stage-rim-light', '#c8d6ff'),
    },
    motion: {
      cameraSpin: 0.22,   // camera turntable speed (radians per second)
      lightSway:  0.35,   // how fast the stage lights swing left/right
      swayAmount: 0.22,   // how far they swing (radians)
      floatSpeed: 0.8,    // up/down bob speed
      floatAmount: 10,    // up/down bob distance (px)
    },
    lights: {
      ambient: 0.35,      // overall fill
      key: 2.4,           // soft key light from front-left
      rim: 3.2,           // rim light from behind, separates objects from the black background
      lensGlow: 2.2,      // brightness of the Fresnel lens faces
      beamOpacity: 0.07,  // soft light beam in front of each Fresnel
    },
  };

  /* ------------------------------------------------------------------------
     LAYOUT — change object positions and sizes here.
     x / y are pixels from the hero's top-left corner.
     size = camera width, or stage light height (including stand), in pixels.
     aim = 1 points a light to the right, -1 to the left.
     tilt = how much a light head points down (radians).
     Return null for a light to hide it at that screen size.
     ------------------------------------------------------------------------ */
  function layout(w) {
    const heroBox = hero.getBoundingClientRect();
    const title = document.querySelector('.hero__title').getBoundingClientRect();
    const media = document.querySelector('.hero__media').getBoundingClientRect();
    const titleTop = title.top - heroBox.top;
    const mediaTop = media.top - heroBox.top;

    // Phones: everything sits in a band above the headline (see --hero-stage-h)
    if (w < 640) {
      const navH = document.getElementById('nav').offsetHeight || 112; // countdown bar + nav
      const stageH = parseFloat(cssVar('--hero-stage-h', '150')) || 150;
      const cy = navH + 12 + stageH / 2;
      return {
        camera: { x: w * 0.5, y: cy, size: 130 },
        lights: [
          { x: w * 0.13, y: cy + 4, size: 104, aim: 1,  tilt: 0.12 },
          { x: w * 0.87, y: cy + 4, size: 104, aim: -1, tilt: 0.12 },
          null,
        ],
      };
    }

    // Tablet and desktop: frame the headline from the sides,
    // with two lights peeking out from behind the screenshot.
    const camSize = Math.min(210, Math.max(110, w * 0.14));
    const lightSize = Math.min(230, Math.max(120, w * 0.14));
    return {
      camera: { x: w * 0.1, y: titleTop + title.height * 0.42, size: camSize },
      lights: [
        { x: w * 0.9, y: titleTop + title.height * 0.38, size: lightSize,        aim: -1, tilt: 0.18 },
        { x: w * 0.93, y: mediaTop + lightSize * 0.05,    size: lightSize * 0.85, aim: -1, tilt: 0.05 },
        { x: w * 0.07, y: mediaTop + lightSize * 0.15,    size: lightSize * 0.85, aim: 1,  tilt: 0.05 },
      ],
    };
  }

  /* ------------------------------------------------------------------------
     Renderer, scene, camera
     ------------------------------------------------------------------------ */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return; // WebGL unavailable: the hero simply shows without 3D
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // cap at 2 for performance
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const view = new THREE.PerspectiveCamera(22, 1, 1, 10000);
  scene.environment = makeEnvironment();

  // Lighting: soft key from the front-left, cool rim from behind, a little ambient fill
  scene.add(new THREE.AmbientLight(0xffffff, CONFIG.lights.ambient));
  const key = new THREE.DirectionalLight(CONFIG.colors.key, CONFIG.lights.key);
  key.position.set(-1, 1.2, 1.4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(CONFIG.colors.rim, CONFIG.lights.rim);
  rim.position.set(1.2, 0.8, -1.5);
  scene.add(rim);
  const rim2 = new THREE.DirectionalLight(CONFIG.colors.glow, CONFIG.lights.rim * 0.4);
  rim2.position.set(-1.4, -0.2, -1.2);
  scene.add(rim2);

  /* ------------------------------------------------------------------------
     Materials
     ------------------------------------------------------------------------ */
  const C = CONFIG.colors;
  const mat = {
    metal:  new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.65, roughness: 0.42 }),
    dark:   new THREE.MeshStandardMaterial({ color: C.dark, metalness: 0.45, roughness: 0.6 }),
    silver: new THREE.MeshStandardMaterial({ color: C.silver, metalness: 1, roughness: 0.25 }),
    glass:  new THREE.MeshStandardMaterial({ color: 0x07090c, metalness: 0.9, roughness: 0.06 }),
    lens:   new THREE.MeshStandardMaterial({ color: C.glow, emissive: C.glow, emissiveIntensity: CONFIG.lights.lensGlow, roughness: 0.35 }),
    ridge:  new THREE.MeshStandardMaterial({ color: C.glow, emissive: C.glow, emissiveIntensity: CONFIG.lights.lensGlow * 0.45, roughness: 0.5 }),
  };

  const glowTexture = radialTexture();
  const beamTexture = beamAlphaTexture();

  /* ------------------------------------------------------------------------
     Build objects
     ------------------------------------------------------------------------ */
  const filmCamera = wrap(buildFilmCamera(), 'x');
  scene.add(filmCamera.root);

  const stageLights = [0, 1, 2].map(() => {
    const light = buildStageLight();
    const w = wrap(light.model, 'y', light.extras);
    w.head = light.head;
    scene.add(w.root);
    return w;
  });

  /* Models built in Blender (blender/build_models.py -> models/reframe-models.js).
     Each group becomes a THREE.Group (so the crank and light head can still move),
     and each part uses the matching material above, so the CSS colors still apply.
     Returns null when the file isn't loaded; the hand-coded models below are used instead. */
  function fromBlender(name) {
    const data = window.REFRAME_MODELS && window.REFRAME_MODELS[name];
    if (!data) return null;
    const root = new THREE.Group();
    const nodes = {};
    data.groups.forEach((grp, i) => {
      const node = i === 0 ? root : new THREE.Group();
      if (i > 0) {
        node.position.fromArray(grp.position);
        root.add(node);
      }
      grp.parts.forEach((part) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(part.p, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(part.n, 3));
        geo.setIndex(part.i);
        node.add(new THREE.Mesh(geo, mat[part.m] || mat.metal));
      });
      nodes[grp.name] = node;
    });
    return { root, nodes };
  }

  /* Vintage movie camera: box body, twin-reel film magazine, lens barrel with
     a front ring, side crank, viewfinder and a pistol-grip handle. Lens faces +x. */
  function buildFilmCamera() {
    const fromFile = fromBlender('camera');
    if (fromFile) {
      fromFile.root.userData.crank = fromFile.nodes.crank;
      return fromFile.root;
    }

    const g = new THREE.Group();
    const add = (geo, m, x, y, z, rx, ry, rz) => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set(x || 0, y || 0, z || 0);
      mesh.rotation.set(rx || 0, ry || 0, rz || 0);
      g.add(mesh);
      return mesh;
    };
    const H = Math.PI / 2;

    // Body + side door with silver screws
    add(new THREE.BoxGeometry(1.6, 1.0, 0.76), mat.metal);
    add(new THREE.BoxGeometry(1.2, 0.68, 0.04), mat.dark, -0.05, 0, 0.4);
    [[-0.6, 0.29], [0.5, 0.29], [-0.6, -0.29], [0.5, -0.29]].forEach(([x, y]) =>
      add(new THREE.SphereGeometry(0.03, 10, 8), mat.silver, x, y, 0.43));

    // Film magazine: mount + two reels with silver rims and hubs
    add(new THREE.BoxGeometry(0.5, 0.2, 0.42), mat.dark, 0, 0.58, 0);
    [-0.45, 0.45].forEach((x) => {
      add(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 48), mat.metal, x, 1.1, 0, H);
      add(new THREE.TorusGeometry(0.45, 0.025, 8, 48), mat.silver, x, 1.1, 0.15);
      add(new THREE.TorusGeometry(0.45, 0.025, 8, 48), mat.silver, x, 1.1, -0.15);
      add(new THREE.CylinderGeometry(0.08, 0.08, 0.36, 16), mat.silver, x, 1.1, 0, H);
    });

    // Lens: silver mount, barrel (wider at the front), focus rings, front ring, glass
    add(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 40), mat.silver, 0.86, 0, 0, 0, 0, -H);
    add(new THREE.CylinderGeometry(0.33, 0.27, 0.72, 40), mat.dark, 1.28, 0, 0, 0, 0, -H);
    [1.08, 1.2, 1.32].forEach((x) =>
      add(new THREE.TorusGeometry(0.29, 0.015, 6, 40), mat.silver, x, 0, 0, 0, H, 0));
    add(new THREE.TorusGeometry(0.34, 0.045, 12, 48), mat.silver, 1.64, 0, 0, 0, H, 0);
    add(new THREE.CircleGeometry(0.31, 40), mat.glass, 1.645, 0, 0, 0, H, 0);

    // Viewfinder + eyecup on the back
    add(new THREE.CylinderGeometry(0.1, 0.13, 0.4, 20), mat.dark, -0.98, 0.22, 0.26, 0, 0, H);
    add(new THREE.TorusGeometry(0.11, 0.025, 8, 24), mat.silver, -1.18, 0.22, 0.26, 0, H, 0);

    // Pistol-grip handle underneath
    add(new THREE.BoxGeometry(0.26, 0.62, 0.32), mat.dark, -0.28, -0.78, 0, 0, 0, -0.25);

    // Hand crank on the side (it turns while the camera spins)
    const crank = new THREE.Group();
    crank.position.set(0.25, -0.1, 0.44);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24), mat.silver);
    disc.rotation.x = H;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.03), mat.silver);
    arm.position.set(0, -0.17, 0.04);
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.16, 12), mat.dark);
    knob.rotation.x = H;
    knob.position.set(0, -0.32, 0.12);
    crank.add(disc, arm, knob);
    g.add(crank);
    g.userData.crank = crank;

    return g;
  }

  /* Fresnel stage light: housing with fins, bezel, ridged glowing lens,
     barn doors, yoke and a tripod stand. The head points along +z. */
  function buildStageLight() {
    const fromFile = fromBlender('light');
    const model = fromFile ? fromFile.root : new THREE.Group();
    const head = fromFile ? fromFile.nodes.head : new THREE.Group(); // pivots inside the yoke (tilt)
    if (fromFile) return { model, head, extras: () => addLightExtras(head) };
    model.add(head);
    const H = Math.PI / 2;
    const mesh = (geo, m, parent, x, y, z, rx, ry, rz) => {
      const o = new THREE.Mesh(geo, m);
      o.position.set(x || 0, y || 0, z || 0);
      o.rotation.set(rx || 0, ry || 0, rz || 0);
      parent.add(o);
      return o;
    };

    // Housing (front slightly wider) + cooling fins
    mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.86, 48), mat.metal, head, 0, 0, 0, H);
    [-0.25, -0.1, 0.05].forEach((z) =>
      mesh(new THREE.TorusGeometry(0.4, 0.02, 6, 40), mat.dark, head, 0, 0, z));
    mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 24), mat.dark, head, 0, 0, -0.46, H);

    // Bezel, lens and Fresnel ridges
    mesh(new THREE.TorusGeometry(0.42, 0.045, 12, 48), mat.silver, head, 0, 0, 0.43);
    mesh(new THREE.CircleGeometry(0.39, 48), mat.lens, head, 0, 0, 0.435);
    [0.1, 0.18, 0.26, 0.33].forEach((r) =>
      mesh(new THREE.TorusGeometry(r, 0.008, 4, 48), mat.ridge, head, 0, 0, 0.44));

    // Barn doors, hinged at the bezel and opened outward
    const a = 0.5, len = 0.36;
    mesh(new THREE.BoxGeometry(0.74, 0.02, len), mat.dark, head, 0, 0.45 + Math.sin(a) * len / 2, 0.45 + Math.cos(a) * len / 2, -a);
    mesh(new THREE.BoxGeometry(0.74, 0.02, len), mat.dark, head, 0, -0.45 - Math.sin(a) * len / 2, 0.45 + Math.cos(a) * len / 2, a);
    mesh(new THREE.BoxGeometry(0.02, 0.62, len * 0.9), mat.dark, head, 0.45 + Math.sin(a) * len * 0.45, 0, 0.45 + Math.cos(a) * len * 0.45, 0, a);
    mesh(new THREE.BoxGeometry(0.02, 0.62, len * 0.9), mat.dark, head, -0.45 - Math.sin(a) * len * 0.45, 0, 0.45 + Math.cos(a) * len * 0.45, 0, -a);

    // Yoke with silver tilt knobs
    mesh(new THREE.BoxGeometry(0.04, 0.62, 0.08), mat.dark, model, 0.5, -0.26, 0);
    mesh(new THREE.BoxGeometry(0.04, 0.62, 0.08), mat.dark, model, -0.5, -0.26, 0);
    mesh(new THREE.BoxGeometry(1.04, 0.05, 0.08), mat.dark, model, 0, -0.57, 0);
    mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16), mat.silver, model, 0.54, 0, 0, 0, 0, H);
    mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16), mat.silver, model, -0.54, 0, 0, 0, 0, H);

    // Stand: pole, collar and three legs
    mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.7, 12), mat.dark, model, 0, -1.43, 0);
    mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16), mat.silver, model, 0, -1.6, 0);
    const legTop = new THREE.Vector3(0, -2.1, 0);
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < 3; i++) {
      const ang = (i / 3) * Math.PI * 2 + 0.4;
      const dir = new THREE.Vector3(Math.sin(ang) * 0.6, -0.8, Math.cos(ang) * 0.6).normalize();
      const leg = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 8), mat.dark, model);
      leg.quaternion.setFromUnitVectors(up, dir);
      leg.position.copy(legTop).addScaledVector(dir, 0.425);
    }

    return { model, head, extras: () => addLightExtras(head) };
  }

  // Glow + beam + warm light (added after measuring, so they don't count toward size)
  function addLightExtras(head) {
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture, color: C.glow, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    glow.position.set(0, 0, 0.55);
    glow.scale.set(1.9, 1.9, 1);
    head.add(glow);

    const beamLen = 4;
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 0.38, beamLen, 40, 1, true),
      new THREE.MeshBasicMaterial({
        color: C.glow, alphaMap: beamTexture, transparent: true, opacity: CONFIG.lights.beamOpacity,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      })
    );
    beam.rotation.x = Math.PI / 2;          // narrow end at the lens, wide end forward
    beam.position.z = 0.45 + beamLen / 2;
    head.add(beam);

    const warm = new THREE.PointLight(C.glow, 1.4, 0, 0);
    warm.position.set(0, 0, 0.9);
    head.add(warm);
  }

  /* Wraps a model so it can be centered, scaled to a pixel size, spun and floated.
     root (position + float) > spin (rotation) > model (centered) */
  function wrap(model, measureAxis, addExtras) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    if (addExtras) addExtras();
    const spin = new THREE.Group();
    spin.add(model);
    const root = new THREE.Group();
    root.add(spin);
    return { root, spin, model, baseSize: size[measureAxis], baseY: 0, aim: 1, tilt: 0, phase: Math.random() * Math.PI * 2 };
  }

  /* ------------------------------------------------------------------------
     Sizing: match the canvas to the hero and place objects in pixel space
     ------------------------------------------------------------------------ */
  let width = 0, height = 0;

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);

    // Put the camera at the distance where 1 unit = 1px on the z = 0 plane
    view.aspect = width / height;
    const dist = (height / 2) / Math.tan(THREE.MathUtils.degToRad(view.fov / 2));
    view.position.set(0, 0, dist);
    view.near = dist * 0.5;
    view.far = dist * 1.5;
    view.updateProjectionMatrix();

    const L = layout(width);
    place(filmCamera, L.camera);
    filmCamera.spin.rotation.x = 0.14;   // tip forward a touch so the reels read from above
    stageLights.forEach((s, i) => place(s, L.lights[i]));

    if (reduceMotion) render(0);
  }

  function place(obj, spec) {
    obj.root.visible = !!spec;
    if (!spec) return;
    const scale = spec.size / obj.baseSize;
    obj.root.scale.setScalar(scale);
    obj.root.position.set(spec.x - width / 2, height / 2 - spec.y, 0);
    obj.baseY = obj.root.position.y;
    obj.aim = spec.aim || 1;
    obj.tilt = spec.tilt || 0;
  }

  /* ------------------------------------------------------------------------
     Animation: slow rotation + gentle float. Paused when the hero is off-screen.
     ------------------------------------------------------------------------ */
  const M = CONFIG.motion;

  function render(t) {
    // Film camera: slow turntable spin, 3/4 view at t = 0
    filmCamera.spin.rotation.y = -0.6 + t * M.cameraSpin;
    filmCamera.root.position.y = filmCamera.baseY + Math.sin(t * M.floatSpeed + filmCamera.phase) * M.floatAmount;
    filmCamera.model.userData.crank.rotation.z = -t * 2;

    // Stage lights: aimed toward the center, swaying a little
    stageLights.forEach((s) => {
      if (!s.root.visible) return;
      s.spin.rotation.y = s.aim * 0.55 + Math.sin(t * M.lightSway + s.phase) * M.swayAmount;
      s.head.rotation.x = s.tilt + Math.sin(t * M.lightSway * 0.7 + s.phase) * 0.05;
      s.root.position.y = s.baseY + Math.sin(t * M.floatSpeed + s.phase) * M.floatAmount;
    });

    renderer.render(scene, view);
  }

  let rafId = 0;
  let running = false;
  let elapsed = 0;
  let last = 0;

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0); // cap so a paused tab doesn't jump
    last = now;
    elapsed += dt;
    render(elapsed);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  resize();
  render(0); // first frame (and the only one with reduced motion)
  canvas.classList.add('is-ready');

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener('resize', resize);
  // Re-measure once web fonts settle, since the headline size changes
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? start() : stop();
    }).observe(hero);
  } else {
    start();
  }

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  // A tiny studio environment so the metal and silver parts get reflections
  function makeEnvironment() {
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x0b0b0c, side: THREE.BackSide })
    ));
    const panel = (color, strength, pos, w, h) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide })
      );
      m.position.set(pos[0], pos[1], pos[2]);
      m.lookAt(0, 0, 0);
      env.add(m);
    };
    panel(CONFIG.colors.key, 2.2, [-3, 3, 3], 3, 2);   // softbox front-left
    panel(CONFIG.colors.rim, 2.6, [3, 1, -4], 1.5, 4); // strip light behind
    panel(CONFIG.colors.glow, 1.0, [4, -1, 2], 2, 2);  // warm bounce
    const pmrem = new THREE.PMREMGenerator(renderer);
    const tex = pmrem.fromScene(env, 0.04).texture;
    pmrem.dispose();
    return tex;
  }

  // Soft round glow for the Fresnel lenses
  function radialTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.2, 'rgba(255,255,255,0.5)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Fades the light beam out along its length
  function beamAlphaTexture() {
    const c = document.createElement('canvas');
    c.width = 4; c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 128);
    grd.addColorStop(0, '#000');
    grd.addColorStop(1, '#fff');
    g.fillStyle = grd;
    g.fillRect(0, 0, 4, 128);
    return new THREE.CanvasTexture(c);
  }
})();
