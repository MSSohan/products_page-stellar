document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initializeFloatingLabels();
    initializeGPSVideoPlayer();
    initializeReviewSection();
    initializeStellarContactForm();
    initializeFeaturesStyle2Slideshow();
  });

  // ===== GPS VIDEO PLAYER SECTION =====
  // Functions related to the GPS video player - Auto-play on scroll

  function initializeGPSVideoPlayer() {
    const videoContainer = document.querySelector('.video-container-stunning');
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoPlayer = document.querySelector('.video-player');

    if (!videoContainer || !videoThumbnail || !videoPlayer) {
      return;
    }

    let isVideoLoaded = false;
    let hasAutoPlayed = false;
    let videoIframe = null;
    let isVideoPaused = false;

    // Function to load and play video
    function loadAndPlayVideo() {
      if (isVideoLoaded || hasAutoPlayed) {
        return;
      }

      const videoId = videoThumbnail.getAttribute('data-video-id');
      if (!videoId) {
        return;
      }

      // GitHub Pages optimized YouTube embed - Fixed for production deployment
      videoIframe = document.createElement('iframe');
      videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&mute=1&playsinline=1&enablejsapi=1`;
      videoIframe.title = 'GPS / Geo Fencing Attendance Video';
      videoIframe.frameBorder = '0';
      videoIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
      videoIframe.allowFullscreen = true;
      videoIframe.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 25px;
        background: #000;
      `;

      // Clear previous content and add iframe
      videoPlayer.innerHTML = '';
      videoPlayer.appendChild(videoIframe);

      // Animate the transition - immediate without delays
      videoPlayer.classList.add('active');
      videoThumbnail.style.opacity = '0';
      videoThumbnail.style.transform = 'scale(0.95)';
      
      // Add a slight scale effect to the container
      videoContainer.style.transform = 'scale(1.02)';
      setTimeout(() => {
        videoContainer.style.transform = 'scale(1)';
      }, 300);

      isVideoLoaded = true;
      hasAutoPlayed = true;
      isVideoPaused = false;
    }

    // Function to pause video
    function pauseVideo() {
      if (videoIframe && !isVideoPaused) {
        // Update iframe src to pause the video
        const currentSrc = videoIframe.src;
        videoIframe.src = currentSrc.replace(/autoplay=1/, 'autoplay=0');
        isVideoPaused = true;
        
        // Add pause indicator
        videoPlayer.style.opacity = '0.8';
      }
    }

    // Function to resume video
    function resumeVideo() {
      if (videoIframe && isVideoPaused) {
        // Update iframe src to resume the video
        const currentSrc = videoIframe.src;
        videoIframe.src = currentSrc.replace(/autoplay=0/, 'autoplay=1');
        isVideoPaused = false;
        
        // Remove pause indicator
        videoPlayer.style.opacity = '1';
      }
    }

    // Function to reset video to beginning
    function resetVideo() {
      if (videoIframe) {
        const videoId = videoThumbnail.getAttribute('data-video-id');
        videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&mute=1&playsinline=1&cc_load_policy=0&controls=1&disablekb=1&fs=1&hl=en&iv_load_policy=3&modestbranding=1&origin=*&start=0`;
        isVideoPaused = false;
        videoPlayer.style.opacity = '1';
      }
    }

    // Enhanced Intersection Observer with fallback for deployment issues
    function setupIntersectionObserver() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: Auto-play after a short delay if IntersectionObserver is not supported
        setTimeout(() => {
          loadAndPlayVideoWithFallback();
        }, 2000);
        return;
      }

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0] // Multiple thresholds for better control
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
          
          if (isVisible && !hasAutoPlayed) {
            // Section becomes visible for the first time - load and play video
            loadAndPlayVideoWithFallback();
          } else if (isVisible && isVideoPaused) {
            // Section becomes visible again - resume video
            resumeVideo();
          } else if (!isVisible && hasAutoPlayed && !isVideoPaused) {
            // Section is no longer visible - pause video
            pauseVideo();
          }
        });
      }, observerOptions);

      // Observe the GPS section
      const gpsSection = document.querySelector('.gps-section');
      if (gpsSection) {
        observer.observe(gpsSection);
        // Additional fallback: Try auto-play after 5 seconds regardless
        setTimeout(() => {
          if (!hasAutoPlayed) {
            loadAndPlayVideoWithFallback();
          }
        }, 5000);
        
      } else {
        // Immediate fallback if section not found
        setTimeout(() => {
          loadAndPlayVideoWithFallback();
        }, 2000);
      }
    }

    // GitHub Pages specific video loading with multiple fallbacks
    function loadAndPlayVideoWithFallback() {
      try {
        // Try auto-play first
        loadAndPlayVideo();
      } catch (error) {
        // GitHub Pages fallback: No autoplay, basic embed
        const videoId = videoThumbnail.getAttribute('data-video-id');
        if (videoId) {
          // Remove existing iframe if any
          if (videoIframe && videoIframe.parentNode) {
            videoIframe.parentNode.removeChild(videoIframe);
          }
          
          videoIframe = document.createElement('iframe');
          // GitHub Pages compatible - absolute minimal YouTube URL
          videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
          videoIframe.title = 'GPS / Geo Fencing Attendance Video';
          videoIframe.frameBorder = '0';
          videoIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
          videoIframe.allowFullscreen = true;
          videoIframe.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 25px;
            background: #000;
          `;
          
          videoPlayer.innerHTML = '';
          videoPlayer.appendChild(videoIframe);
          videoPlayer.classList.add('active');
          videoThumbnail.style.opacity = '0';
          videoThumbnail.style.transform = 'scale(0.95)';
          
          isVideoLoaded = true;
          hasAutoPlayed = true;
          isVideoPaused = false;
          
          // Enhanced load event for debugging
          videoIframe.addEventListener('load', function() {});
          
          videoIframe.addEventListener('error', function() {});
        }
      }
    }

    // Initialize Intersection Observer
    setupIntersectionObserver();

    // Add smooth hover effect and manual fallback trigger
    videoContainer.addEventListener('mouseenter', function() {
      if (!isVideoLoaded) {
        videoContainer.style.transform = 'scale(1.02)';
      }
    });

    videoContainer.addEventListener('mouseleave', function() {
      if (!isVideoLoaded) {
        videoContainer.style.transform = 'scale(1)';
      }
    });

    // Manual fallback trigger - click on thumbnail to load video
    videoThumbnail.addEventListener('click', function() {
      loadAndPlayVideoWithFallback();
    });
  }

  // ===== CONTACT FORM SECTION =====
  // Functions related to the Stellar Contact Form, validation, floating labels, and form handling

  function initializeStellarContactForm() {
    const stellarForm = document.getElementById('stellarContactForm');
    
    if (!stellarForm) {
      return;
    }

    const formMessage = document.getElementById('formMessage');
    const submitBtn = stellarForm.querySelector('.stellar-btn');

    if (!formMessage || !submitBtn) {
      return;
    }

    // Form initialized successfully

    // Form submission
    stellarForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const companyName = document.getElementById('companyName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const employees = document.getElementById('employees').value;

      // Get checkbox value
      const agreeTerms = document.getElementById('agreeTerms').checked;

      // Basic validation
      if (!firstName || !lastName || !companyName || !email || !phone || !employees) {
        showFormMessage('Please fill in all required fields', 'error');
        return;
      }

      // Check if terms are agreed to
      if (!agreeTerms) {
        showFormMessage('Please agree to the Privacy Policy to continue', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
      }

      // Phone validation
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        showFormMessage('Please enter a valid phone number', 'error');
        return;
      }

      // Show loading state
      submitBtn.innerHTML = '<span class="btn-text">Processing...</span><div class="btn-shine"></div>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.8';

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = '<span class="btn-text">Get Free Demo</span><div class="btn-shine"></div>';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';

        // Show success message
        showFormMessage('Thank you! We\'ll contact you within 24 hours to schedule your demo.', 'success');

        // Reset form
        stellarForm.reset();

        // Reset floating labels
        resetFloatingLabels();

        // Hide message after 5 seconds
        setTimeout(() => {
          hideFormMessage();
        }, 5000);
      }, 2000);
    });
  }

  function initializeFloatingLabels() {
    // Get all input fields and selects
    const inputFields = document.querySelectorAll('.input-field input, .input-field select');

    inputFields.forEach(field => {
      // Add focus event listeners
      field.addEventListener('focus', function() {
        this.parentNode.classList.add('focused');
      });

      field.addEventListener('blur', function() {
        if (!this.value) {
          this.parentNode.classList.remove('focused');
        }
      });

      // Check if field has value on page load
      if (field.value) {
        field.parentNode.classList.add('focused');
      }

      // Add input event for real-time validation
      field.addEventListener('input', function() {
        validateStellarField(this);
      });
    });
  }

  function validateStellarField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;

    // Remove previous validation classes
    field.classList.remove('error', 'success');

    // Basic validation
    if (!value) {
      field.classList.add('error');
      return false;
    }

    // Email validation
    if (fieldType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add('error');
        return false;
      }
    }

    // Phone validation
    if (fieldId === 'phone') {
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
        field.classList.add('error');
        return false;
      }
    }

    // Name validation (minimum length)
    if ((fieldId === 'firstName' || fieldId === 'lastName' || fieldId === 'companyName') && value.length < 2) {
      field.classList.add('error');
      return false;
    }

    // Show success state
    field.classList.add('success');
    return true;
  }

  function resetFloatingLabels() {
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach(field => {
      field.classList.remove('focused');
    });
  }

  function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    const messageContent = formMessage.querySelector('.message-content');

    if (type === 'success') {
      formMessage.classList.add('show');
      formMessage.classList.remove('error');
      formMessage.classList.add('success');
    } else {
      formMessage.classList.add('show');
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
    }

    // Update message content
    messageContent.querySelector('p').textContent = message;
  }

  function hideFormMessage() {
    const formMessage = document.getElementById('formMessage');
    formMessage.classList.remove('show', 'success', 'error');
  }

  // Global function for closing message (called from HTML)
  function closeMessage() {
    hideFormMessage();
  }

  // Additional form validation and utility functions

  function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;

    // Remove previous validation classes
    field.classList.remove('error', 'success');

    // Basic validation
    if (!value) {
      showFieldError(field, 'This field is required');
      return false;
    }

    // Email validation
    if (fieldType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }

    // Phone validation
    if (fieldName === 'contactNumber') {
      const phoneRegex = /^[0-9]{10,}$/;
      if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
      }
    }

    // Name validation (minimum length)
    if ((fieldName === 'firstName' || fieldName === 'lastName' || fieldName === 'companyName') && value.length < 2) {
      showFieldError(field, 'Please enter at least 2 characters');
      return false;
    }

    // Show success state
    field.classList.add('success');
    return true;
  }

  function showFieldError(field, message) {
    field.classList.add('error');

    // Create or update error message
    let errorMsg = field.parentNode.querySelector('.field-error');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'field-error';
      errorMsg.style.cssText = `
        color: #e74c3c;
        font-size: 12px;
        margin-top: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
        font-weight: 500;
      `;
      field.parentNode.appendChild(errorMsg);
    }

    errorMsg.textContent = message;

    // Show error message with animation
    setTimeout(() => {
      errorMsg.style.opacity = '1';
    }, 10);
  }

  function showMessage(showMsg, hideMsg) {
    hideMsg.classList.remove('show');
    showMsg.classList.add('show');
  }

  function hideMessage(hideMsg1, hideMsg2) {
    hideMsg1.classList.remove('show');
    hideMsg2.classList.remove('show');
  }

  function resetFormStyling(fields) {
    fields.forEach(field => {
      field.classList.remove('error', 'success');
      const errorMsg = field.parentNode.querySelector('.field-error');
      if (errorMsg) {
        errorMsg.style.opacity = '0';
        setTimeout(() => errorMsg.remove(), 300);
      }
    });
  }

  // Additional validation for modern form
  function validateModernForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const companyName = document.getElementById('companyName').value.trim();
    const staffSize = document.getElementById('staffSize').value;
    const officeEmail = document.getElementById('officeEmail').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();

    // Check if all required fields are filled
    if (!firstName || !lastName || !companyName || !staffSize || !officeEmail || !contactNumber) {
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(officeEmail)) {
      return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(contactNumber.replace(/\s+/g, ''))) {
      return false;
    }

    return true;
  }

  // ===== REVIEW SECTION =====
  // Functions related to the Review Carousel

  function initializeReviewSection() {
    const reviewWrapper = document.querySelector('.review-wrapper');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    if (!reviewWrapper || reviewCards.length === 0) {
      return;
    }

    let currentIndex = 2; // Start with middle (index 2 for 0-based, to match HTML active)
    const totalCards = reviewCards.length;

    // Set initial position
    updateReviewPosition();

    // Add resize listener for responsive centering
    window.addEventListener('resize', updateReviewPosition);

    // Next button
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateReviewPosition();
    });

    // Prev button
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateReviewPosition();
    });

    function updateReviewPosition() {
      // Check if mobile view (single card display)
      const isMobile = window.innerWidth <= 767;

      if (isMobile) {
        // Mobile: Show single card, center it
        reviewCards.forEach((card, index) => {
          card.classList.remove('active');
          if (index === currentIndex) {
            card.classList.add('active');
          }
        });
        // No transform needed for mobile - CSS handles centering
        reviewWrapper.style.transform = 'translateX(0)';
      } else {
        // Desktop: Show multiple cards with carousel effect
        // Calculate dynamic card width and gap
        const firstCard = reviewCards[0];
        const secondCard = reviewCards[1];
        const gap = secondCard.offsetLeft - firstCard.offsetLeft - firstCard.offsetWidth;
        const cardWidth = firstCard.offsetWidth;

        // Calculate container center
        const containerWidth = reviewWrapper.parentElement.offsetWidth;
        const containerCenter = containerWidth / 2;

        // Calculate translate to center the active card
        const activeCenter = currentIndex * (cardWidth - 4.47*gap) + cardWidth / 2;
        const translateX = - (activeCenter - containerCenter);
        reviewWrapper.style.transform = `translateX(${translateX}px)`;

        // Update active class
        reviewCards.forEach((card, index) => {
          card.classList.remove('active');
          if (index === currentIndex) {
            card.classList.add('active');
          }
        });
      }
    }
  }

  // ===== GLOBAL INITIALIZATION =====
  // DOM event listeners and general setup

  // All initializations are already called in the main DOMContentLoaded event above
