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


const loader = new GLTFLoader();
loader.load('./assets/Rocketship.glb', function (gltf) {
  const model = gltf.scene;
  
  scene.add(gltf.scene);
  model.traverse(function(node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  }) 
});



let sol = new THREE.PlaneGeometry(10, 10);
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



const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
let temp = 0.01;
const loop = () => {
  
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  stats.update();
}


loop();
