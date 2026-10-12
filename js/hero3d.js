// Bosh sahifadagi hajmli "PANDA" harflari (Three.js)
import * as THREE from 'three';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.querySelector('[data-hero-stage]');
const canvas = stage?.querySelector('canvas');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (stage && canvas) init().catch(fail);

function fail(err) {
  console.warn('3D yuklanmadi, oddiy matn ko‘rsatiladi:', err);
  stage.classList.add('is-fallback');
}

async function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-2.5, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 14;
  key.shadow.blurSamples = 20;
  key.shadow.bias = -0.0004;
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 4, bottom: -2, near: 0.5, far: 20 });
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0x777777, 0.3));

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ opacity: 0.16 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const json = await new TTFLoader().loadAsync('assets/fonts/AbrilFatface-Regular.ttf');
  const font = new Font(json);

  // Qora lak: chuqur qora, ustida yumshoq yaltiroq
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.55,
  });

  const word = 'PANDA';
  const size = 1;
  const tracking = 0.06;
  const scale = size / json.resolution;
  const group = new THREE.Group();
  scene.add(group);

  const letters = [];
  let cursor = 0;
  for (const ch of word) {
    const geo = new TextGeometry(ch, {
      font,
      size,
      height: 0.32,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.01,
      bevelSegments: 3,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const w = bb.max.x - bb.min.x;
    // Har bir harf o'z markazi atrofida aylanishi uchun
    geo.translate(-(bb.min.x + w / 2), 0, -0.16);
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    const advance = json.glyphs[ch].ha * scale;
    mesh.userData.x = cursor + advance / 2;
    cursor += advance + tracking;
    letters.push(mesh);
    group.add(mesh);
  }
  const totalWidth = cursor - tracking;
  letters.forEach((m, i) => {
    m.userData.x -= totalWidth / 2;
    m.position.x = m.userData.x;
    m.userData.delay = i * 0.11;
  });

  const target = new THREE.Vector3(0, 0.5, 0);
  function resize() {
    const { clientWidth: w, clientHeight: h } = stage;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // So'z ekran kengligining ~86% ini egallasin
    const fit = w < 700 ? 1.04 : 1.16;
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const dist = (totalWidth * fit) / 2 / Math.tan(hfov / 2);
    camera.position.set(0, 0.5 + dist * 0.16, dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // Arka harflar ortida, xuddi shu polda tursin
    const p = new THREE.Vector3(0, 0, -0.2).project(camera);
    stage.style.setProperty('--baseline', `${((1 - p.y) / 2) * h}px`);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // Sichqoncha
  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(stage);

  stage.classList.add('is-ready');
  const start = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);

  renderer.setAnimationLoop((now) => {
    if (!visible) return;
    const t = (now - start) / 1000;

    letters.forEach((m) => {
      // Kirish: harflar yuqoridan tushib, aylanib joyiga o'tiradi
      const k = reduceMotion ? 1 : easeOut(THREE.MathUtils.clamp((t - 0.2 - m.userData.delay) / 1.4, 0, 1));
      m.position.y = (1 - k) * 2.6;
      m.rotation.x = (1 - k) * -1.1;
      m.rotation.y = (1 - k) * 0.9;
      m.visible = k > 0;
    });

    if (!reduceMotion) {
      smooth.x += (pointer.x - smooth.x) * 0.05;
      smooth.y += (pointer.y - smooth.y) * 0.05;
      group.rotation.y = smooth.x * 0.22;
      group.rotation.x = smooth.y * 0.04;
      key.position.x = -2.5 + smooth.x * 2;
    }

    renderer.render(scene, camera);
  });
}
