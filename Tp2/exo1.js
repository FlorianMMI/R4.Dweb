import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

let objects = [];

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);



const Spheregeometry = new THREE.SphereGeometry(1, 6, 6);
const Sunmaterial = new THREE.MeshPhongMaterial({
  emissive: 0xFFFF00
});

const sunMesh = new THREE.Mesh(Spheregeometry, Sunmaterial);
sunMesh.scale.set(5,5,5)
solarSystem.add(sunMesh);
objects.push(sunMesh);


const eathMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244})
const earthMesh = new THREE.Mesh(Spheregeometry, eathMaterial);

earthMesh.position.x = 10;
solarSystem.add(earthMesh);
objects.push(earthMesh);






const light = new THREE.PointLight(0xffffff, 3);
// light.position.set(10, 10, 10);
scene.add(light);
// 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// scene.add(new THREE.AxesHelper(10));
scene.add(new THREE.GridHelper(10, 15));
// scene.add(new THREE.SpotLightHelper(light));

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
  objects.forEach((obj) => {
    obj.rotation.y += 0.01;
  });
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();
