/**
 * HEALTH FITNESS GYM - 3D Card Tilt & Specular Physics Engine
 * High-performance 3D perspective and glare reflection
 */

(function() {
  function init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
      // Inject glare element if missing
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      let bounds;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      function handleMouseMove(e) {
        if (!bounds) updateBounds();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
        const yPct = (mouseY / bounds.top - 0.5) * 2;

        const maxTilt = 12; // Degrees
        const rotateX = -(yPct * maxTilt).toFixed(2);
        const rotateY = (xPct * maxTilt).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Move glare
        const glareX = (mouseX / bounds.width) * 100;
        const glareY = (mouseY / bounds.height) * 100;
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18), transparent 60%)`;
      }

      function handleMouseEnter() {
        updateBounds();
        card.style.transition = 'transform 0.15s ease-out, border-color 0.3s ease';
      }

      function handleMouseLeave() {
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glare.style.opacity = '0';
      }

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('resize', updateBounds);
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DTilt);
  } else {
    init3DTilt();
  }

  window.init3DTilt = init3DTilt;
})();
