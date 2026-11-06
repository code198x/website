/** Loaded only after a visitor chooses 3D. One active, on-demand renderer per page. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

let active: { figure: HTMLElement; dispose: () => void } | undefined;

export function closeModelViewer(figure?: HTMLElement) {
  if (!figure || active?.figure === figure) active?.dispose();
}

function disposeScene(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
    }
  });
  geometries.forEach(value => value.dispose());
  materials.forEach(value => value.dispose());
  textures.forEach(value => value.dispose());
}

export async function openModelViewer(figure: HTMLElement): Promise<void> {
  if (active?.figure === figure) return;
  closeModelViewer();
  const stage = figure.querySelector<HTMLElement>('[data-model-stage]')!;
  const host = figure.querySelector<HTMLElement>('[data-model-canvas-host]')!;
  const poster = figure.querySelector<HTMLElement>('[data-model-enlarge]')!;
  const controlsPanel = figure.querySelector<HTMLElement>('[data-model-3d-controls]')!;
  const trigger = figure.querySelector<HTMLButtonElement>('[data-model-3d]')!;
  const label = trigger.querySelector<HTMLElement>('[data-model-3d-label]')!;
  const feedback = figure.querySelector<HTMLElement>('[data-model-feedback]')!;
  const controller = new AbortController();
  let renderer: THREE.WebGLRenderer | undefined;
  let orbit: OrbitControls | undefined;
  let observer: ResizeObserver | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;
  let scene: THREE.Scene | undefined;
  let frame = 0;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    cancelAnimationFrame(frame);
    observer?.disconnect();
    orbit?.dispose();
    if (scene) disposeScene(scene);
    environment?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    host.replaceChildren();
    host.hidden = controlsPanel.hidden = true;
    poster.hidden = false;
    trigger.disabled = false;
    trigger.setAttribute('aria-pressed', 'false');
    trigger.setAttribute('aria-expanded', 'false');
    label.textContent = 'Explore in 3D';
    feedback.hidden = true; feedback.textContent = '';
    figure.removeAttribute('aria-busy');
    delete figure.dataset.modelMode;
    figure.querySelectorAll<HTMLButtonElement>('[data-model-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.modelView === (figure.dataset.selectedView ?? '0'))));
    if (active?.figure === figure) active = undefined;
  };
  active = { figure, dispose };
  trigger.disabled = true;
  label.textContent = 'Loading 3D…';
  feedback.hidden = false;
  feedback.textContent = 'Loading the interactive model…';
  figure.setAttribute('aria-busy', 'true');
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = .95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Interactive ${figure.dataset.name}. Drag to turn, or use the arrow keys. Plus and minus zoom; Home resets the view.`);
    const response = await fetch(figure.dataset.modelUrl!, { signal: controller.signal });
    if (!response.ok) throw new Error(`Model download failed (${response.status})`);
    const bytes = await response.arrayBuffer();
    if (disposed) return;
    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes, '');
    if (disposed) { disposeScene(gltf.scene); return; }
    scene = new THREE.Scene();
    scene.background = new THREE.Color(getComputedStyle(stage).backgroundColor);
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const centre = bounds.getCenter(new THREE.Vector3());
    model.position.sub(new THREE.Vector3(centre.x, bounds.min.y, centre.z));
    model.updateMatrixWorld(true);
    bounds.setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const span = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(span) || span < .05 || span > 1) throw new Error('Unexpected model scale');
    model.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      const printed = materials.every(material => /print|ink|letter|legend|rainbow|plate_|model_name|rear_label/i.test(material.name));
      // Thin printed artwork sits against its backing surface. Keep it ahead
      // in the depth buffer, including after web-position quantisation.
      if (printed) materials.forEach(material => {
        material.polygonOffset = true;
        material.polygonOffsetFactor = -1;
        material.polygonOffsetUnits = -1;
      });
      object.castShadow = object.receiveShadow = !printed;
    });
    scene.add(model);
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    scene.environmentIntensity = .3;
    disposeScene(room); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xfffbef, 0x79828a, .65));
    const key = new THREE.DirectionalLight(0xfffbf4, 2);
    key.position.set(span * 2, span * 4, span * 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -span;
    key.shadow.camera.right = key.shadow.camera.top = span;
    key.shadow.camera.near = .01;
    key.shadow.camera.far = span * 12;
    key.shadow.bias = -.0001;
    key.shadow.normalBias = span * .003;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe4edff, .6);
    fill.position.set(-span * 3, span * 2, -span * 2); scene.add(fill);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(span * 8, span * 8), new THREE.ShadowMaterial({ opacity: .18 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -.0005; ground.receiveShadow = true; scene.add(ground);
    const camera = new THREE.PerspectiveCamera(35, 1, span / 1000, span * 30);
    orbit = new OrbitControls(camera, canvas);
    orbit.enableDamping = false;
    orbit.enablePan = false;
    orbit.minDistance = span * .4;
    orbit.maxDistance = span * 8;
    orbit.minPolarAngle = .04;
    orbit.maxPolarAngle = Math.PI - .04;
    const target = bounds.getCenter(new THREE.Vector3());
    orbit.target.copy(target);
    const render = () => {
      if (disposed || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!disposed && renderer && scene) {
          renderer.render(scene, camera);
          canvas.dataset.rendered = 'true';
        }
      });
    };
    const home = () => {
      camera.position.copy(target).add(new THREE.Vector3(1, .9, 1.4).normalize().multiplyScalar(span * 2));
      camera.lookAt(target);
      for (let iteration = 0; iteration < 3; iteration++) {
        camera.updateMatrixWorld();
        const corners = [0, 1, 2, 3, 4, 5, 6, 7].map(i => new THREE.Vector3(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z).project(camera));
        const width = Math.max(...corners.map(p => p.x)) - Math.min(...corners.map(p => p.x));
        const height = Math.max(...corners.map(p => p.y)) - Math.min(...corners.map(p => p.y));
        camera.position.sub(target).multiplyScalar(Math.max(width, height) / 1.65).add(target);
      }
      orbit!.update(); render();
    };
    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (!width || !height) return;
      renderer!.setSize(width, height, false);
      camera.aspect = width / height; camera.updateProjectionMatrix(); render();
    };
    const turn = (horizontal: number, vertical = 0) => {
      const sphere = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target));
      sphere.theta += horizontal;
      sphere.phi = THREE.MathUtils.clamp(sphere.phi + vertical, .04, Math.PI - .04);
      camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(sphere));
      orbit!.update(); render();
    };
    const zoom = (factor: number) => {
      const offset = camera.position.clone().sub(target);
      offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, span * .4, span * 8));
      camera.position.copy(target).add(offset); orbit!.update(); render();
    };
    const actions: Record<string, () => void> = {
      left: () => turn(-Math.PI / 8), right: () => turn(Math.PI / 8),
      in: () => zoom(.8), out: () => zoom(1.25), reset: home, images: dispose,
    };
    figure.querySelectorAll<HTMLButtonElement>('[data-model-action]').forEach(button => button.addEventListener('click', () => actions[button.dataset.modelAction!]?.(), { signal: controller.signal }));
    canvas.addEventListener('keydown', event => {
      const action: Record<string, () => void> = { ArrowLeft: () => turn(-Math.PI / 12), ArrowRight: () => turn(Math.PI / 12), ArrowUp: () => turn(0, -Math.PI / 12), ArrowDown: () => turn(0, Math.PI / 12), '+': () => zoom(.8), '=': () => zoom(.8), '-': () => zoom(1.25), Home: home };
      if (action[event.key]) { event.preventDefault(); action[event.key](); }
    }, { signal: controller.signal });
    canvas.addEventListener('webglcontextlost', event => {
      if (disposed) return;
      event.preventDefault(); dispose();
      feedback.hidden = false;
      feedback.textContent = 'The 3D view was closed by your browser. You can keep browsing the images or try again.';
    }, { signal: controller.signal });
    orbit.addEventListener('change', render);
    host.replaceChildren(canvas); host.hidden = false; poster.hidden = true;
    controlsPanel.hidden = false;
    figure.dataset.modelMode = '3d';
    figure.querySelectorAll('[data-model-view]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    trigger.disabled = false;
    trigger.setAttribute('aria-pressed', 'true'); trigger.setAttribute('aria-expanded', 'true');
    label.textContent = '3D view';
    figure.removeAttribute('aria-busy');
    feedback.textContent = 'Drag to turn. Pinch or scroll to zoom. Keyboard: arrows to turn, + and − to zoom, Home to reset.';
    observer = new ResizeObserver(resize); observer.observe(stage);
    resize(); home(); render();
    canvas.focus({ preventScroll: true });
  } catch (error) {
    if (disposed) return;
    dispose();
    feedback.hidden = false;
    feedback.textContent = 'The 3D view could not load. The images are still available; you can try 3D again.';
    label.textContent = 'Try 3D again';
    console.warn('Model viewer unavailable:', error instanceof Error ? error.message : error);
  }
}

document.addEventListener('astro:before-swap', () => closeModelViewer());
