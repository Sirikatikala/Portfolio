/**
 * Three.js 3D Background - Dynamic Particle Constellation & Floating Wireframe Geometries
 * For K. Siva Naga Kumari's Portfolio
 */

(function initThreeBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 85;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Mouse tracking & Parallax target
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || window.pageYOffset;
  });

  // ==================== PARTICLE SYSTEM ====================
  const particleCount = 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Color palette: Cyan (#06ffa5) to Purple (#8b5cf6)
  const colorCyan = new THREE.Color(0x06ffa5);
  const colorPurple = new THREE.Color(0x8b5cf6);
  const colorIndigo = new THREE.Color(0x6366f1);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Spread in 3D volume
    positions[i3]     = (Math.random() - 0.5) * 180;
    positions[i3 + 1] = (Math.random() - 0.5) * 180;
    positions[i3 + 2] = (Math.random() - 0.5) * 160;

    // Mix colors randomly
    const mixFactor = Math.random();
    let mixedColor = colorCyan.clone().lerp(colorPurple, mixFactor);
    if (Math.random() > 0.8) mixedColor.lerp(colorIndigo, 0.5);

    colors[i3]     = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Material
  const particleMaterial = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // ==================== CONNECTED PLEXUS CONSTELLATION ====================
  const plexusCount = 90;
  const plexusGeometry = new THREE.BufferGeometry();
  const plexusPositions = [];
  const plexusCoords = [];

  for (let i = 0; i < plexusCount; i++) {
    const x = (Math.random() - 0.5) * 90;
    const y = (Math.random() - 0.5) * 70;
    const z = (Math.random() - 0.5) * 50;
    plexusCoords.push({
      x, y, z,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      vz: (Math.random() - 0.5) * 0.04
    });
  }

  const plexusLinesMaterial = new THREE.LineBasicMaterial({
    color: 0x06ffa5,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending
  });

  const plexusLinesMesh = new THREE.LineSegments(plexusGeometry, plexusLinesMaterial);
  scene.add(plexusLinesMesh);

  // ==================== FLOATING 3D WIREFRAME GEOMETRIES ====================
  // 1. Torus Knot (Neon Purple Wireframe)
  const torusKnotGeo = new THREE.TorusKnotGeometry(12, 3.2, 100, 16);
  const torusKnotMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending
  });
  const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
  torusKnot.position.set(45, 15, -20);
  scene.add(torusKnot);

  // 2. Icosahedron (Neon Cyan Wireframe)
  const icosahedronGeo = new THREE.IcosahedronGeometry(9, 1);
  const icosahedronMat = new THREE.MeshBasicMaterial({
    color: 0x06ffa5,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
  });
  const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
  icosahedron.position.set(-45, -15, -15);
  scene.add(icosahedron);

  // 3. Octahedron (Electric Indigo)
  const octahedronGeo = new THREE.OctahedronGeometry(7, 0);
  const octahedronMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  const octahedron = new THREE.Mesh(octahedronGeo, octahedronMat);
  octahedron.position.set(30, -35, -10);
  scene.add(octahedron);

  // ==================== RESIZE HANDLER ====================
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onWindowResize);

  // ==================== ANIMATION LOOP ====================
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Slowly rotate particle field
    particleSystem.rotation.y = elapsedTime * 0.02 + mouse.x * 0.15;
    particleSystem.rotation.x = elapsedTime * 0.01 + mouse.y * 0.1;

    // Rotate 3D geometries
    torusKnot.rotation.x = elapsedTime * 0.25;
    torusKnot.rotation.y = elapsedTime * 0.35;
    torusKnot.position.y = 15 + Math.sin(elapsedTime * 0.8) * 4;

    icosahedron.rotation.x = elapsedTime * 0.2;
    icosahedron.rotation.z = elapsedTime * 0.3;
    icosahedron.position.y = -15 + Math.cos(elapsedTime * 0.7) * 3;

    octahedron.rotation.y = elapsedTime * 0.4;
    octahedron.rotation.z = elapsedTime * 0.2;

    // Update plexus nodes & build dynamic connecting lines
    const linePositions = [];
    const maxDistance = 22;

    for (let i = 0; i < plexusCount; i++) {
      const p = plexusCoords[i];
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // Bounce in boundary
      if (p.x < -50 || p.x > 50) p.vx *= -1;
      if (p.y < -40 || p.y > 40) p.vy *= -1;
      if (p.z < -30 || p.z > 30) p.vz *= -1;

      // Compare distance to other nodes
      for (let j = i + 1; j < plexusCount; j++) {
        const p2 = plexusCoords[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dz = p.z - p2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          linePositions.push(p.x, p.y, p.z);
          linePositions.push(p2.x, p2.y, p2.z);
        }
      }
    }

    plexusGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    // Camera Parallax
    const targetCamX = mouse.x * 12;
    const targetCamY = mouse.y * 8 - (scrollY * 0.02);
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(0, -scrollY * 0.015, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
