/**
 * Smooth Website Template - Master Interactive & Animation Controller
 * Powered by GSAP, ScrollTrigger, and Lenis Smooth Scroll
 */

(function () {
    'use strict';

    var lenis = null;

    // Wait until DOM and libraries are fully loaded
    function init() {
        initLenis();
        initComparisonSlider();
        initMobileMenu();
        initNavbarScroll();
        initAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ----------------------------------------------------
    // 1. LENIS SMOOTH INERTIAL SCROLLING
    // ----------------------------------------------------
    function initLenis() {
        if (typeof Lenis === 'undefined') return;

        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1.5,
                infinite: false
            });

            window.lenis = lenis;

            // Synchronize Lenis with GSAP ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
            }

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            if (typeof gsap !== 'undefined') {
                gsap.ticker.lagSmoothing(0);
            }
        } catch (e) {
            console.warn("Lenis initialization error:", e);
        }
    }

    // ----------------------------------------------------
    // 2. GSAP SCROLL & INTRO ANIMATIONS
    // ----------------------------------------------------
    function initAnimations() {
        if (typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // --- A. INTRO PRELOADER ANIMATION ---
        const loader = document.getElementById('loader');
        const loaderTitle = document.querySelector('.loader-title');
        const growCircle = document.querySelector('.grow-circle');

        function cleanupLoader() {
            if (loader) {
                loader.style.pointerEvents = 'none';
                loader.style.display = 'none';
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }
            playHeroIntro();
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }

        if (loader && loaderTitle && growCircle) {
            loader.style.pointerEvents = 'none';
            const safetyTimer = setTimeout(cleanupLoader, 2500);

            const preloaderTl = gsap.timeline({
                onComplete: function () {
                    clearTimeout(safetyTimer);
                    cleanupLoader();
                }
            });

            preloaderTl
                .to(loaderTitle, {
                    duration: 0.8,
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    ease: 'power4.out',
                    delay: 0.1
                })
                .to(growCircle, {
                    duration: 1.1,
                    scale: 6,
                    ease: 'power2.inOut'
                }, '+=0.1')
                .to(loaderTitle, {
                    duration: 0.5,
                    opacity: 0,
                    y: -50,
                    filter: 'blur(10px)',
                    ease: 'power4.inOut'
                }, '<')
                .to(loader, {
                    duration: 0.6,
                    opacity: 0,
                    filter: 'blur(12px)',
                    ease: 'power4.inOut'
                }, '-=0.3');
        } else {
            playHeroIntro();
        }

        // --- B. HERO INTRO ANIMATION ---
        function playHeroIntro() {
            const heroTl = gsap.timeline();

            // Set initial hero states
            gsap.set('#glow', { opacity: 0 });
            gsap.set('#circle', { opacity: 0, scale: 0 });
            gsap.set('#title', { opacity: 0, y: 50 });
            gsap.set('#subtitle', { opacity: 0, x: -50 });
            gsap.set('#cta', { opacity: 0, x: 50 });
            gsap.set('#slider', { opacity: 0, y: 50 });
            gsap.set('#carousel', { opacity: 0, y: 50 });

            heroTl
                .to('#glow', {
                    duration: 1.2,
                    opacity: 1,
                    ease: 'power4.inOut'
                })
                .to('#circle', {
                    duration: 1.0,
                    opacity: 1,
                    scale: 1,
                    ease: 'back.out(1.4)'
                }, '-=0.8')
                .to('#title', {
                    duration: 0.8,
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out'
                }, '-=0.6')
                .to('#subtitle', {
                    duration: 0.6,
                    opacity: 1,
                    x: 0,
                    ease: 'power3.out'
                }, '-=0.5')
                .to('#cta', {
                    duration: 0.6,
                    opacity: 1,
                    x: 0,
                    ease: 'power3.out'
                }, '-=0.5')
                .to('#slider', {
                    duration: 0.8,
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out'
                }, '-=0.4')
                .to('#carousel', {
                    duration: 0.8,
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    onComplete: function () {
                        if (typeof ScrollTrigger !== 'undefined') {
                            ScrollTrigger.refresh();
                        }
                    }
                }, '-=0.5');
        }

        if (typeof ScrollTrigger === 'undefined') return;

        // --- C. HERO SCROLL PARALLAX (Scrub) ---
        const heroSection = document.querySelector('section');
        if (heroSection) {
            gsap.to('#title', {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.9
                },
                yPercent: -120
            });

            gsap.to('#subtitle', {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2
                },
                scale: 1.15,
                opacity: 0,
                yPercent: -80
            });

            gsap.to('#cta', {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2
                },
                y: 150,
                opacity: 0
            });

            gsap.to('#slider', {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.9
                },
                scale: 1.12
            });

            gsap.to('#circle', {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.9
                },
                scale: 0.5
            });

            gsap.to('#carousel', {
                scrollTrigger: {
                    trigger: '#carousel',
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1.9
                },
                y: 120,
                opacity: 0
            });
        }

        // --- D. INFORMATION SECTION SCROLL REVEAL ---
        const infoSection = document.getElementById('information-section');
        if (infoSection) {
            gsap.from('#information-section #heading h1, #information-section #subheading p', {
                scrollTrigger: {
                    trigger: '#information-section #header',
                    start: 'top 85%',
                    end: 'bottom 80%',
                    scrub: 1.1
                },
                stagger: 0.3,
                scaleY: 1.1,
                opacity: 0,
                y: '80px'
            });

            gsap.from('#card-1, #card-2, #card-3', {
                scrollTrigger: {
                    trigger: '#cards',
                    start: 'top 75%',
                    end: 'top+=400 center',
                    scrub: 1.2
                },
                stagger: 0.25,
                opacity: 0,
                y: '100px'
            });
        }

        // --- E. CLOUD 3D CONTAINER SCROLL ANIMATION ---
        const cloudContainer = document.getElementById('cloud-container');
        const cloudCard = document.getElementById('cloud-card-wrapper');
        const cloudTitle = document.getElementById('cloud-title-container');

        if (cloudContainer && cloudCard) {
            let mm = gsap.matchMedia();

            // Desktop / Tablet (>768px): 3D Perspective Tilt & Vertical Title Parallax
            mm.add("(min-width: 769px)", () => {
                gsap.set(cloudCard, {
                    transformOrigin: 'top center',
                    transformPerspective: 1000,
                    rotateX: 25,
                    scale: 1.05
                });

                // Scrub card tilt from 25deg -> -15deg and scale from 1.05 -> 1.0
                gsap.to(cloudCard, {
                    scrollTrigger: {
                        trigger: cloudContainer,
                        start: 'top 70%',
                        end: 'bottom 40%',
                        scrub: 1
                    },
                    rotateX: -15,
                    scale: 1.0,
                    ease: 'none'
                });

                if (cloudTitle) {
                    // Title component elevates upward as user scrolls
                    gsap.to(cloudTitle, {
                        scrollTrigger: {
                            trigger: cloudContainer,
                            start: 'top 70%',
                            end: 'bottom 40%',
                            scrub: 1
                        },
                        y: -100,
                        ease: 'none'
                    });
                }
            });

            // Mobile (<=768px): Flat orientation, responsive scale
            mm.add("(max-width: 768px)", () => {
                gsap.set(cloudCard, {
                    transformOrigin: 'top center',
                    rotateX: 0,
                    scale: 1
                });
                if (cloudTitle) {
                    gsap.set(cloudTitle, { y: 0 });
                }
            });
        }

        // Cloud Features Grid Scroll Reveal
        const cloudFeatures = document.getElementById('cloud-features-grid');
        if (cloudFeatures) {
            gsap.from('#cloud-features-grid > div', {
                scrollTrigger: {
                    trigger: cloudFeatures,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1
                },
                stagger: 0.1,
                opacity: 0,
                y: 50
            });
        }

        // --- F. DESKTOP SECTION SCROLL REVEAL ---
        const desktopSection = document.getElementById('upscayl-desktop-section');
        if (desktopSection) {
            gsap.from('#upscayl-desktop-section #heading h1, #upscayl-desktop-section #subheading p', {
                scrollTrigger: {
                    trigger: desktopSection,
                    start: 'top 80%',
                    end: 'top+=250 center',
                    scrub: 1.1
                },
                stagger: 0.2,
                opacity: 0,
                y: '80px'
            });

            gsap.from('#showcase-image', {
                scrollTrigger: {
                    trigger: desktopSection,
                    start: 'top 70%',
                    end: 'top+=500 center',
                    scrub: 1.1
                },
                scale: 0.9,
                opacity: 0,
                y: '100px'
            });
        }

        // --- G. RUNNING TEXT DIVIDER SCRUB ---
        const runningTracks = gsap.utils.toArray('.running-text');
        runningTracks.forEach((track) => {
            gsap.to(track, {
                scrollTrigger: {
                    trigger: track,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 3
                },
                x: '-20%'
            });
        });

        // --- H. BOTTOM CTA SECTION STAGGER REVEAL ---
        const bottomCta = document.querySelector('.bottom-cta-container') || document.getElementById('text-1')?.closest('div');
        if (bottomCta) {
            gsap.from('#text-1, #text-2, #text-3, #button', {
                scrollTrigger: {
                    trigger: bottomCta,
                    start: 'top 85%',
                    end: 'bottom 75%',
                    scrub: 1.1
                },
                stagger: 0.2,
                opacity: 0,
                y: '60px'
            });
        }

        // Refresh triggers on resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });
    }

    // ----------------------------------------------------
    // 3. IMAGE COMPARISON SLIDER
    // ----------------------------------------------------
    function initComparisonSlider() {
        const sliderContainer = document.querySelector('[data-rcs="root"]');
        const handleContainer = document.querySelector('[data-rcs="handle-container"]');
        const clipItem = document.querySelector('[data-rcs="clip-item"]');

        if (!sliderContainer || !handleContainer || !clipItem) return;

        let isDragging = false;

        function updateSlider(percent) {
            const clamped = Math.max(0, Math.min(100, percent));
            handleContainer.style.left = clamped + '%';
            handleContainer.setAttribute('aria-valuenow', Math.round(clamped));
            clipItem.style.clipPath = `inset(0px 0px 0px ${clamped}%)`;
        }

        function getPercentFromPointer(e) {
            const rect = sliderContainer.getBoundingClientRect();
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const x = clientX - rect.left;
            return (x / rect.width) * 100;
        }

        function startDrag(e) {
            isDragging = true;
            sliderContainer.style.cursor = 'ew-resize';
            updateSlider(getPercentFromPointer(e));
            e.preventDefault();
        }

        function onMove(e) {
            if (!isDragging) return;
            updateSlider(getPercentFromPointer(e));
        }

        function stopDrag() {
            if (isDragging) {
                isDragging = false;
                sliderContainer.style.cursor = '';
            }
        }

        sliderContainer.addEventListener('pointerdown', startDrag);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', stopDrag);
        window.addEventListener('pointercancel', stopDrag);

        // Keyboard navigation (ArrowLeft / ArrowRight)
        handleContainer.addEventListener('keydown', function (e) {
            const current = parseFloat(handleContainer.getAttribute('aria-valuenow') || '50');
            const step = e.shiftKey ? 10 : 2;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                updateSlider(current - step);
                e.preventDefault();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                updateSlider(current + step);
                e.preventDefault();
            }
        });
    }

    // ----------------------------------------------------
    // 4. RESPONSIVE MOBILE MENU DRAWER
    // ----------------------------------------------------
    function initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const drawer = document.getElementById('mobile-drawer');
        const overlay = document.getElementById('mobile-drawer-overlay');
        const closeBtn = document.getElementById('mobile-drawer-close');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        function openDrawer() {
            if (!drawer || !overlay) return;
            drawer.style.display = 'flex';
            overlay.style.display = 'block';
            setTimeout(function () {
                drawer.classList.remove('translate-x-full');
                overlay.classList.remove('opacity-0');
                overlay.classList.add('opacity-100');
            }, 10);
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }

        function closeDrawer() {
            if (!drawer || !overlay) return;
            drawer.classList.add('translate-x-full');
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0');
            setTimeout(function () {
                drawer.style.display = 'none';
                overlay.style.display = 'none';
            }, 300);
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }

        if (menuBtn) {
            menuBtn.addEventListener('click', function (e) {
                e.preventDefault();
                openDrawer();
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (overlay) overlay.addEventListener('click', closeDrawer);

        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeDrawer();
        });

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                closeDrawer();
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    e.preventDefault();
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        if (lenis) {
                            lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
                        } else {
                            targetEl.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        });
    }

    // ----------------------------------------------------
    // 5. NAVBAR SCROLL EFFECT
    // ----------------------------------------------------
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        function onScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('top-2', 'h-16', 'w-11/12', 'rounded-full', 'border', 'border-slate-700', 'bg-slate-900/50', 'backdrop-blur-sm');
                navbar.classList.remove('top-0', 'h-20', 'w-full', 'border-none', 'bg-transparent');
            } else {
                navbar.classList.remove('top-2', 'h-16', 'w-11/12', 'rounded-full', 'border', 'border-slate-700', 'bg-slate-900/50', 'backdrop-blur-sm');
                navbar.classList.add('top-0', 'h-20', 'w-full', 'border-none', 'bg-transparent');
            }
        }

        window.addEventListener('scroll', onScroll);
        onScroll();

        // In-page smooth scrolling for desktop navbar links
        document.querySelectorAll('#navbar a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        if (lenis) {
                            lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
                        } else {
                            targetEl.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                } else if (targetId === '#') {
                    e.preventDefault();
                    if (lenis) {
                        lenis.scrollTo(0, { duration: 1.2 });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            });
        });
    }
})();