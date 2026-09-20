/**
 * HEALTH FITNESS GYM - Subtle Cinematic Atmosphere Engine (2026 Edition)
 * Micro-fine cosmic depth particles in Silver & Crimson Steel
 */

(function() {
  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas || !window.THREE) return;

  // 1. Performance Guard: Completely disable WebGL particle engine on mobile & touch devices
  const isMobileOrTouch = window.innerWidth <= 880 || ('ontouchstart' in window && !window.matchMedia('(hover: hover)').matches);
  if (isMobileOrTouch) {
    canvas.style.display = 'none';
    return;
  }

  // 2. Optimized Desktop Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.z = 75;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false, // Turn off antialias for major GPU savings
    powerPreference: 'low-power'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1); // Standard pixel ratio for 60fps desktop smoothness

  // Lean Particle Count (120 instead of 700 for 85% GPU relief)
  const particleCount = 120;
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
    const pColor = r < 0.7 ? colorWhite : (r < 0.88 ? colorSteel : colorCrimson);
    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Throttled mouse parallax
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  let mouseMoveTimeout;

  window.addEventListener('mousemove', (e) => {
    if (mouseMoveTimeout) return;
    mouseMoveTimeout = requestAnimationFrame(() => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.2;
      mouseMoveTimeout = null;
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 880) {
      canvas.style.display = 'none';
      cancelAnimationFrame(animId);
      return;
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  // 3. Pause rendering when tab is hidden or hero is scrolled out of view
  let isVisible = true;
  let animId = null;
  const clock = new THREE.Clock();

  if ('IntersectionObserver' in window) {
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(animate);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(heroEl);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      cancelAnimationFrame(animId);
      animId = null;
    } else {
      isVisible = true;
      if (!animId) animId = requestAnimationFrame(animate);
    }
  });

  function animate() {
    if (!isVisible) {
      animId = null;
      return;
    }
    animId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.03;

    targetX += (mouseX * 6 - targetX) * 0.035;
    targetY += (-mouseY * 6 - targetY) * 0.035;

    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animId = requestAnimationFrame(animate);
})();
