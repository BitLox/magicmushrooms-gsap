document.addEventListener('DOMContentLoaded', () => {
  // Detect if on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Generate and animate twinkling stars
  const starsContainer = document.getElementById('stars');
  const stars = [];
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    starsContainer.appendChild(star);
    stars.push(star);
  }
  console.log('Stars initialized:', stars.length);

  stars.forEach((star, i) => {
    gsap.to(star, {
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 2 + 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      onStart: () => console.log('Star ' + i + ' started twinkling')
    });
  });

  // Generate spores
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
  console.log('Spores initialized:', spores.length);

  // Generate motion particles for next scene
  const motionParticlesContainer = document.getElementById('motion-particles');
  const motionParticles = [];
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'motion-particle';
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    motionParticlesContainer.appendChild(particle);
    motionParticles.push(particle);
  }
  console.log('Motion particles initialized:', motionParticles.length);

  // Intro animations: Grow mushroom, fade in title, tagline, spores
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

  // Motion particles animation (looping, slow drift)
  gsap.utils.toArray('.motion-particle').forEach((particle, i) => {
    const angle = Math.random() * 360;
    const distance = Math.random() * 100 + 100;
    const targetX = Math.cos(angle * Math.PI / 180) * distance;
    const targetY = Math.sin(angle * Math.PI / 180) * distance;
    gsap.to(particle, {
      x: targetX,
      y: targetY,
      opacity: 0.5,
      duration: 10 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      onStart: () => console.log('Motion particle ' + i + ' started drifting')
    });
  });

  // Custom wheel event for scroll to drive timeline (no normal scrolling)
  const flyTl = gsap.timeline({ 
    paused: true,
    onUpdate: () => {
      console.log('Motion background opacity:', window.getComputedStyle(document.getElementById('motion-background')).opacity);
      console.log('Motion particles opacity:', window.getComputedStyle(document.getElementById('motion-particles')).opacity);
    }
  });
  flyTl.fromTo('#central-mushroom', { scale: 1 }, { scale: 50, ease: 'none' }) // Grow to 5000%
    .to('#title, #tagline', { opacity: 0, duration: 0.1 }, 0) // Instant fade out
    .to('#spores, #stars', { opacity: 0, duration: 0.5 }, 0.2) // Slower fade for spores/stars
    .to('#motion-background', { 
      opacity: 1, 
      duration: 0.5
    }, 0.65) // Fade in earlier
    .to('#motion-particles', { opacity: 1, duration: 0.5 }, 0.65) // Fade in particles earlier
    .to('#next-section-box', { opacity: 1, duration: 0.5 }, 0.7) // Fade in box
    .add(() => {
      // Simplified color cycle timeline
      const bgTl = gsap.timeline({ repeat: -1 });
      bgTl.to('#motion-background', {
        backgroundColor: '#4B0082', // Deep purple
        duration: 2.5,
        ease: 'sine.inOut',
        onStart: () => console.log('Background color changing to: #4B0082')
      })
      .to('#motion-background', {
        backgroundColor: '#C71585', // Soft magenta
        duration: 5,
        ease: 'sine.inOut',
        onStart: () => console.log('Background color changing to: #C71585')
      })
      .to('#motion-background', {
        backgroundColor: '#18A3FF', // Vibrant blue
        duration: 5,
        ease: 'sine.inOut',
        onStart: () => console.log('Background color changing to: #18A3FF')
      })
      .to('#motion-background', {
        backgroundColor: '#4B0082', // Back to deep purple
        duration: 2.5,
        ease: 'sine.inOut',
        onStart: () => console.log('Background color changing to: #4B0082')
      });
    }, 0.65);

  // Prevent normal scroll
  document.body.style.overflow = 'hidden';

  // Use wheel event to update timeline progress
  let progress = 0;
  window.addEventListener('wheel', (e) => {
    const divisor = e.deltaY > 0 ? 8000 : 6000; // Forward 8000, reverse 6000
    progress = Math.max(0, Math.min(1, progress + (e.deltaY / divisor)));
    flyTl.progress(progress);
    console.log('Wheel deltaY:', e.deltaY, 'Timeline progress:', progress, 'Scale:', 1 + progress * (50 - 1));
  }, { passive: false });

  // For touch scrolling in mobile/Safari
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    const deltaY = touchStartY - e.touches[0].clientY;
    console.log('Touch deltaY:', deltaY);
    const divisor = isIOS ? (deltaY > 0 ? 120000 : 6000) : (deltaY > 0 ? 8000 : 6000); // iOS slower forward
    progress = Math.max(0, Math.min(1, progress + (deltaY / divisor)));
    flyTl.progress(progress);
    console.log('Timeline progress:', progress, 'Scale:', 1 + progress * (50 - 1));
    e.preventDefault();
  }, { passive: false });
});