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

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop with auto-rotation
function animate() {
    requestAnimationFrame(animate);

    // Auto-rotate the dome
    dome.rotation.y += 0.005;
    dome.rotation.x += 0.002;

    renderer.render(scene, camera);
}

animate();
