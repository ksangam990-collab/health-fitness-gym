/**
 * HEALTH FITNESS GYM - Subtle Cinematic Atmosphere Engine (2026 Edition)
 * Micro-fine cosmic depth particles in Silver & Crimson Steel
 */

(function() {
  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 75;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Micro-Fine Particle Field
  const particleCount = 700;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorWhite = new THREE.Color('#ffffff');
  const colorSteel = new THREE.Color('#64748b');
  const colorCrimson = new THREE.Color('#ff2a4b');

  for (let i = 0; i < particleCount; i++) {
    const radius = 30 + Math.random() * 110;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 85;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const r = Math.random();
    let pColor;
    if (r < 0.65) {
      pColor = colorWhite;
    } else if (r < 0.85) {
      pColor = colorSteel;
    } else {
      pColor = colorCrimson;
    }

    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Micro-point texture
  function createMicroTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(pCanvas);
  }

  const material = new THREE.PointsMaterial({
    size: 1.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.28,
    map: createMicroTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 1.2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Very calm, subtle drift
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.04;

    targetX += (mouseX * 6 - targetX) * 0.035;
    targetY += (-mouseY * 6 - targetY) * 0.035;

    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
