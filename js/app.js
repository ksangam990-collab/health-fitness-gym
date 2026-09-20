/**
 * HEALTH FITNESS GYM - Interactive Web Application Engine (2026 Edition)
 * Scroll-reveal animations, live status, muscle explorer, transformation slider,
 * biometric BMI tool, crowd density radar, and WhatsApp trial generator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons safely (resilient to script deferring)
  function initIcons() {
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    } else {
      setTimeout(initIcons, 50);
    }
  }
  initIcons();

  // 2. Hardware-Accelerated Scroll Reveal Engine
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Trigger stat counters inside this container if present
          const counters = entry.target.querySelectorAll('.stat-counter');
          counters.forEach(counter => {
            if (!counter.dataset.counted) {
              counter.dataset.counted = 'true';
              animateCounter(counter);
            }
          });

          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Number Counter Animation
  function animateCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * ease;

      counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }

    requestAnimationFrame(update);
  }

  // 3. Sticky Glass Header (State-checked to prevent layout thrashing)
  const header = document.querySelector('.header');
  let headerScrolled = false;
  window.addEventListener('scroll', () => {
    const shouldScroll = window.scrollY > 40;
    if (shouldScroll !== headerScrolled) {
      headerScrolled = shouldScroll;
      if (header) header.classList.toggle('scrolled', headerScrolled);
    }
  }, { passive: true });

  // 4. Mobile Drawer Navigation (Interactive Full-Screen Slide-Over)
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    document.body.classList.add('nav-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.innerHTML = '<i data-lucide="x"></i>';
      if (window.lucide) lucide.createIcons();
    }
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    }
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    mobileDrawer.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on backdrop click
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeDrawer);
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // 5. Live Gym Opening Hours Status Checker (Accurate Indian Standard Time IST)
  function updateLiveStatus() {
    const statusPill = document.getElementById('live-gym-status');
    const bentoClock = document.getElementById('bento-live-time');
    const bentoStatusText = document.getElementById('bento-status-desc');

    const now = new Date();
    // Get hours and minutes in Indian Standard Time (Asia/Kolkata UTC+5:30)
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const parts = istFormatter.formatToParts(now);
    const hourPart = parts.find(p => p.type === 'hour');
    const minPart = parts.find(p => p.type === 'minute');
    const currentHour = parseInt(hourPart ? hourPart.value : now.getHours(), 10);
    const currentMin = parseInt(minPart ? minPart.value : now.getMinutes(), 10);
    const currentTimeInMinutes = currentHour * 60 + currentMin;

    const openTime = 6 * 60;   // 6:00 AM

    // Sunday closes at 1 PM (13:00), other days at 10 PM (22:00)
    const dayOfWeek = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short' });
    const isSunday = dayOfWeek === 'Sun';
    const closeTime = isSunday ? 13 * 60 : 22 * 60;
    const closesLabel = isSunday ? '1 PM' : '10 PM';

    const isOpen = currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime;

    // Format IST 12-hour time string
    const ist12Formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const timeString = ist12Formatter.format(now);
    if (bentoClock) bentoClock.textContent = timeString;

    if (statusPill) {
      if (isOpen) {
        statusPill.innerHTML = `<span class="pulse-dot"></span><span>OPEN NOW · Closes ${closesLabel}</span>`;
        statusPill.style.color = '#10b981';
      } else {
        statusPill.innerHTML = `<span class="pulse-dot" style="background:#f59e0b; box-shadow:0 0 8px #f59e0b;"></span><span>CLOSED · Opens 6 AM</span>`;
        statusPill.style.color = '#f59e0b';
      }
    }

    if (bentoStatusText) {
      if (isOpen) {
        const minsLeft = closeTime - currentTimeInMinutes;
        const h = Math.floor(minsLeft / 60);
        const m = minsLeft % 60;
        bentoStatusText.textContent = `Doors open in Bagunhatu · ${h}h ${m}m remaining today`;
      } else {
        bentoStatusText.textContent = `Currently closed for sanitation · Opens 6:00 AM sharp tomorrow`;
      }
    }
  }
  updateLiveStatus();
  setInterval(updateLiveStatus, 10000); // Update every 10 seconds for accuracy

  // 6. Interactive Muscle Group & Workout Targeter
  const muscleData = {
    chest: {
      name: 'Chest & Pecs (छाती)',
      desc: 'Target upper, middle, and lower pectorals with heavy barbell presses, incline dumbbell flyes, and dual-cable crossovers.',
      gear: ['Olympic Flat Bench', 'Incline Hammer Strength', 'Cable Fly Station', 'Dips Tower'],
      setsReps: '4 Sets × 8–12 Reps',
      focus: 'Full stretch at bottom & peak contraction squeeze'
    },
    back: {
      name: 'Back & Lats (पीठ और लैट्स)',
      desc: 'Construct a dense, wide V-taper frame using heavy deadlifts, chest-supported T-bar rows, and high-pulley lat pulldowns.',
      gear: ['Olympic Deadlift Platform', 'Wide-Grip Lat Pulldown', 'T-Bar Row Station', 'Seated Cable Row'],
      setsReps: '4 Sets × 6–10 Reps',
      focus: 'Pull with elbows & drive shoulder blades together'
    },
    legs: {
      name: 'Quads & Hamstrings (पैर)',
      desc: 'Build foundational lower-body power and athletic explosive speed with heavy back squats, leg presses, and Romanian deadlifts.',
      gear: ['Commercial Power Cage', '45-Degree Leg Press', 'Leg Extension & Curl Dual Unit', 'Calf Raise Block'],
      setsReps: '5 Sets × 8–15 Reps',
      focus: 'Full depth below parallel & controlled eccentric descent'
    },
    shoulders: {
      name: 'Deltoids & Shoulders (कंधे)',
      desc: 'Sculpt 3D rounded boulder shoulders with standing overhead barbell presses, lateral dumbbell raises, and rear-delt flyes.',
      gear: ['Seated Military Press Rack', 'Lateral Raise Dumbbells (2.5kg–25kg)', 'Dual Adjustable Cables', 'Shrug Bar'],
      setsReps: '4 Sets × 10–15 Reps',
      focus: 'Strict upper torso posture & zero body swing'
    },
    arms: {
      name: 'Biceps & Triceps (बाजू)',
      desc: 'Maximize sleeve-stretching arm volume with heavy EZ-bar curls, skull crushers, tricep rope pushdowns, and hammer curls.',
      gear: ['Preacher Curl Bench', 'EZ Olympic Curl Bars', 'Overhead Tricep Cable Unit', 'Dumbbell Rack Pairs'],
      setsReps: '4 Sets × 10–12 Reps',
      focus: 'Strict elbow lockdown & continuous tension throughout rep'
    },
    core: {
      name: 'Abs & Core (सिक्स पैक एब्स)',
      desc: 'Carve a chiseled six-pack midsection and bulletproof lumbar stability with hanging leg raises, cable woodchops, and weighted planks.',
      gear: ['Captain’s Chair Leg Raise', 'Adjustable Decline Ab Bench', 'Medicine Balls & Mats', 'Ab-Roller Wheels'],
      setsReps: '3 Sets × 15–20 Reps',
      focus: 'Posterior pelvic tilt & deep abdominal bracing'
    }
  };

  const muscleBtns = document.querySelectorAll('.muscle-tab-btn');
  const targetTitle = document.getElementById('target-muscle-title');
  const targetDesc = document.getElementById('target-muscle-desc');
  const targetGearChips = document.getElementById('target-gear-chips');
  const targetSetsReps = document.getElementById('target-sets-reps');
  const targetFocusTip = document.getElementById('target-focus-tip');

  function renderMuscle(key) {
    const data = muscleData[key];
    if (!data) return;

    if (targetTitle) targetTitle.textContent = data.name;
    if (targetDesc) targetDesc.textContent = data.desc;
    if (targetSetsReps) targetSetsReps.textContent = data.setsReps;
    if (targetFocusTip) targetFocusTip.textContent = data.focus;

    if (targetGearChips) {
      targetGearChips.innerHTML = '';
      data.gear.forEach(item => {
        const chip = document.createElement('span');
        chip.className = 'gear-tag-chip';
        chip.textContent = item;
        targetGearChips.appendChild(chip);
      });
    }
  }
  renderMuscle('chest');

  if (muscleBtns) {
    muscleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        muscleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const muscleKey = btn.getAttribute('data-muscle');
        renderMuscle(muscleKey);
      });
    });
  }

  // 7. Draggable 90-Day Transformation Slider
  const sliderBox = document.getElementById('transform-slider');
  const clipLayer = document.getElementById('after-clip-container');
  const dividerLine = document.getElementById('slider-divider');

  if (sliderBox && clipLayer && dividerLine) {
    let isDragging = false;

    function updateSlider(clientX) {
      const rect = sliderBox.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      const percentage = (pos * 100).toFixed(2);

      clipLayer.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`;
      dividerLine.style.left = `${percentage}%`;
    }

    sliderBox.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Support
    sliderBox.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // 8. 3D BMI & Body Assessment Engine
  const heightSlider = document.getElementById('bmi-height');
  const weightSlider = document.getElementById('bmi-weight');
  const heightValDisplay = document.getElementById('bmi-height-val');
  const weightValDisplay = document.getElementById('bmi-weight-val');
  const ageInput = document.getElementById('bmi-age');
  const goalSelect = document.getElementById('bmi-goal');
  const genderBtns = document.querySelectorAll('.gender-btn');

  const bmiNumber = document.getElementById('bmi-number');
  const bmiNeedle = document.getElementById('bmi-needle');
  const bmiBadge = document.getElementById('bmi-badge');
  const bmiAdvice = document.getElementById('bmi-advice');
  const bmiCalorieVal = document.getElementById('bmi-calorie-val');
  const bmiWhatsappBtn = document.getElementById('bmi-whatsapp-share');

  let selectedGender = 'male';

  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGender = btn.getAttribute('data-gender');
      calculateBMI();
    });
  });

  function calculateBMI() {
    if (!heightSlider || !weightSlider) return;

    const height = parseFloat(heightSlider.value);
    const weight = parseFloat(weightSlider.value);
    const age = parseInt(ageInput ? ageInput.value : 24) || 24;
    const goal = goalSelect ? goalSelect.value : 'muscle_gain';

    const feet = Math.floor(height / 30.48);
    const inches = Math.round((height % 30.48) / 2.54);
    const isMobile = window.innerWidth <= 640;
    if (heightValDisplay) heightValDisplay.textContent = isMobile
      ? `${height} cm`
      : `${height} cm (${feet}'${inches}")`;
    if (weightValDisplay) weightValDisplay.textContent = isMobile
      ? `${weight} kg`
      : `${weight} kg (${(weight * 2.20462).toFixed(1)} lbs)`;

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = bmi.toFixed(1);

    if (bmiNumber) bmiNumber.textContent = roundedBMI;

    // Angle from -80deg to +80deg
    let angle = ((bmi - 25) / 10) * 80;
    angle = Math.max(-80, Math.min(80, angle));
    if (bmiNeedle) bmiNeedle.style.transform = `rotate(${angle}deg)`;

    let category = '';
    let categoryClass = '';
    let advice = '';
    let targetProgram = '';

    if (bmi < 18.5) {
      category = 'Underweight (कम वजन)';
      categoryClass = 'underweight';
      advice = 'Surplus caloric nutrition + heavy barbell compound training at Health Fitness Gym to build dense muscular mass safely.';
      targetProgram = 'Hypertrophy & Bulking Regimen';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal & Athletic (आदर्श वजन)';
      categoryClass = 'normal';
      advice = 'Optimal baseline! Sculpt chiseled definition and boost strength PRs with our certified trainers in Bagunhatu.';
      targetProgram = 'Athletic Strength & Conditioning';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight (अधिक वजन)';
      categoryClass = 'overweight';
      advice = 'Accelerate stubborn fat loss with high-intensity interval conditioning and tailored macronutrient diet guidance.';
      targetProgram = 'Fat Loss & High Intensity Cardio';
    } else {
      category = 'Obese Range (मोटापा)';
      categoryClass = 'obese';
      advice = '1-on-1 personal mentorship with joint-safe progressive resistance and continuous motivation to transform your health.';
      targetProgram = '1-on-1 Body Transformation';
    }

    if (bmiBadge) {
      bmiBadge.textContent = category;
      bmiBadge.className = `bmi-category-badge ${categoryClass}`;
    }

    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += (selectedGender === 'male' ? 5 : -161);
    const maintenanceCalories = Math.round(bmr * 1.45);

    if (bmiAdvice) bmiAdvice.textContent = advice;
    if (bmiCalorieVal) bmiCalorieVal.textContent = `${maintenanceCalories} kcal / day`;

    if (bmiWhatsappBtn) {
      const waMsg = encodeURIComponent(
        `Hello Health Fitness Gym (Jamshedpur)!\n\n` +
        `I just completed my Body Composition assessment:\n` +
        `• Height: ${height} cm (${feet}'${inches}")\n` +
        `• Weight: ${weight} kg\n` +
        `• BMI: ${roundedBMI} (${category})\n` +
        `• Est. Maintenance: ${maintenanceCalories} kcal\n` +
        `• Recommended Program: ${targetProgram}\n\n` +
        `I want to speak with your trainer and book a free trial session at your Bagunhatu gym.`
      );
      bmiWhatsappBtn.href = `https://wa.me/918294096478?text=${waMsg}`;
    }
  }

  if (heightSlider && weightSlider) {
    heightSlider.addEventListener('input', calculateBMI);
    weightSlider.addEventListener('input', calculateBMI);
    if (ageInput) ageInput.addEventListener('input', calculateBMI);
    if (goalSelect) goalSelect.addEventListener('change', calculateBMI);
    calculateBMI();
  }

  // 9. Popular Times Crowd Radar
  const crowdData = {
    fridays: [
      { time: '6 AM', h: '65%', label: 'Active Morning Grind', peak: false },
      { time: '9 AM', h: '40%', label: 'Moderate - Open Equipment', peak: false },
      { time: '12 PM', h: '22%', label: 'Quiet Slot - Super Sets', peak: false },
      { time: '3 PM', h: '35%', label: 'Relaxed Atmosphere', peak: false },
      { time: '6 PM', h: '96%', label: 'PEAK RUSH! - Electric Energy', peak: true },
      { time: '9 PM', h: '60%', label: 'Active Night Pump', peak: false }
    ],
    weekdays: [
      { time: '6 AM', h: '75%', label: 'High Energy Lifters', peak: false },
      { time: '9 AM', h: '35%', label: 'Spacious & Smooth', peak: false },
      { time: '12 PM', h: '18%', label: 'Quietest Time of Day', peak: false },
      { time: '3 PM', h: '30%', label: 'Uninterrupted Sessions', peak: false },
      { time: '6 PM', h: '92%', label: 'Evening Peak Hour', peak: true },
      { time: '9 PM', h: '55%', label: 'Late Night Focus', peak: false }
    ],
    weekends: [
      { time: '6 AM', h: '50%', label: 'Mobility & Warmup', peak: false },
      { time: '9 AM', h: '85%', label: 'Weekend Morning Rush', peak: true },
      { time: '12 PM', h: '45%', label: 'Steady Flow', peak: false },
      { time: '3 PM', h: '28%', label: 'Quiet Afternoon', peak: false },
      { time: '6 PM', h: '72%', label: 'Fitness Community', peak: false },
      { time: '9 PM', h: '40%', label: 'Wind-down Lift', peak: false }
    ]
  };

  const chartBars = document.getElementById('chart-bars');
  const dayTabs = document.querySelectorAll('.day-tab-btn[data-day]');

  function renderBars(dayKey) {
    if (!chartBars) return;
    const items = crowdData[dayKey] || crowdData.fridays;
    chartBars.innerHTML = '';

    items.forEach(item => {
      const col = document.createElement('div');
      col.className = 'time-bar-col';
      col.innerHTML = `
        <div class="time-bar ${item.peak ? 'peak' : ''}" style="height: ${item.h};" title="${item.label}"></div>
        <span class="time-label">${item.time}</span>
      `;
      chartBars.appendChild(col);
    });
  }

  if (dayTabs) {
    dayTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dayTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const dayKey = tab.getAttribute('data-day');
        renderBars(dayKey);
      });
    });
    renderBars('fridays');
  }

  // 10. Free Trial Pass Modal
  const modal = document.getElementById('trial-modal');
  const openModalBtns = document.querySelectorAll('.open-trial-modal');
  const closeModalBtn = document.querySelector('.modal-close');
  const trialForm = document.getElementById('trial-booking-form');

  if (modal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Keyboard Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    if (trialForm) {
      trialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('trial-name').value.trim();
        const phone = document.getElementById('trial-phone').value.trim();
        const goal = document.getElementById('trial-goal').value;
        const slot = document.getElementById('trial-slot').value;

        const text = encodeURIComponent(
          `Hello Health Fitness Gym (Jamshedpur)!\n\n` +
          `I would like to claim my FREE 1-Day Trial Pass:\n` +
          `• Name: ${name}\n` +
          `• Phone: ${phone}\n` +
          `• Fitness Goal: ${goal}\n` +
          `• Preferred Time Slot: ${slot}\n\n` +
          `Please confirm my workout slot at your Bagunhatu gym.`
        );

        window.open(`https://wa.me/918294096478?text=${text}`, '_blank');
        closeModal();
      });
    }
  }

  // Hero Visual 3D Interactive Parallax Tilt (Desktop)
  const heroVisualCard = document.querySelector('.hero-visual-card');
  const heroImageWrapper = document.querySelector('.hero-image-wrapper');
  if (heroVisualCard && heroImageWrapper && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroVisualCard.addEventListener('mousemove', (e) => {
      const rect = heroVisualCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      heroImageWrapper.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    heroVisualCard.addEventListener('mouseleave', () => {
      heroImageWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }
});
