document.addEventListener('DOMContentLoaded', () => {
  // Generate and animate twinkling stars (pulsating spheres) immediately on load
  const starsContainer = document.getElementById('stars');
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    starsContainer.appendChild(star);

    gsap.to(star, {
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 2 + 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // Generate spores dynamically (start at center)
  const sporesContainer = document.getElementById('spores');
  const spores = [];
  for (let i = 0; i < 100; i++) {
    const spore = document.createElement('div');
    spore.className = 'spore';
    spore.style.top = '0px';
    spore.style.left = '0px';
    sporesContainer.appendChild(spore);
    spores.push(spore);
  }
  console.log('Spores initialized:', spores.length); // Confirm count

  // Intro animations: Grow mushroom first, then fade in title with glow, then tagline with glow
  const tl = gsap.timeline({ 
    defaults: { ease: 'power2.out' },
    onComplete: () => {
      gsap.set('#central-mushroom', { scale: 1 }); // Lock full size
      gsap.set('#spores', { opacity: 1 }); // Force container visible
      console.log('Load animation complete, spores container opacity set to 1');
      console.log('Spores container computed opacity:', window.getComputedStyle(sporesContainer).opacity);
    }
  });
  tl.from('#central-mushroom', { scale: 0, opacity: 0, duration: 3, delay: 0.5 })
    .to('#central-mushroom .mushroom-cap', { 
      boxShadow: "0 0 60px 20px rgba(0, 191, 255, 1)",
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '+=0')
    .from('#title', { opacity: 0, y: -20, duration: 1 })
    .to('#title', {
      textShadow: "0 0 30px rgba(255, 20, 147, 1)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '-=1')
    .from('#tagline', { opacity: 0, y: 20, duration: 1 }, '-=1')
    .to('#tagline', {
      textShadow: "0 0 20px rgba(255, 20, 147, 1)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '-=1')
    .to('#spores', { opacity: 1, duration: 1 }, '-=2');

  // Spores drift outward from center
  gsap.utils.toArray('.spore').forEach((spore, i) => {
    const angle = Math.random() * 360;
    const distance = Math.random() * 200 + 100;
    const targetX = Math.cos(angle * Math.PI / 180) * distance;
    const targetY = Math.sin(angle * Math.PI / 180) * distance;
    gsap.to(spore, {
      opacity: 1,
      x: targetX,
      y: targetY,
      duration: 5 + Math.random() * 5,
      delay: 3.5 + i * 0.3,
      ease: 'sine.inOut',
      repeat: -1,
      onStart: () => console.log('Spore ' + i + ' started drifting'),
      onUpdate: () => console.log('Spore ' + i + ' opacity:', spore.style.opacity, 'transform:', spore.style.transform, 'visibility:', window.getComputedStyle(spore).visibility)
    });
  });

  // Custom wheel event for "scroll" to drive the timeline (no normal scrolling)
  const flyTl = gsap.timeline({ paused: true });
  flyTl.fromTo('#central-mushroom', { scale: 1 }, { scale: 50, ease: 'none' }) // Grow from full size to 5000%
    .to('#title, #tagline', { opacity: 0, duration: 0.1 }, 0) // Instant fade out
    .to('#spores, #stars', { opacity: 0, duration: 0.5 }, 0.2) // Slower fade for spores/stars
    .to(document.body, { backgroundColor: '#00bfff', duration: 1 }, 0); // Seamless background transition

  // Prevent normal scroll
  document.body.style.overflow = 'hidden';

  // Use wheel event to update timeline progress (slower with /2000)
  let progress = 0;
  window.addEventListener('wheel', (e) => {
    progress = Math.max(0, Math.min(1, progress + (e.deltaY / 2000))); // Slower scroll
    flyTl.progress(progress);
    console.log('Timeline progress:', progress, 'Scale:', 1 + progress * (50 - 1)); // Debug scale
  }, { passive: false });

  // For touch scrolling in mobile/Safari
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    const deltaY = touchStartY - e.touches[0].clientY;
    console.log('Touch deltaY:', deltaY); // Debug touch sensitivity
    progress = Math.max(0, Math.min(1, progress + (deltaY / 4000))); // Slower for iOS
    flyTl.progress(progress);
    console.log('Timeline progress:', progress, 'Scale:', 1 + progress * (50 - 1)); // Debug scale
    e.preventDefault();
  }, { passive: false });
});