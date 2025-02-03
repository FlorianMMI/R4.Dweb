import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import Stats from 'three/addons/libs/stats.module.js';

const container = document.querySelector('.container');
const stats = new Stats();
container.appendChild(stats.dom);


const scene = new THREE.Scene();

scene.background = new THREE.CubeTextureLoader()
.setPath('./asset/')
.load([
  'dark-s_px.jpg',
  'dark-s_nx.jpg',
  'dark-s_py.jpg',
  'dark-s_ny.jpg',
  'dark-s_pz.jpg',
  'dark-s_nz.jpg'

])

const gui = new GUI();
gui.add (document, "title");

let time = 0.01;

let obj = {
  soleil: true,
  terre: true,
  lune: true,
  grille: true,
  Vitesse: 0.01,
};

gui.add(obj, "Vitesse", 0, 0.2, 0.001).onChange((value) => {
  time = value;
});

gui.add(obj, "soleil")
gui.add(obj, "terre")
gui.add(obj, "lune")
gui.add(obj, "grille")



let objects = [];

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);



const Spheregeometry = new THREE.SphereGeometry(1, 32, 32);
const Sunmaterial = new THREE.MeshPhongMaterial({
  emissive: 0xFFFF00,
  emissiveMap: new
THREE.TextureLoader().load('./asset/2k_sun.jpg'),
emissiveIntensity: 1,
});

const sunMesh = new THREE.Mesh(Spheregeometry, Sunmaterial);
sunMesh.scale.set(5,5,5)
solarSystem.add(sunMesh);
// objects.push(sunMesh);


const earthColor = "./asset/earthmap1k.jpg";
const earthBump = "./asset/earthbump1k.jpg";
const earthSpec = "./asset/earthspec1k.jpg";
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
   map: textureLoader.load(earthColor),
   bumpMap: textureLoader.load(earthBump),
   specularMap: textureLoader.load(earthSpec),
   bumpScale: 0.25,
   shininess: 1
});

const earthMesh = new THREE.Mesh(Spheregeometry, earthMaterial);

earthOrbit.add(earthMesh);
objects.push(earthMesh);


const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);


const moonColor = "./asset/2k_moon.jpg";
const moonBump = "./asset/2k_moon_bump.jpg";
// const moonSpec = "./asset/2k_moon_spec.jpg";

const moonMaterial = new THREE.MeshPhongMaterial({
  map : textureLoader.load(moonColor),
  bumpMap : textureLoader.load(moonBump),

  bumpScale: 0.25,
  shininess: 1

})
const moonMesh = new THREE.Mesh(Spheregeometry, moonMaterial);
moonMesh.scale.set(0.5,0.5,0.5)
moonOrbit.add(moonMesh);
objects.push(moonMesh);






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
const gridHelper = new THREE.GridHelper(25, 25);
scene.add(gridHelper);
// scene.add(new THREE.SpotLightHelper(light));

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});



const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
// let time = 0.01;
const loop = () => {
  sunMesh.visible = obj.soleil;
  earthMesh.visible = obj.terre;
  moonMesh.visible = obj.lune;
  gridHelper.visible = obj.grille;
  objects.forEach((obj) => {
    obj.rotation.y += time;
  });
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  stats.update();
}


loop();
