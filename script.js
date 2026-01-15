/* =====================================================
   YC COACHING - JAVASCRIPT 2025
   Interactions modernes et fluides
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // =====================================================
    // MOBILE MENU
    // =====================================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =====================================================
    // HERO SLIDER
    // =====================================================
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const mobileDots = document.querySelectorAll('.mobile-dot');
    const progressBar = document.querySelector('.progress-bar');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');

    let currentSlide = 0;
    const slideInterval = 10000; // 10 secondes
    let autoplayInterval;
    let isPaused = false;

    function showSlide(index) {
        // Gérer le bouclage
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Retirer active de tous les éléments
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        mobileDots.forEach(dot => dot.classList.remove('active'));

        // Reset progress bar
        if (progressBar) {
            progressBar.style.animation = 'none';
            progressBar.offsetHeight; // Trigger reflow
            progressBar.style.animation = 'progressBar 10s linear forwards';
            if (isPaused) {
                progressBar.style.animationPlayState = 'paused';
            }
        }

        // Activer les éléments courants
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
        if (mobileDots[currentSlide]) mobileDots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, slideInterval);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        if (!isPaused) {
            startAutoplay();
        }
    }

    // Event listeners pour la navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    // Indicateurs cliquables
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    mobileDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            isPaused = true;
            clearInterval(autoplayInterval);
            if (progressBar) {
                progressBar.style.animationPlayState = 'paused';
            }
        });

        sliderContainer.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoplay();
            if (progressBar) {
                progressBar.style.animationPlayState = 'running';
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
            resetAutoplay();
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide();
            resetAutoplay();
        }
    }

    // Démarrer l'autoplay
    if (slides.length > 0) {
        startAutoplay();
    }

    // =====================================================
    // STATS COUNTER ANIMATION
    // =====================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });

        statsAnimated = true;
    }

    // Observer pour déclencher l'animation des stats
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // =====================================================
    // TRANSFORMATIONS SLIDER
    // =====================================================
    const transTrack = document.querySelector('.transformations-track');
    const transPrevBtn = document.querySelector('.trans-nav-btn.prev');
    const transNextBtn = document.querySelector('.trans-nav-btn.next');

    if (transTrack && transPrevBtn && transNextBtn) {
        const cardWidth = 370; // largeur carte + gap

        transPrevBtn.addEventListener('click', () => {
            transTrack.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        });

        transNextBtn.addEventListener('click', () => {
            transTrack.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        });
    }

    // =====================================================
    // SCROLL ANIMATIONS (AOS-like)
    // =====================================================
    const animatedElements = document.querySelectorAll('[data-aos]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // =====================================================
    // SMOOTH SCROLL
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================================================
    // FORM HANDLING - Formspree
    // =====================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupérer les données du formulaire
            const formData = new FormData(this);
            const formAction = this.getAttribute('action');

            // Animation du bouton
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                Envoi en cours...
            `;
            submitBtn.disabled = true;

            // Envoi à Formspree
            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 13l4 4L19 7"/>
                        </svg>
                        Message envoyé !
                    `;
                    submitBtn.style.background = '#10b981';
                    contactForm.reset();

                    // Reset après 3 secondes
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            })
            .catch(error => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Erreur, réessayez
                `;
                submitBtn.style.background = '#ef4444';

                // Reset après 3 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // =====================================================
    // PARALLAX EFFECT (subtle)
    // =====================================================
    const parallaxElements = document.querySelectorAll('.slide-background');

    if (parallaxElements.length > 0 && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const rate = scrolled * 0.3;
                el.style.transform = `translateY(${rate}px) scale(1.1)`;
            });
        });
    }

    // =====================================================
    // CURSOR EFFECT (optionnel - desktop only)
    // =====================================================
    if (window.innerWidth > 1024) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
        document.body.appendChild(cursor);

        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorOutline = cursor.querySelector('.cursor-outline');

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .service-card, .programme-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });

        // Add styles for custom cursor
        const cursorStyles = document.createElement('style');
        cursorStyles.textContent = `
            .custom-cursor {
                pointer-events: none;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s;
            }
            .cursor-outline {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, border-color 0.2s;
            }
            .custom-cursor.hover .cursor-dot {
                width: 12px;
                height: 12px;
            }
            .custom-cursor.hover .cursor-outline {
                width: 60px;
                height: 60px;
                border-color: rgba(137, 21, 52, 0.8);
            }
            @media (max-width: 1024px) {
                .custom-cursor { display: none; }
            }
        `;
        document.head.appendChild(cursorStyles);
    }

    // =====================================================
    // LOADING ANIMATION
    // =====================================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Animate first slide elements
        setTimeout(() => {
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                activeSlide.classList.add('animated');
            }
        }, 100);
    });

    // =====================================================
    // LAZY LOADING IMAGES
    // =====================================================
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // =====================================================
    // DROPDOWN MENU ACCESSIBILITY
    // =====================================================
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');

        if (link && dropdown) {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dropdown.classList.toggle('show');
                }
            });
        }
    });

    // =====================================================
    // PREFERS REDUCED MOTION
    // =====================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Désactiver les animations pour les utilisateurs qui préfèrent moins de mouvement
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');

        // Arrêter l'autoplay du slider
        clearInterval(autoplayInterval);
    }

    console.log('YC Coaching - Site initialized successfully');
});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
