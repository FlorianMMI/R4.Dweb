import * as THREE from 'three';2
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Scene
// 1. Racine, va contenir tous les objets de la scène, les lumières, les ou la caméras 
const scene = new THREE.Scene();


// Sphere
// 2. Création d'une sphère avec un rayon de 3, 16 segments de subdivisions
// 3. Affichage du wireframe de la frame de la sphère
//5. Du plus rapide au plus lent dans l'ordre : BasicMaterial, LambertMaterial, PhongMaterial, StandardMaterial, PhysicalMaterial
//  => important quand on a beaucoup d'objets et de lumière à afficher
// => en pratique on dépasse rarement 5 lumières 
const geometry = new THREE.RingGeometry(10, 10, 10, 2, 2, 2);
// const material = new THREE.MeshLambertMaterial({
//    color: 0xff0000,
//    emissive: 0x000000,
//    emissiveIntensity: 1,
//    lights: true
// });
// const material = new THREE.MeshPhongMaterial({
//    color: 0xff0000,
//    specular: 0xffffff,
//    shininess: 200,
//    lights: true
//  });
// const material = new THREE.MeshStandardMaterial({
//    color: 0xff0000,
//    roughness: 0.55,
//    metalness: 0.2,
//    lights: true
//  });
const material = new THREE.MeshPhysicalMaterial({
   color: 0xffffff,
   roughness: 0.5,
   metalness: 0.5,
   reflectivity: 0.5,
   clearCoat: 0.5,
   clearCoatRoughness: 0.5,
   lights: true,
   flatShading : false,
 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(30, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x151515);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// Aide 

scene.add(new THREE.AxesHelper(10));
scene.add(new THREE.GridHelper(10, 15));
scene.add(new THREE.PointLightHelper(light));

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

let angleLight = 0;

const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;

const loop = () => {

  light.position.x = 10 * Math.cos(angleLight);
  light.position.z = 10 * Math.sin(angleLight);
  angleLight += 0.01;
  controls.update();
  renderer.render( scene, camera );
  window.requestAnimationFrame(loop);
  
}

loop();