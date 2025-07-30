document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  let animationsEnabled = true;

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

    // Twinkling: opacity variation for twinkling effect
    gsap.to(star, {
      opacity: Math.random() * 0.5 + 0.2, // Vary between dim and bright
      duration: Math.random() * 2 + 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // Generate spores dynamically (start at center)
  const sporesContainer = document.getElementById('spores');
  for (let i = 0; i < 10; i++) {
    const spore = document.createElement('div');
    spore.className = 'spore';
    // Initial center position (overridden in CSS to opacity:0)
    spore.style.top = '0px';
    spore.style.left = '0px';
    sporesContainer.appendChild(spore);
  }

  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particlesContainer.appendChild(particle);
  }

  const orbitingSpores = document.getElementById('orbiting-spores');
  for (let i = 0; i < 5; i++) {
    const spore = document.createElement('div');
    spore.className = 'spore';
    const angle = i * (360 / 5);
    spore.style.transform = `translate(${Math.cos(angle * Math.PI / 180) * 100}px, ${Math.sin(angle * Math.PI / 180) * 100}px)`;
    orbitingSpores.appendChild(spore);
  }

  // Intro animations: Grow mushroom first, then fade in title with glow, then tagline with glow
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  tl.from('#central-mushroom', { scale: 0, opacity: 0, duration: 3, delay: 0.5 }) // Growth
    .to('#central-mushroom .mushroom-cap', { 
      boxShadow: "0 0 60px 20px rgba(255, 20, 147, 1)",
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '+=0')
    .from('#title', { opacity: 0, y: -20, duration: 1 }) // Fade in from above after growth
    .to('#title', { // Glowing effect for title
      textShadow: "0 0 30px rgba(255, 20, 147, 1)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '-=1') // Starts with fade-in
    .from('#tagline', { opacity: 0, y: 20, duration: 1 }, '-=1') // Fade in from below, overlapping slightly
    .to('#tagline', { // Same glowing for tagline
      textShadow: "0 0 20px rgba(255, 20, 147, 1)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    }, '-=1');

  // Spores drift outward from center after growth, continually "spawning" by resetting
  gsap.utils.toArray('.spore').forEach((spore, i) => {
    const angle = Math.random() * 360; // Random direction for constellation feel
    const distance = Math.random() * 400 + 200; // Out to edges
    const targetX = Math.cos(angle * Math.PI / 180) * distance;
    const targetY = Math.sin(angle * Math.PI / 180) * distance;
    gsap.fromTo(spore, 
      { opacity: 0, x: 0, y: 0 }, // Start at center, hidden
      {
        opacity: 1,
        x: targetX,
        y: targetY,
        duration: 5 + Math.random() * 5, // Slow lazy motion (5-10s)
        delay: 3.5 + i * 0.3, // After growth, staggered
        ease: 'sine.inOut',
        repeat: -1 // Continual reset to simulate spawning new ones
      }
    );
  });

  // Landscape on scroll: Pulse mushroom, fade in elements, sway plants, particles loop
  gsap.to('#central-mushroom-landscape', {
    scale: 1.1,
    duration: 0.5,
    repeat: 1,
    yoyo: true,
    scrollTrigger: {
      trigger: '#landscape',
      start: 'top center',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('#landscape-elements', {
    opacity: 0,
    duration: 2,
    scrollTrigger: {
      trigger: '#landscape',
      start: 'top center',
      scrub: true,
    },
  });

  gsap.to('.plant', {
    x: 10,
    rotation: 5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    stagger: 0.5,
  });

  gsap.to('.particle', {
    x: gsap.utils.random(-50, 50),
    y: gsap.utils.random(-50, 50),
    duration: gsap.utils.random(2, 5),
    repeat: -1,
    ease: 'sine.inOut',
  });

  // Info cards: Grow on scroll, hover effects
  gsap.utils.toArray('.info-card').forEach((card, i) => {
    gsap.from(card, {
      y: 100,
      opacity: 0,
      scale: 0.5,
      duration: 1,
      delay: i * 0.2,
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        toggleActions: 'play none none reverse',
      },
    });

    card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.05, boxShadow: '0 0 20px #ff69b4', duration: 0.3 }));
    card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, boxShadow: 'none', duration: 0.3 }));
  });

  // CTA: Darken, materialize content, orbit spores
  gsap.to('#cta', {
    backgroundColor: 'rgba(0,0,0,0.8)',
    duration: 1,
    scrollTrigger: {
      trigger: '#cta',
      start: 'top center',
      scrub: true,
    },
  });

  gsap.from('#cta-content', {
    opacity: 0,
    scale: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '#cta',
      start: 'top center',
    },
  });

  gsap.to('#orbiting-spores .spore', {
    rotation: 360,
    duration: 10,
    repeat: -1,
    stagger: 0.2,
    ease: 'none',
  });

  // Sticky nav: Show after intro
  ScrollTrigger.create({
    trigger: '#intro',
    start: 'bottom top',
    onEnter: () => document.getElementById('sticky-nav').style.display = 'flex',
    onLeaveBack: () => document.getElementById('sticky-nav').style.display = 'none',
  });

  // Animation toggle
  document.getElementById('animation-toggle').addEventListener('click', () => {
    animationsEnabled = !animationsEnabled;
    gsap.globalTimeline.timeScale(animationsEnabled ? 1 : 0);
    document.body.classList.toggle('animations-off', !animationsEnabled);
    document.getElementById('animation-toggle').textContent = animationsEnabled ? 'Pause Animations' : 'Resume Animations';
  });
});