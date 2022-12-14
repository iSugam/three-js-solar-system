import "./style.css";
import sunTexture from "./assets/textures/sun.jpg";
import mercuryTexture from "./assets/textures/mercury.jpg";
import venusTexture from "./assets/textures/venus.jpg";
import earthTexture from "./assets/textures/earth_day.jpg";
import marsTexture from "./assets/textures/mars.jpg";
import jupiterTexture from "./assets/textures/jupiter.jpg";
import saturnTexture from "./assets/textures/saturn.jpg";
import saturnRingTexture from "./assets/textures/saturn_ring.png";
import uranusTexture from "./assets/textures/uranus.jpg";
import neptuneTexture from "./assets/textures/neptune.jpg";
import starTexture from "./assets/textures/stars.png";

import THREE, { scene } from "./app/Three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import createPlanet from "./app/CreatePlanet";

// Add webgl Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add renderer to the body
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(100, 0, 80) // x, y, and z positions

// Resize the rendering and camera as per window's width and height
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
});

let controls;
if(window.innerWidth < 980) {
    // Add orbit controls for the camera movement on Mobile
    controls = new OrbitControls( camera, renderer.domElement );
    controls.panSpeed = 0.04
    controls.update();
}
    // Add Fly controls for the camera movement on Desktop
    controls = new FlyControls( camera, renderer.domElement );
    let { dragToLook, autoForward, movementSpeed, rollSpeed } = controls;
    dragToLook = true;
    movementSpeed = 1;
    autoForward = false;
    rollSpeed = 5;
    controls.update(0.06);

// Sun
const sunGeo = new THREE.SphereGeometry( 18, 150, 150 );
const sunText = new THREE.TextureLoader().load(sunTexture) // Load Texture image
const sunMaterial = new THREE.MeshBasicMaterial( {map: sunText} );
const sun = new THREE.Mesh( sunGeo, sunMaterial );
sun.position.x = 2
scene.add( sun );

// Create Planets by adding size texture, and the position of the planet
const mercury = createPlanet(0.8, mercuryTexture, 30);
const venus = createPlanet(1, venusTexture, 40);
const earth = createPlanet(1.6, earthTexture, 55);
const mars = createPlanet(1.5, marsTexture, 63);
const jupiter = createPlanet(2.8, jupiterTexture, 73);
const saturn = createPlanet(2.4, saturnTexture, 85, { // For the Saturn Ring
    innerRadius: 2.5,
    outerRadius: 5,
    texture: saturnRingTexture,
});
const saturnRing = saturn.planetObj.children[1];
const uranus = createPlanet(1.4, uranusTexture, 98);
const neptune = createPlanet(1.3, neptuneTexture, 110);

// Point light
const pointLight = new THREE.PointLight( 0xffffff, 3, 300)
scene.add( pointLight );

// STARS Particles
const vertices = [];
for ( let i = 0; i < 10000; i ++ ) {
	const x = THREE.MathUtils.randFloatSpread( 8000 );
	const y = THREE.MathUtils.randFloatSpread( 2000 );
	const z = THREE.MathUtils.randFloatSpread( 2000 );
	vertices.push( x, y, z );
}

// Adding STARS
const StarGeometry = new THREE.BufferGeometry();
StarGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const starMaterial = new THREE.PointsMaterial( { 
    map: new THREE.TextureLoader().load(starTexture), 
    size: 3, 
    transparent: true, 
    depthTest: false
});
const stars = new THREE.Points( StarGeometry, starMaterial );
scene.add( stars );

// Planet Spinning
function meshRotation() {
    mercury.planetMesh.rotateY(0.008);
    venus.planetMesh.rotateY(0.0001);
    earth.planetMesh.rotateY(0.05);
    mars.planetMesh.rotateY(0.05);
    jupiter.planetMesh.rotateY(0.1);
    saturn.planetMesh.rotateY(0.1);
    saturnRing.rotateZ(0.05);
    uranus.planetMesh.rotateY(0.09);
    neptune.planetMesh.rotateY(0.09);
};
// Planet Rotation around the Sun
function planetObjectRotation() {
    mercury.planetObj.rotateY(0.005);
    venus.planetObj.rotateY(0.003);
    earth.planetObj.rotateY(0.001);
    mars.planetObj.rotateY(0.0009);
    jupiter.planetObj.rotateY(0.0004);
    saturn.planetObj.rotateY(0.00035);
    uranus.planetObj.rotateY(0.00025);
    neptune.planetObj.rotateY(0.00018);
};

// Recursive function to keep re-rendering
function animate() {
    requestAnimationFrame(animate);
    
    // Sun spinning
    sun.rotation.y += 0.001;
    
    meshRotation();
    planetObjectRotation();

    controls.update(0.3);
    renderer.render(scene, camera);
}
animate()