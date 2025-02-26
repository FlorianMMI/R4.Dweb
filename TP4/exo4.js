import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import Bullet from './Bullet.js'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

// Add FPS counter (Stats)
const stats = new Stats()
document.body.appendChild(stats.dom)

// Sky from assets (assumes the 6 faces textures for a CubeTexture)
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

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Helpers
const center = (group) => {
  new THREE.Box3().setFromObject(group).getCenter(group.position).multiplyScalar(-1)
  scene.add(group)
}

const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min
  if (float) {
    return val
  }
  return Math.floor(val)
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const render = () => {
  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

// Ajout d'OrbitControls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
})

// Material
const material = new THREE.MeshLambertMaterial({ color: 0xffffff })

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5)
scene.add(lightAmbient)

const lightDirectional = new THREE.DirectionalLight(0xffffff, 1.0)
lightDirectional.position.set(50, 100, 10)
lightDirectional.target.position.set(0, 0, 0)
lightDirectional.castShadow = true

lightDirectional.shadow.bias = -0.0001
lightDirectional.shadow.mapSize.width = 2048
lightDirectional.shadow.mapSize.height = 2048
lightDirectional.shadow.camera.near = 10
lightDirectional.shadow.camera.far = 200
lightDirectional.shadow.camera.left = 100
lightDirectional.shadow.camera.right = -100
lightDirectional.shadow.camera.top = 100
lightDirectional.shadow.camera.bottom = -100

scene.add(lightDirectional)
scene.add(new THREE.DirectionalLightHelper(lightDirectional))

// Ground plane with shadows
const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.receiveShadow = true
planeMesh.rotateX(-Math.PI / 2)
planeMesh.position.y = -2.8
scene.add(planeMesh)

// Figure
class Figure {
  constructor(params) {
    this.params = {
      x: 0,
      y: 0,
      z: 0,
      ry: 0,
      armRotation: 0,
      HeadRotation: 0,
      leftEyeScale: 1,
      walkRotation: 0,
      ...params
    }
    
    // Create group and add to scene
    this.group = new THREE.Group()
    scene.add(this.group)
    
    // Position according to params
    this.group.position.x = this.params.x
    this.group.position.y = this.params.y
    this.group.position.z = this.params.z
    
    // Material
    this.headHue = random(0, 360)
    this.bodyHue = random(0, 360)
    this.headLightness = random(40, 65)
    this.headMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)` })
    this.bodyMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.bodyHue}, 85%, 50%)` })
    
    this.arms = []
  }
  
  createBody() {
    this.body = new THREE.Group()
    const geometry = new THREE.BoxGeometry(1, 1, 2.2)
    const bodyMain = new THREE.Mesh(geometry, this.bodyMaterial)
    bodyMain.castShadow = true
    this.body.add(bodyMain)
    this.group.add(this.body)
    
    this.createLegs()
    this.createTail()
  }

  // createBall(){
  //   const geometry = new THREE.SphereGeometry(0.5, 32, 32)
  //   const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  //   const sphere = new THREE.Mesh(geometry, material)
     
  // }
  
  createHead() {
    // Create a new group for the head
    this.head = new THREE.Group()
    
    // Create the main sphere of the head and add to the group
    const geometry = new THREE.BoxGeometry(0.8,1,0.8)
    const headMain = new THREE.Mesh(geometry, this.headMaterial)
    headMain.castShadow = true
    this.head.add(headMain)
    
    // Add the head group to the figure
    this.group.add(this.head)
    
    // Position the head group
    this.head.position.y = 1
    this.head.position.z = 1.2
    
    // Add the eyes
    this.createEyes()

    // Add the antennas
    this.createAntenna()

    // Add the mouse
    this.createMouse()

    this.createTong()

    // Add the nose
    this.createNose()

  }


  createNose() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.1)
    const material = new THREE.MeshLambertMaterial({ color: 0x000000 })
    const nose = new THREE.Mesh(geometry, material)
    nose.position.set(0, -0.05, 0.5)
    this.head.add(nose)
  }
  

  createPupille() {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const Pupille = new THREE.Mesh(geometry, material)
    this.eyes.children.forEach((eye) => {
      const pupil = new THREE.Mesh(geometry, material)
      pupil.position.set(0, 0, 0)
      eye.add(pupil)
    })
    
  }
  
  
  createEyes() {
    const eyes = new THREE.Group()
    this.eyes = eyes
    const geometry = new THREE.BoxGeometry(0.20, 0.20, 0.15)
    const material = new THREE.MeshLambertMaterial({ color: 0xFFFFFFFF })
    
    for(let i = 0; i < 2; i++) {
      const eye = new THREE.Mesh(geometry, material)
      eye.castShadow = true
      const m = i % 2 === 0 ? 1 : -1
      eyes.add(eye)
      eye.position.x = 0.20 * m
      if (m == 1){
        this.leftEye = eye
      }
    }
    
    this.head.add(eyes)
    eyes.position.y = 0.2
    eyes.position.z = 0.4
    this.createPupille()
    
  }

  
  
  createLegs() {
    const legs = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.25, 1.6, 0.25);

    this.legs = [];

    const positions = [
      { x: 0.22, z: 0.6 },   // front right
      { x: -0.22, z: 0.6 },  // front left
      { x: 0.22, z: -0.6 },  // back right
      { x: -0.22, z: -0.6 }  // back left
    ];

    positions.forEach(pos => {
      const leg = new THREE.Mesh(geometry, this.headMaterial);
      leg.castShadow = true;
      leg.position.x = pos.x;
      leg.position.z = pos.z;
      legs.add(leg);
      this.legs.push(leg);
    });

    legs.position.y = -1.15;
    this.body.add(legs);
  }

  

  createAntenna() {
    const antennas = new THREE.Group()
    const geometry = new THREE.BoxGeometry(0.2, 0.05, 0.5)
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c })

    for (let i = 0; i < 2; i++) {
      const antenna = new THREE.Mesh(geometry, material)
      antenna.castShadow = true
      const m = i % 2 === 0 ? 1 : -1
      antenna.position.x = m * 0.15
      antenna.position.x += m * 0.1
      antenna.rotation.x = 90
      antennas.add(antenna)
    }

    antennas.position.y = 0.7 
    antennas.position.z = 0.2
    this.head.add(antennas)
  }

  createMouse() {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.1)
    const material = new THREE.MeshLambertMaterial({ color: 0xFFFFFFFF })
    const upperMouse = new THREE.Mesh(geometry, material)
    upperMouse.position.set(0, -0.5, 0.4)
    this.head.add(upperMouse)
  }

  createTong(){
    const geometry = new THREE.BoxGeometry(0.2, 0.4, 0.1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const nose = new THREE.Mesh(geometry, material)
    nose.position.set(0, -0.45, 0.41)

    this.head.add(nose)
  }

  createTail() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 1.5  )
    const material = new THREE.MeshLambertMaterial(this.bodyMaterial)
    const tail = new THREE.Mesh(geometry, material)
    tail.position.y = 0.4
    tail.position.z = -1.2
    tail.rotation.x = 35
    this.body.add(tail)
  }

  update() {
    this.group.rotation.y = this.params.ry;
    this.group.position.y = this.params.y;
    this.group.position.x = this.params.x;
    this.group.position.z = this.params.z;
    
    
    this.arms.forEach((arm, index) => {
      const m = index % 2 === 0 ? 1 : -1
      arm.rotation.z = this.params.armRotation * m
      arm.rotation.x = this.params.walkRotation * m
    })

    this.legs.forEach((leg, index) => {
      const m = index % 2 === 0 ? 1 : -1
      leg.rotation.x = this.params.walkRotation * m
    })

    // rotation de la tête 
    this.head.rotation.z = this.params.HeadRotation
    this.leftEye.scale.set(
      this.params.leftEyeScale,
      this.params.leftEyeScale,
      this.params.leftEyeScale
    )
  }
  
  init() {
    this.createBody()
    this.createHead()
    
  }
}

const figure = new Figure()
figure.init()

// Timeline pour le saut 

let rySpeed = 0;



let walkSpeed = 0;


let walkTl = gsap.timeline();
walkTl.to(figure.params, {
  walkRotation: degreesToRadians(45),
  repeat: 1,
  yoyo: true,
  duration: 0.25,

})

walkTl.to(figure.params, {
  walkRotation: degreesToRadians(-45),
  repeat: 1,
  yoyo: true,
  duration: 0.25,}, ">");
walkTl.pause()


document.addEventListener('keydown', (event) => {
  if (event.key == 'ArrowUp') {
    walkSpeed += 0.1
  }
  if (event.key == 'ArrowDown') {
    walkSpeed -= 0.1
  }
  if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
    if (!walkTl.isActive()) {
      walkTl.restart()
    } 
  }
});

let jumpTl = gsap.timeline()
document.addEventListener('keydown', (event) => {


  if ((event.key == ' ') && (!jumpTl.isActive())) {
   
    jumpTl.to(figure.params, {
      y: 3,
      armRotation: degreesToRadians(90),
      repeat: 1,
      yoyo: true,
      duration: 0.5,
      ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.459,0.372 0.617,0.52 0.809,0.7 0.818,1.001 1,1 "),
    });
  }

  if (event.key == 'ArrowRight') {
   
    rySpeed -= 0.15
  } else if (event.key == 'ArrowLeft') {
   
    rySpeed += 0.15
  }

  

  
});

let bullet = new Bullet();

document.addEventListener('keydown', (event) => {
  if (event.key === 'a') {
    // Fire a bullet from the robot's current position with its current rotation
    bullet.fire(figure);
  }
});




// let idelTl = gsap.timeline()
// idelTl.to(figure.params, {
//   HeadRotation: Math.PI / 3,
//   repeat: -1,
//   yoyo: true,
//   duration: 0.6,
//   ease : "back.out"
// })
// idelTl.to(figure.params, {
//   leftEyeScale: 0.5,
//   repeat: -1,
//   yoyo: true,
//   duration: 0.6,
//   ease : "elsatic.in"
  
// })

gsap.set(figure.params, {
  y: -1.5
})





// GSAP ticker update (include FPS counter update)
gsap.ticker.add(() => {

  
  
  figure.params.ry += rySpeed;
  rySpeed *= 0.93;

  walkSpeed *= 0.97;
  figure.params.x += walkSpeed * Math.sin(figure.params.ry);
  figure.params.z += walkSpeed * Math.cos(figure.params.ry);

  // if (!jumpTl.isActive() && !idelTl.isActive()) {
  //   idelTl.restart()
  // }
  figure.update()
  controls.update()
  bullet.update()
  render()
  stats.update()

})
