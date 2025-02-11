import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const container = document.querySelector('.container');
const stats = new Stats();
container.appendChild(stats.dom);


const scene = new THREE.Scene();

scene.background = new THREE.CubeTextureLoader()
.setPath('./assets/')
.load([
  'posx.jpg',
  'negx.jpg',
  'posy.jpg',
  'negy.jpg',
  'posz.jpg',
  'negz.jpg'

])

const gui = new GUI();
// gui.add (document, "title");


// Groupe Principal
let mainGroup = new THREE.Object3D();
mainGroup.position.y = 30;
scene.add(mainGroup);

// Barre horizontal
let cyl = new THREE.CylinderGeometry(1, 1, 1, 100, 100);
let cylMat = new THREE.MeshPhongMaterial({ color: 0x808080});
let cylMesh = new THREE.Mesh(cyl, cylMat);
cylMesh.castShadow = true;
cylMesh.receiveShadow = true;
cylMesh.scale.set(3, 100, 3);
cylMesh.rotateZ(Math.PI / 2);
mainGroup.add(cylMesh);

let sphGeomety = new THREE.SphereGeometry(5, 32, 32);
// Toutes les pendules 
let sensRotation = [];
let groups = [];

let hauteur = 10
let vitesse = 2;
for (let x = -40; x <= 40; x += 10) {

  let group0 = new THREE.Object3D();
  let cVertical = new THREE.Mesh(cyl, cylMat);
  cVertical.scale.set(0.5, hauteur, 0.5);
  cVertical.position.y = -hauteur/2;
  cVertical.castShadow = true;
  group0.add(cVertical);
  let sph = new THREE.Mesh(sphGeomety, cylMat);
  sph.position.y = -hauteur;
  sph.castShadow = true;
  group0.add(sph);
  group0.rotation.x = Math.PI / 3;
  group0.position.x = x;
  mainGroup.add(group0);
  groups.push(group0);
  sensRotation.push(vitesse);
  hauteur += 1;
  vitesse *= 0.89;
}





// mainGroup.add(groupe0);

let sol = new THREE.PlaneGeometry(1000, 1000);
let solMat = new THREE.MeshStandardMaterial({color: 0xd3d3d3});
let solMesh = new THREE.Mesh(sol, solMat);
solMesh.receiveShadow = true;
solMesh.rotateX(-Math.PI / 2); 
scene.add(solMesh);

// On ne voit pas en dessous car la lumière arrive du haut


let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light));

light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 10;
light.shadow.camera.far = 200;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;


const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 50, 0);

scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas,  });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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


let go = false;

const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;

const loop = () => {
  
  if (go){
    for (let i = 0; i < groups.length; i++) {
      groups[i].rotation.x += sensRotation[i] * 0.02;
      if (groups[i].rotation.x > Math.PI / 3) {
        sensRotation[i] *= -1;
      }
      if (groups[i].rotation.x < -Math.PI / 3) {
        sensRotation[i] *= -1;
      }
    }
  }
  
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  stats.update();
}


loop();



window.addEventListener('keydown', (event) => {
  go= true;

});