import * as THREE from 'three';

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create geodesic dome geometry (icosahedron with subdivision)
const radius = 2;
const detail = 2; // Medium subdivision level
const geometry = new THREE.IcosahedronGeometry(radius, detail);

// Assign random colors to each face
const colors = [];
const color = new THREE.Color();
const positionAttribute = geometry.attributes.position;
const faceCount = positionAttribute.count / 3;

// Generate a random color for each triangle face
for (let i = 0; i < faceCount; i++) {
    // Random vibrant color
    color.setHSL(Math.random(), 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.2);

    // Apply same color to all three vertices of the triangle
    for (let j = 0; j < 3; j++) {
        colors.push(color.r, color.g, color.b);
    }
}

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Create material with vertex colors and transparency
const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
});

const dome = new THREE.Mesh(geometry, material);
scene.add(dome);

// Add subtle lighting for depth
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Keyboard state tracking
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false
};

// Mouse look variables
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;
let isPointerLocked = false;

// Movement speed
const moveSpeed = 0.1;
const lookSpeed = 0.002;

// Keyboard event listeners
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w') keys.w = true;
    if (key === 'a') keys.a = true;
    if (key === 's') keys.s = true;
    if (key === 'd') keys.d = true;
    if (key === 'shift') keys.shift = true;
    if (key === ' ') keys.space = true;
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w') keys.w = false;
    if (key === 'a') keys.a = false;
    if (key === 's') keys.s = false;
    if (key === 'd') keys.d = false;
    if (key === 'shift') keys.shift = false;
    if (key === ' ') keys.space = false;
});

// Pointer lock for mouse look
document.addEventListener('click', () => {
    document.body.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === document.body;
});

document.addEventListener('mousemove', (e) => {
    if (!isPointerLocked) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    euler.setFromQuaternion(camera.quaternion);
    euler.y -= movementX * lookSpeed;
    euler.x -= movementY * lookSpeed;
    euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
    camera.quaternion.setFromEuler(euler);
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop with camera movement
function animate() {
    requestAnimationFrame(animate);

    // Calculate movement direction based on camera rotation
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(direction);
    right.crossVectors(camera.up, direction).normalize();

    // Move camera based on keyboard input
    if (keys.w) {
        camera.position.addScaledVector(direction, moveSpeed);
    }
    if (keys.s) {
        camera.position.addScaledVector(direction, -moveSpeed);
    }
    if (keys.a) {
        camera.position.addScaledVector(right, moveSpeed);
    }
    if (keys.d) {
        camera.position.addScaledVector(right, -moveSpeed);
    }
    if (keys.space) {
        camera.position.y += moveSpeed;
    }
    if (keys.shift) {
        camera.position.y -= moveSpeed;
    }

    renderer.render(scene, camera);
}

animate();
