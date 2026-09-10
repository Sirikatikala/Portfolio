/**
 * Master Application Script - K. Siva Naga Kumari Portfolio
 * Handles Preloader, Typing Effect, Custom Magnetic Cursor, GSAP ScrollTriggers,
 * Modals, Skill Progress Bars, VanillaTilt, and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== 1. PRELOADER CONTROLLER ====================
  const loaderWrapper = document.getElementById('loader-wrapper');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercentage = document.getElementById('loader-percentage');
  const loaderStatusText = document.getElementById('loader-status-text');

  let currentProgress = 0;
  const statusMessages = [
    { at: 20, text: 'Constructing 3D geometry...' },
    { at: 50, text: 'Calibrating quantum particles...' },
    { at: 80, text: 'Rendering glassmorphic layers...' },
    { at: 95, text: 'Synchronizing interface...' },
    { at: 100, text: 'System ready.' }
  ];

  const progressInterval = setInterval(() => {
    currentProgress += Math.floor(Math.random() * 8) + 3;
    if (currentProgress > 100) currentProgress = 100;

    if (loaderBar) loaderBar.style.width = currentProgress + '%';
    if (loaderPercentage) loaderPercentage.textContent = currentProgress + '%';

    const matchMsg = statusMessages.find(m => currentProgress >= m.at);
    if (matchMsg && loaderStatusText) {
      loaderStatusText.textContent = matchMsg.text;
    }

    if (currentProgress >= 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (loaderWrapper) {
          loaderWrapper.classList.add('loaded');
          // Trigger entrance animations
          initHeroAnimations();
          if (typeof AOS !== 'undefined') {
            AOS.init({
              duration: 800,
              once: true,
              offset: 80,
              easing: 'ease-out-cubic'
            });
          }
        }
      }, 400);
    }
  }, 35);

  // ==================== 2. CUSTOM MAGNETIC CURSOR ====================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover state detection
  const interactiveSelectors = 'a, button, input, textarea, .glass-card, .contact-detail-box, .trait-pill, .tech-tag, [data-tilt]';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.classList.remove('cursor-active');
    });
  });

  // Magnetic button effect on .magnetic-target
  document.querySelectorAll('.magnetic-target').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // ==================== 3. TYPING EFFECT IN HERO ====================
  const typedTarget = document.getElementById('typed-text');
  const roles = [
    'Aspiring Data Analyst',
    'B.Tech CS Engineering Student',
    'Python & Data Insights Explorer',
    'Analytical Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeRole() {
    if (!typedTarget) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause on completed word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(typeRole, typingSpeed);
  }
  typeRole();

  // ==================== 4. GSAP ENTRANCE & SCROLL TRIGGERS ====================
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Timeline Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-status-pill', { opacity: 0, y: -20, duration: 0.6 })
      .from('.hero-greeting', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-name', { opacity: 0, scale: 0.95, duration: 0.7 }, '-=0.3')
      .from('.hero-typed-wrapper', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
      .from('.hero-description', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
      .from('.hero-cta-group .btn', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.3')
      .from('.hero-metrics-bar', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
      .from('.profile-card-3d', { opacity: 0, rotateY: 20, duration: 0.9 }, '-=0.7');

    // Laser timeline progress line
    const laserLine = document.getElementById('timeline-laser');
    if (laserLine) {
      gsap.fromTo(laserLine,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 1
          }
        }
      );
    }
  }

  // ==================== 5. SKILL PROGRESS BARS TRIGGER ====================
  const skillsSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.progress-fill');

  let skillsTriggered = false;
  function triggerSkillBars() {
    if (!skillsSection || skillsTriggered) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.75) {
      skillsTriggered = true;
      progressBars.forEach((bar) => {
        const targetProgress = bar.getAttribute('data-progress');
        if (targetProgress) {
          bar.style.width = targetProgress;
        }
      });
    }
  }
  window.addEventListener('scroll', triggerSkillBars);
  triggerSkillBars(); // Check initial state

  // ==================== 6. NAVBAR SCROLL & ACTIVE LINK ====================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY || window.pageYOffset;

    // Sticky glass blur
    if (scrollPos > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Drawer Toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // ==================== 7. RESUME MODAL HANDLERS ====================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const heroResumeTrigger = document.getElementById('hero-resume-trigger');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResume() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    openResume();
  });
  if (heroResumeTrigger) heroResumeTrigger.addEventListener('click', openResume);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==================== 8. PROJECT CASE STUDY MODAL ====================
  const projectModal = document.getElementById('project-modal');
  const projModalTitle = document.getElementById('proj-modal-title');
  const projModalBody = document.getElementById('proj-modal-body');
  const closeProjBtn = document.getElementById('close-proj-btn');

  const projectDetails = {
    insightpulse: {
      title: 'InsightPulse — Sales & KPI Analytics Engine',
      content: `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <p style="margin-bottom: 1rem;"><strong style="color: #fff;">Objective:</strong> Build an end-to-end data processing and analytics tool to ingest unstructured sales records, calculate mission-critical KPIs (Conversion rate, Average Order Value, Monthly Recurring Revenue), and highlight seasonal trends.</p>
          <h4 style="color: var(--neon-cyan); margin: 1rem 0 0.5rem 0;">Key Methodology:</h4>
          <ul style="list-style: square inside; margin-bottom: 1rem; color: #cbd5e1;">
            <li>Data wrangling & cleaning on 10,000+ transaction rows using Python and Pandas.</li>
            <li>Elimination of duplicate records, imputation of missing values, and type optimization.</li>
            <li>Aggregated SQL queries for high-speed multi-dimensional summaries.</li>
            <li>Clear visual dashboards using Matplotlib/Seaborn with customizable date filtering.</li>
          </ul>
          <h4 style="color: var(--neon-purple); margin: 1rem 0 0.5rem 0;">Impact & Takeaways:</h4>
          <p>Reduced manual report compilation time from hours to seconds and discovered peak purchasing windows with 98% accuracy.</p>
        </div>
      `
    },
    edupredict: {
      title: 'EduPredict — Academic Performance Analyzer',
      content: `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <p style="margin-bottom: 1rem;"><strong style="color: #fff;">Objective:</strong> Forecast semester student performance by analyzing historical metrics (study hours, attendance percentage, previous test scores) and recommend tailored study interventions.</p>
          <h4 style="color: var(--neon-purple); margin: 1rem 0 0.5rem 0;">Key Methodology:</h4>
          <ul style="list-style: square inside; margin-bottom: 1rem; color: #cbd5e1;">
            <li>Synthesized academic benchmark datasets with categorical and numerical features.</li>
            <li>Conducted exploratory data analysis (EDA) to compute Pearson correlation matrices.</li>
            <li>Created threshold-based warning triggers for students at risk of falling behind.</li>
            <li>Automated individual student report card generation with actionable improvement steps.</li>
          </ul>
          <h4 style="color: var(--neon-cyan); margin: 1rem 0 0.5rem 0;">Impact & Takeaways:</h4>
          <p>Demonstrates practical application of statistical analytics to real-world educational challenges.</p>
        </div>
      `
    },
    quantumsphere: {
      title: 'QuantumSphere — 3D Interactive WebGL Portfolio',
      content: `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <p style="margin-bottom: 1rem;"><strong style="color: #fff;">Objective:</strong> Engineer a modern, FAANG-level portfolio showcasing advanced WebGL graphics, GSAP ScrollTrigger choreography, and holographic glassmorphism design.</p>
          <h4 style="color: var(--neon-cyan); margin: 1rem 0 0.5rem 0;">Key Methodology:</h4>
          <ul style="list-style: square inside; margin-bottom: 1rem; color: #cbd5e1;">
            <li>Three.js WebGL particle field (1,400+ points) with dynamic dual-color vertex interpolation.</li>
            <li>Real-time Plexus constellation algorithm linking adjacent particle nodes.</li>
            <li>3D wireframe geometries (Torus Knot, Icosahedron, Octahedron) with mouse parallax.</li>
            <li>Sub-second loading times with lightweight vanilla CSS and high accessibility contrast.</li>
          </ul>
        </div>
      `
    },
    algocore: {
      title: 'AlgoCore — Data Structures & Algorithm Suite',
      content: `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <p style="margin-bottom: 1rem;"><strong style="color: #fff;">Objective:</strong> Master foundational computer science algorithms by building custom data structures from scratch in Java and C with strict asymptotic complexity analysis.</p>
          <h4 style="color: var(--neon-purple); margin: 1rem 0 0.5rem 0;">Key Methodology:</h4>
          <ul style="list-style: square inside; margin-bottom: 1rem; color: #cbd5e1;">
            <li>Implemented custom Binary Search Trees, Balanced Trees, and Double-Ended Queues.</li>
            <li>Benchmarked QuickSort, MergeSort, and HeapSort across varying dataset distributions.</li>
            <li>Memory management optimization and pointer arithmetic profiling in C.</li>
            <li>Modular Object-Oriented design adhering to SOLID principles in Java.</li>
          </ul>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-project-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const details = projectDetails[projKey];
      if (details && projectModal && projModalTitle && projModalBody) {
        projModalTitle.textContent = details.title;
        projModalBody.innerHTML = details.content;
        projectModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeProjBtn) {
    closeProjBtn.addEventListener('click', () => {
      if (projectModal) {
        projectModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==================== 9. 1-CLICK COPY TO CLIPBOARD ====================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('.contact-detail-box').forEach((box) => {
    box.addEventListener('click', () => {
      const textToCopy = box.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast(`Copied to clipboard!`);
        });
      }
    });
  });

  // ==================== 10. INTERACTIVE CONTACT FORM ====================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const subject = document.getElementById('user-subject').value.trim();
      const message = document.getElementById('user-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      // Simulate sending
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Transmitting...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-text">Send Message</span> <i class="fa-solid fa-paper-plane btn-icon"></i>';
        }

        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');

        // Confetti celebration
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06ffa5', '#8b5cf6', '#6366f1', '#ffffff']
          });
        }
      }, 1000);
    });
  }

  if (resetFormBtn && contactForm && formSuccess) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'block';
      formSuccess.classList.remove('show');
    });
  }

  // ==================== 11. BACK TO TOP BUTTON ====================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== 12. VANILLA TILT INIT ====================
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 12,
      speed: 400,
      glare: true,
      'max-glare': 0.25,
      scale: 1.02
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResume();
      if (projectModal) {
        projectModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
});
