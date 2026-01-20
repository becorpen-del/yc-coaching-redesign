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

        // Mobile dropdown toggle
        const mobileDropdownToggles = mobileMenu.querySelectorAll('.mobile-dropdown-toggle');
        mobileDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.closest('.mobile-nav-dropdown');
                dropdown.classList.toggle('active');
            });
        });

        // Close menu on link click (excluding dropdown toggles)
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle), .mobile-dropdown-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =====================================================
    // HERO SLIDER - Progress bar avec requestAnimationFrame
    // =====================================================
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const mobileDots = document.querySelectorAll('.mobile-dot');
    const progressBar = document.querySelector('.progress-bar');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');

    let currentSlide = 0;
    const slideDuration = 10000; // 10 secondes
    let isPaused = false;
    let progressStartTime = null;
    let progressAnimationId = null;
    let pausedProgress = 0;

    // Animation fluide de la progress bar avec requestAnimationFrame
    function animateProgressBar(timestamp) {
        if (!progressBar || isPaused) return;

        if (!progressStartTime) {
            progressStartTime = timestamp - (pausedProgress * slideDuration);
        }

        const elapsed = timestamp - progressStartTime;
        const progress = Math.min(elapsed / slideDuration, 1);

        progressBar.style.width = `${progress * 100}%`;

        if (progress < 1) {
            progressAnimationId = requestAnimationFrame(animateProgressBar);
        } else {
            // Slide terminé, passer au suivant
            nextSlide();
        }
    }

    function startProgressAnimation() {
        if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
        }
        progressStartTime = null;
        pausedProgress = 0;
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        progressAnimationId = requestAnimationFrame(animateProgressBar);
    }

    function pauseProgressAnimation() {
        if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
            progressAnimationId = null;
        }
        // Sauvegarder la progression actuelle
        if (progressBar) {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            pausedProgress = currentWidth / 100;
        }
        progressStartTime = null;
    }

    function resumeProgressAnimation() {
        progressStartTime = null;
        progressAnimationId = requestAnimationFrame(animateProgressBar);
    }

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

        // Activer les éléments courants
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
        if (mobileDots[currentSlide]) mobileDots[currentSlide].classList.add('active');

        // Redémarrer la progress bar
        if (!isPaused) {
            startProgressAnimation();
        } else {
            // Si en pause, reset la barre à 0 mais ne pas animer
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            pausedProgress = 0;
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event listeners pour la navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }

    // Indicateurs cliquables
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });

    mobileDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            isPaused = true;
            pauseProgressAnimation();
        });

        sliderContainer.addEventListener('mouseleave', () => {
            isPaused = false;
            resumeProgressAnimation();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
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
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }

    // Démarrer le slider
    if (slides.length > 0) {
        startProgressAnimation();
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
    // TRANSFORMATIONS SLIDER (Amélioré avec drag + auto-scroll)
    // =====================================================
    function initTransformationsSlider(container) {
        const track = container.querySelector('.transformations-track');
        // Chercher les boutons dans le parent (section)
        const section = container.closest('section') || container.parentElement;
        const prevBtn = section.querySelector('.trans-nav-btn.prev');
        const nextBtn = section.querySelector('.trans-nav-btn.next');

        if (!track) {
            console.log('Transformations: track not found');
            return;
        }

        const cards = track.querySelectorAll('.transformation-card');
        if (cards.length === 0) {
            console.log('Transformations: no cards found');
            return;
        }

        console.log('Transformations slider initialized with', cards.length, 'cards');

        // Variables pour le drag
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        let velX = 0;
        let momentumID = null;
        let autoScrollID = null;
        let isHovering = false;

        // Calculer la largeur d'une carte
        const getCardWidth = () => {
            const card = cards[0];
            const style = window.getComputedStyle(card);
            const marginRight = parseInt(style.marginRight) || 0;
            return card.offsetWidth + marginRight + 20;
        };

        // Auto-scroll
        const autoScrollSpeed = 1; // pixels par frame

        function startAutoScroll() {
            if (autoScrollID || isDragging || isHovering) return;
            autoScrollID = requestAnimationFrame(autoScrollLoop);
        }

        function stopAutoScroll() {
            if (autoScrollID) {
                cancelAnimationFrame(autoScrollID);
                autoScrollID = null;
            }
        }

        function autoScrollLoop() {
            if (isDragging || isHovering) {
                autoScrollID = null;
                return;
            }

            track.scrollLeft += autoScrollSpeed;

            // Reset quand on atteint la fin
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll) {
                track.scrollLeft = 0;
            }

            autoScrollID = requestAnimationFrame(autoScrollLoop);
        }

        // Pause au survol
        track.addEventListener('mouseenter', () => {
            isHovering = true;
            stopAutoScroll();
        });

        track.addEventListener('mouseleave', () => {
            isHovering = false;
            if (!isDragging) {
                setTimeout(startAutoScroll, 1000);
            }
        });

        // Flèches de navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoScroll();
                const cardWidth = getCardWidth();
                track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                setTimeout(startAutoScroll, 3000);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoScroll();
                const cardWidth = getCardWidth();
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
                setTimeout(startAutoScroll, 3000);
            });
        }

        // Drag avec la souris
        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            track.classList.add('dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            stopAutoScroll();
            cancelMomentum();
        });

        track.addEventListener('mouseup', (e) => {
            isDragging = false;
            track.classList.remove('dragging');
            beginMomentum();
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            const prevScrollLeft = track.scrollLeft;
            track.scrollLeft = scrollLeft - walk;
            velX = track.scrollLeft - prevScrollLeft;
        });

        // Touch events pour mobile
        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            stopAutoScroll();
            startX = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            cancelMomentum();
        }, { passive: true });

        track.addEventListener('touchend', () => {
            isDragging = false;
            beginMomentum();
            setTimeout(startAutoScroll, 3000);
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            const prevScrollLeft = track.scrollLeft;
            track.scrollLeft = scrollLeft - walk;
            velX = track.scrollLeft - prevScrollLeft;
        }, { passive: true });

        // Momentum / inertie
        function beginMomentum() {
            cancelMomentum();
            momentumID = requestAnimationFrame(momentumLoop);
        }

        function cancelMomentum() {
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
            }
        }

        function momentumLoop() {
            track.scrollLeft += velX;
            velX *= 0.95;
            if (Math.abs(velX) > 0.5) {
                momentumID = requestAnimationFrame(momentumLoop);
            }
        }

        // Empêcher la sélection de texte pendant le drag
        track.addEventListener('dragstart', (e) => e.preventDefault());

        // Démarrer l'auto-scroll quand le slider est visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(container);

        console.log('Auto-scroll configured');
    }

    // Initialiser tous les sliders de transformations sur la page
    document.querySelectorAll('.transformations-slider').forEach(initTransformationsSlider);

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
