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





// let sol = new THREE.PlaneGeometry(100, 100);
// let solMat = new THREE.MeshStandardMaterial({color: 0xd3d3d3});
// let solMesh = new THREE.Mesh(sol, solMat);
// solMesh.receiveShadow = true;
// solMesh.rotateX(-Math.PI / 2); 
// scene.add(solMesh);

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

const degreesToRadians = (degrees) => {
	return degrees * (Math.PI / 180)
}



// const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial({ color: 0xffffff })



class Figure {
	constructor(params) {
		this.params = {
			x: 0,
			y: 0,
			z: 0,
			ry: 0,
			...params
		}
    this.group.position.x = this.params.x
		this.group.position.y = this.params.y
		this.group.position.z = this.params.z
		this.group.rotation.y = this.params.ry

    this.group = new THREE.Group()
		scene.add(this.group)
	}
  createBody() {
		const geometry = new THREE.BoxGeometry(1, 1.5, 1)
		const body = new THREE.Mesh(geometry, material)
		this.group.add(body)
	}

  createHead() {
    // Create a new group for the head
    this.head = new THREE.Group()
    
    // Create the main cube of the head and add to the group
    const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4)
    const headMain = new THREE.Mesh(geometry, material)
    this.head.add(headMain)
    
    // Add the head group to the figure
    this.group.add(this.head)
    
    // Position the head group
    this.head.position.y = 1.65
    
    // Add the eyes by calling the function we already made
    this.createEyes()
  }
  createArms() {
    // Set the variable
    const height = 1
    const geometry = new THREE.BoxGeometry(0.25, height, 0.25)
    
    for(let i = 0; i < 2; i++) {
      const armGroup = new THREE.Group()
      const arm = new THREE.Mesh(geometry, material)
      
      const m = i % 2 === 0 ? 1 : -1
      
      armGroup.add(arm)
      this.group.add(armGroup)
      
      // Translate the arm (not the group) downwards by half the height
      arm.position.y = height * -0.5
      
      armGroup.position.x = m * 0.8
      armGroup.position.y = 0.6
      
      // Helper
      const box = new THREE.BoxHelper(armGroup, 0xffff00)
      armGroup.rotation.z = degreesToRadians(30 * m)
      this.group.add(box)
    }
  }

  createEyes() {
    const eyes = new THREE.Group()
    const geometry = new THREE.SphereGeometry(0.15, 12, 8)
    
    // Define the eye material
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c })
    
    for(let i = 0; i < 2; i++) {
      const eye = new THREE.Mesh(geometry, material)
      const m = i % 2 === 0 ? 1 : -1
      
      // Add the eye to the group
      eyes.add(eye)
      
      // Position the eye
      eye.position.x = 0.36 * m

      this.head.add(eyes)
      eyes.position.z = 0.7
    }
  }

  createLegs() {
    const legs = new THREE.Group()
    const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25)
    
    for(let i = 0; i < 2; i++) {
      const leg = new THREE.Mesh(geometry, material)
      const m = i % 2 === 0 ? 1 : -1
      
      legs.add(leg)
      leg.position.x = m * 0.22
    }
    
    this.group.add(legs)
    legs.position.y = -1.15
    
    this.body.add(legs)
  }

  init() {
    this.createBody()
    this.createHead()
    this.createArms()
    
  }
}

const figure = new Figure()
figure.init()


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

const loop = () => {
  
  
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  stats.update();
}


loop();
