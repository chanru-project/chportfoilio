// Minimal script to avoid missing file reference and enable minor UX tweaks.
// Runs after DOM loads.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Console message to confirm script presence.
    console.log('Portfolio script loaded');

    // Animated Background Color
    let hue = 220; // Start with blue
    let direction = 1;
    
    function animateBackground() {
      // Cycle through hues smoothly
      hue += direction * 0.3;
      
      // Reverse direction at boundaries for smooth cycling
      if (hue >= 280 || hue <= 180) {
        direction *= -1;
      }
      
      // Create dynamic gradient background
      const saturation = 70;
      const lightness1 = 8;
      const lightness2 = 3;
      
      document.body.style.background = `
        radial-gradient(circle at 20% 30%, 
          hsla(${hue}, ${saturation}%, ${lightness1}%, 0.4) 0%, 
          transparent 40%),
        radial-gradient(circle at 80% 70%, 
          hsla(${hue + 40}, ${saturation}%, ${lightness1}%, 0.3) 0%, 
          transparent 50%),
        radial-gradient(circle at 50% 50%, 
          hsla(${hue + 20}, ${saturation - 10}%, ${lightness2}%, 0.6) 0%, 
          #000000 70%)
      `;
      
      requestAnimationFrame(animateBackground);
    }
    
    // Start the animation
    animateBackground();

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        formMessage.style.display = 'none';

        // Get form values
        const name = this.querySelector('[name="name"]').value.trim();
        const email = this.querySelector('[name="email"]').value.trim();
        const message = this.querySelector('[name="message"]').value.trim();

        // Validate form
        if (!name || !email || !message) {
          formMessage.textContent = '✗ Please fill in all fields';
          formMessage.classList.remove('success');
          formMessage.classList.add('error');
          formMessage.style.display = 'block';
          return;
        }

        // Send form data to Formspree using Fetch API
        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        })
        .then(response => {
          if (response.ok) {
            formMessage.textContent = '✓ Thank you! Your message has been sent. We will reply soon.';
            formMessage.classList.remove('error');
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            contactForm.reset();
            setTimeout(function() {
              formMessage.style.display = 'none';
              formMessage.classList.remove('success');
            }, 5000);
          } else {
            response.json().then(data => {
              let errorText = '✗ Oops! There was a problem sending your message.';
              if (data && data.errors) {
                errorText = data.errors.map(err => err.message).join(', ');
              }
              formMessage.textContent = errorText;
              formMessage.classList.remove('success');
              formMessage.classList.add('error');
              formMessage.style.display = 'block';
            }).catch(() => {
              formMessage.textContent = '✗ Oops! There was a problem sending your message.';
              formMessage.classList.remove('success');
              formMessage.classList.add('error');
              formMessage.style.display = 'block';
            });
          }
        })
        .catch(() => {
          formMessage.textContent = '✗ Network error. Please try again later.';
          formMessage.classList.remove('success');
          formMessage.classList.add('error');
          formMessage.style.display = 'block';
        });
      });
    }

    // Close menu when clicking on a link
      const navLinks = navMenu.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }

    // Active Navigation & Section Animation on Scroll
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-menu a');
    
    function setActiveNav() {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 150)) {
          current = section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) {
          item.classList.add('active');
        }
      });
    }
    
    // Intersection Observer for Section Animations (repeatable)
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.getAttribute('id');
        
        if (entry.isIntersecting) {
          // Remove all animation classes first for re-animation
          entry.target.classList.remove('slide-in-top', 'fade-in-left', 'zoom-in', 'fade-in-up', 'slide-in-bottom');
          
          // Trigger reflow to restart animation
          void entry.target.offsetWidth;
          
          // Add visible class and unique animation
          entry.target.classList.add('visible');
          
          if (sectionId === 'home') {
            entry.target.classList.add('slide-in-top');
          } else if (sectionId === 'about') {
            entry.target.classList.add('fade-in-left');
          } else if (sectionId === 'skills') {
            entry.target.classList.add('zoom-in');
          } else if (sectionId === 'projects') {
            entry.target.classList.add('fade-in-up');
          } else if (sectionId === 'contact') {
            entry.target.classList.add('slide-in-bottom');
          }
        } else {
          // Remove visible and animation classes when leaving viewport
          entry.target.classList.remove('visible', 'slide-in-top', 'fade-in-left', 'zoom-in', 'fade-in-up', 'slide-in-bottom');
        }
      });
    }, observerOptions);
    
    sections.forEach(section => {
      section.classList.add('section-hidden');
      observer.observe(section);
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', setActiveNav);
    setActiveNav(); // Set initial state
  });
})();
