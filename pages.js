/* =====================================================
   YC COACHING - JAVASCRIPT PAGES SERVICES
   Interactions spécifiques aux pages intérieures
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {

    // =====================================================
    // FAQ ACCORDION
    // =====================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Fermer tous les autres
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle l'item actuel
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isActive);
            });
        }
    });

    // =====================================================
    // VIDEO PLAYER
    // =====================================================
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const playButton = document.getElementById('playButton');

    if (videoPlaceholder && playButton) {
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            loadVideo();
        });

        videoPlaceholder.addEventListener('click', loadVideo);
    }

    function loadVideo() {
        const container = videoPlaceholder.parentElement;

        // Détecter quelle page est active pour charger la bonne vidéo
        const currentPage = window.location.pathname;
        let videoSrc = 'videos/video-accueil-1.mov'; // Vidéo par défaut

        if (currentPage.includes('coaching-domicile')) {
            videoSrc = 'videos/video-coaching-a-domicile.mov';
        } else if (currentPage.includes('coaching-distance')) {
            videoSrc = 'videos/video-coaching-distance.mov';
        } else if (currentPage.includes('qui-sommes-nous')) {
            videoSrc = 'videos/video-qui-sommes-nous.mov';
        }

        // Créer l'élément vidéo avec les fichiers locaux
        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.aspectRatio = '16/9';
        video.style.borderRadius = 'var(--radius-xl)';
        video.style.objectFit = 'cover';

        // Masquer le placeholder et afficher la vidéo
        videoPlaceholder.style.display = 'none';
        container.appendChild(video);
    }

    // =====================================================
    // TRANSFORMATIONS SLIDER (Pages)
    // =====================================================
    const transTrack = document.getElementById('transformationsTrack');
    const transPrevBtn = document.querySelector('.transformations-section .trans-nav-btn.prev');
    const transNextBtn = document.querySelector('.transformations-section .trans-nav-btn.next');

    if (transTrack && transPrevBtn && transNextBtn) {
        const scrollAmount = 370; // Largeur carte + gap

        transPrevBtn.addEventListener('click', () => {
            transTrack.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        transNextBtn.addEventListener('click', () => {
            transTrack.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Drag to scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        transTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            transTrack.classList.add('grabbing');
            startX = e.pageX - transTrack.offsetLeft;
            scrollLeft = transTrack.scrollLeft;
        });

        transTrack.addEventListener('mouseleave', () => {
            isDown = false;
            transTrack.classList.remove('grabbing');
        });

        transTrack.addEventListener('mouseup', () => {
            isDown = false;
            transTrack.classList.remove('grabbing');
        });

        transTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - transTrack.offsetLeft;
            const walk = (x - startX) * 2;
            transTrack.scrollLeft = scrollLeft - walk;
        });
    }

    // =====================================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================================
    const revealElements = document.querySelectorAll(
        '.advantage-card, .feature-item, .faq-item, .testimonial-card-large, .testimonial-card-small'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // =====================================================
    // SECTION NUMBERS ANIMATION
    // =====================================================
    const sectionNumbers = document.querySelectorAll('.section-number');

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    sectionNumbers.forEach(num => {
        num.style.opacity = '0';
        num.style.transform = 'translateX(-30px)';
        num.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(num);
    });

    // =====================================================
    // SMOOTH SCROLL FOR PAGE ANCHORS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================================================
    // PARALLAX EFFECT ON HERO
    // =====================================================
    const pageHeroBackground = document.querySelector('.page-hero-background img');

    if (pageHeroBackground && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.page-hero').offsetHeight;

            if (scrolled < heroHeight) {
                const rate = scrolled * 0.4;
                pageHeroBackground.style.transform = `translateY(${rate}px) scale(1.05)`;
            }
        });
    }

    // =====================================================
    // FORM VALIDATION & SUBMISSION
    // =====================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        function validateField(field) {
            const isValid = field.checkValidity();

            if (!isValid && field.value.trim() !== '') {
                field.classList.add('error');
                field.classList.remove('valid');
            } else if (field.value.trim() !== '') {
                field.classList.remove('error');
                field.classList.add('valid');
            } else {
                field.classList.remove('error', 'valid');
            }
        }

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all fields
            let isFormValid = true;
            inputs.forEach(input => {
                if (input.required && !input.checkValidity()) {
                    input.classList.add('error');
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                // Scroll to first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
                return;
            }

            // Animation du bouton
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                Envoi en cours...
            `;
            submitBtn.disabled = true;
            submitBtn.style.pointerEvents = 'none';

            // Simuler l'envoi (remplacer par votre logique)
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                    Message envoyé !
                `;
                submitBtn.style.background = '#10b981';

                // Reset après 3 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    submitBtn.style.pointerEvents = '';
                    contactForm.reset();

                    // Remove valid classes
                    inputs.forEach(input => {
                        input.classList.remove('valid');
                    });
                }, 3000);
            }, 1500);
        });
    }

    // Add CSS for form validation states
    const validationStyles = document.createElement('style');
    validationStyles.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
        }

        .form-group input.valid,
        .form-group select.valid,
        .form-group textarea.valid {
            border-color: #10b981 !important;
        }

        .spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .transformations-track {
            cursor: grab;
        }

        .transformations-track.grabbing {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(validationStyles);

    // =====================================================
    // TESTIMONIALS HOVER EFFECT
    // =====================================================
    const testimonialCards = document.querySelectorAll('.testimonial-card-large, .testimonial-card-small');

    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    console.log('YC Coaching Pages - Initialized');
});
