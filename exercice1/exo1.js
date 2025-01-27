import * as THREE from 'three';


// Scene
// 1. Racine, va contenir tous les objets de la scène, les lumières, les ou la caméras 
const scene = new THREE.Scene();


// Sphere
// 2. Création d'une sphère avec un rayon de 3, 16 segments de subdivisions
// 3. Affichage du wireframe de la frame de la sphère
const geometry = new THREE.SphereGeometry(4, 32, 32);
// const material = new THREE.MeshLambertMaterial({
//    color: 0xff0000,
//    emissive: 0x000000,
//    emissiveIntensity: 1,
//    lights: true
// });
const material = new THREE.MeshPhongMaterial({
   color: 0xff0000,
   specular: 0xffffff,
   shininess: 200,
   lights: true
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
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(800, 600);
renderer.render(scene, camera);
