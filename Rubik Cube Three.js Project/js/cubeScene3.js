// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
let isRotating = false;

// Create a 2x2 Rubik's Cube
const cubeSize = 1;
const miniCubeSize = cubeSize / 2;
const miniCubes = [];

// Colors for each face of a mini-cube
const faceColors = [
    0xff0000, // right - red
    0x00ff00, // left - green
    0x0000ff, // top - blue
    0xffff00, // bottom - yellow
    0xff00ff, // front - magenta
    0x00ffff  // back - cyan
];

// Function to create a mini-cube with black edges
function createMiniCube(x, y, z, colors) {
    const geometry = new THREE.BoxGeometry(miniCubeSize, miniCubeSize, miniCubeSize);
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

    // Materials for each face of the cube
    const materials = [
        new THREE.MeshBasicMaterial({ color: colors[0] }), // Right face
        new THREE.MeshBasicMaterial({ color: colors[1] }), // Left face
        new THREE.MeshBasicMaterial({ color: colors[2] }), // Top face
        new THREE.MeshBasicMaterial({ color: colors[3] }), // Bottom face
        new THREE.MeshBasicMaterial({ color: colors[4] }), // Front face
        new THREE.MeshBasicMaterial({ color: colors[5] })  // Back face
    ];
    
    const miniCube = new THREE.Mesh(geometry, materials);
    miniCube.position.set(x * miniCubeSize, y * miniCubeSize, z * miniCubeSize);
    miniCube.add(edges); // Add edges to the mini-cube
    miniCubes.push(miniCube);
}

// Create mini-cubes for the 2x2 Rubik's Cube
createMiniCube(-0.5, -0.5, -0.5, faceColors);
createMiniCube(0.5, -0.5, -0.5, faceColors);
createMiniCube(-0.5, 0.5, -0.5, faceColors);
createMiniCube(0.5, 0.5, -0.5, faceColors);
createMiniCube(-0.5, -0.5, 0.5, faceColors);
createMiniCube(0.5, -0.5, 0.5, faceColors);
createMiniCube(-0.5, 0.5, 0.5, faceColors);
createMiniCube(0.5, 0.5, 0.5, faceColors);

// Create groups for each face
const frontGroup = new THREE.Group();
const backGroup = new THREE.Group();
const leftGroup = new THREE.Group();
const rightGroup = new THREE.Group();
const topGroup = new THREE.Group();
const bottomGroup = new THREE.Group();

// Function to update groups based on mini-cube positions
function updateGroups(groupsToUpdate) {
    groupsToUpdate.forEach(group => group.clear());

    miniCubes.forEach(cube => {
        if (cube.position.z > 0 && groupsToUpdate.includes(frontGroup)) {
            frontGroup.add(cube);
        }
        if (cube.position.z < 0 && groupsToUpdate.includes(backGroup)) {
            backGroup.add(cube);
        }
        if (cube.position.x < 0 && groupsToUpdate.includes(leftGroup)) {
            leftGroup.add(cube);
        }
        if (cube.position.x > 0 && groupsToUpdate.includes(rightGroup)) {
            rightGroup.add(cube);
        }
        if (cube.position.y > 0 && groupsToUpdate.includes(topGroup)) {
            topGroup.add(cube);
        }
        if (cube.position.y < 0 && groupsToUpdate.includes(bottomGroup)) {
            bottomGroup.add(cube);
        }
    });

    console.log(`Front group has ${frontGroup.children.length} mini-cubes`);
    console.log(`Back group has ${backGroup.children.length} mini-cubes`);
    console.log(`Left group has ${leftGroup.children.length} mini-cubes`);
    console.log(`Right group has ${rightGroup.children.length} mini-cubes`);
    console.log(`Top group has ${topGroup.children.length} mini-cubes`);
    console.log(`Bottom group has ${bottomGroup.children.length} mini-cubes`);
}

// Function to rotate a group and update mini-cube positions
function rotateGroup(group, axis, angle, groupsToUpdate) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);
    group.children.forEach(cube => {
        cube.applyQuaternion(quaternion);
        cube.position.applyQuaternion(quaternion);
    });

    updateGroups(groupsToUpdate);

    // Asigură-te că resetarea lui isRotating este făcută după ce toate operațiunile sunt completate
    setTimeout(() => {
        isRotating = false;
        checkIfCompleted(); // Verifică dacă cubul este completat după ce rotația este finalizată
    }, 100); // Ajustează timpul dacă este necesar
}

// Rotation functions for each face

// Adaugă verificarea dacă cubul este completat pentru a opri timer-ul
function checkIfCompleted() {
    if (isCubeCompleted()) {
        stopTimer();
        console.log("Cubul este completat!");
    }
}

function isCubeCompleted() {
    for (let i = 0; i < miniCubes.length; i++) {
        const currentCube = miniCubes[i];
        const initialCube = initialCubeState[i];

        if (!currentCube.position.equals(initialCube.position) || 
            !currentCube.rotation.equals(initialCube.rotation)) {
            return false;
        }
    }
    return true;
}

function rotateFrontFace(clockwise = true) {
    if (!isTimerRunning) startTimer();
    if (isRotating) return;
    isRotating = true;
    console.log(`rotateFrontFace called, clockwise: ${clockwise}`);
    rotateGroup(frontGroup, new THREE.Vector3(0, 0, 1), clockwise ? Math.PI / 2 : -Math.PI / 2, [frontGroup, backGroup]);
}

function rotateBackFace(clockwise = true) {
    if (!isTimerRunning) startTimer();
    if (isRotating) return;
    isRotating = true;
    console.log(`rotateBackFace called, clockwise: ${clockwise}`);
    rotateGroup(backGroup, new THREE.Vector3(0, 0, 1), clockwise ? -Math.PI / 2 : Math.PI / 2, [frontGroup, backGroup]);
}

function rotateLeftFace(clockwise = true) {
    if (!isTimerRunning) startTimer();
    if (isRotating) return;
    isRotating = true;
    console.log(`rotateLeftFace called, clockwise: ${clockwise}`);
    rotateGroup(leftGroup, new THREE.Vector3(1, 0, 0), clockwise ? Math.PI / 2 : -Math.PI / 2, [leftGroup, rightGroup]);
}

function rotateRightFace(clockwise = true) {
    if (!isTimerRunning) startTimer();
    if (isRotating) return;
    isRotating = true;
    console.log(`rotateRightFace called, clockwise: ${clockwise}`);
    rotateGroup(rightGroup, new THREE.Vector3(1, 0, 0), clockwise ? -Math.PI / 2 : Math.PI / 2, [leftGroup, rightGroup]);
}

function rotateTopFace(clockwise = true) {
    if (!isTimerRunning) startTimer();
    if (isRotating) return;
    isRotating = true;
    console.log(`rotateTopFace called, clockwise: ${clockwise}`);
    rotateGroup(topGroup, new THREE.Vector3(0, 1, 0), clockwise ? Math.PI / 2 : -Math.PI / 2, [topGroup, bottomGroup]);
}

function rotateBottomFace(clockwise = true) {
    if (!isTimerRunning) startTimer();
    if (isRotating) return;
    isRotating = true;
    console.log(`rotateBottomFace called, clockwise: ${clockwise}`);
    rotateGroup(bottomGroup, new THREE.Vector3(0, 1, 0), clockwise ? -Math.PI / 2 : Math.PI / 2, [topGroup, bottomGroup]);
}

// Add dat.GUI controls
const gui = new dat.GUI();
const guiControls = {
    'Rotate Front Prime': () => rotateFrontFace(true),
    'Rotate Front': () => rotateFrontFace(false),
    'Rotate Back Prime': () => rotateBackFace(true),
    'Rotate Back': () => rotateBackFace(false),
    'Rotate Left Prime': () => rotateLeftFace(true),
    'Rotate Left': () => rotateLeftFace(false),
    'Rotate Right Prime': () => rotateRightFace(true),
    'Rotate Right': () => rotateRightFace(false),
    'Rotate Top Prime': () => rotateTopFace(true),
    'Rotate Top': () => rotateTopFace(false),
    'Rotate Bottom Prime': () => rotateBottomFace(true),
    'Rotate Bottom': () => rotateBottomFace(false),
    'Scramble': () => scrambleCube()
};

// Adăugarea controalelor în GUI
Object.keys(guiControls).forEach(control => {
    gui.add(guiControls, control);
});

// Initial update of groups
updateGroups([frontGroup, backGroup, leftGroup, rightGroup, topGroup, bottomGroup]);

// Add groups to the scene
scene.add(frontGroup);
scene.add(backGroup);
scene.add(leftGroup);
scene.add(rightGroup);
scene.add(topGroup);
scene.add(bottomGroup);


// Set camera position and orientation
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Crearea particulelor
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 100; // Numărul de particule
const positions = new Float32Array(particlesCount * 3); // fiecare particula are 3 valori (x, y, z)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.01,
    transparent: true,
    opacity: 0.6
});

const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);
particleSystem.visible = false; // Inițial particulele sunt invizibile

// Timer variables
let timerInterval;
let startTime;
let elapsedTime = 0;
let isTimerRunning = false;

function startTimer() {
    if (!isTimerRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            document.getElementById('timer').innerText = timeToString(elapsedTime);
        }, 1000);
        isTimerRunning = true;
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let formattedHH = hh.toString().padStart(2, '0');
    let formattedMM = mm.toString().padStart(2, '0');
    let formattedSS = ss.toString().padStart(2, '0');

    return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

// Salvarea formei inițiale a cubului
const initialCubeState = miniCubes.map(cube => ({
    position: cube.position.clone(),
    rotation: cube.rotation.clone()
}));

// Render loop to update and render scene
function animate() {
    renderer.render(scene, camera);
    orbitControls.update(); // Update controls
    requestAnimationFrame(animate);
}

// Start animation loop
animate();

// Adăugarea unui event listener pentru keybind-uri
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'R':
        case 'r':
            rotateRightFace(true);
            break;
        case 'L':
        case 'l':
            rotateLeftFace(true);
            break;
        case 'F':
        case 'f':
            rotateFrontFace(true);
            break;
        case 'B':
        case 'b':
            rotateBackFace(true);
            break;
        case 'T':
        case 't':
            rotateTopFace(true);
            break;
        case 'D':
        case 'd':
            rotateBottomFace(true);
            break;
        // Adaugă aici alte keybind-uri pentru rotații în sens invers, dacă este necesar
    }
});

function scrambleCube() {
    const moves = [
        () => rotateFrontFace(true),
        () => rotateFrontFace(false),
        () => rotateBackFace(true),
        () => rotateBackFace(false),
        () => rotateLeftFace(true),
        () => rotateLeftFace(false),
        () => rotateRightFace(true),
        () => rotateRightFace(false),
        () => rotateTopFace(true),
        () => rotateTopFace(false),
        () => rotateBottomFace(true),
        () => rotateBottomFace(false)
    ];

    let moveCount = 0;
    const intervalId = setInterval(() => {
        if (moveCount >= 10) {
            clearInterval(intervalId);
            return;
        }
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        randomMove();
        setTimeout(randomMove, 300); // Efectuează mișcarea a doua oară după 300ms
        moveCount++;
    }, 600); // Ajustează intervalul de timp dacă este necesar
}