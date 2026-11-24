/**
 * Smooth Website Template - Main Interactive Controller
 * Features:
 *  1. Interactive Before / After Image Comparison Slider
 *  2. "Made For" Rotating Text Animation
 *  3. Responsive Slide-Out Mobile Navigation Drawer
 *  4. Dynamic Navbar Scroll Shrink & Blur Effect
 *  5. Smooth In-Page Anchor Scrolling
 */

(function () {
    'use strict';

    // ----------------------------------------------------
    // 1. IMAGE COMPARISON SLIDER
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
    // 2. "MADE FOR" ROTATING TEXT ANIMATION
    // ----------------------------------------------------
    function initWordRotator() {
        const words = document.querySelectorAll('.made-for-word');
        if (words.length === 0) return;

        let currentIndex = 0;
        setInterval(function () {
            const currentWord = words[currentIndex];
            currentWord.classList.remove('active');
            currentWord.classList.add('exit');

            currentIndex = (currentIndex + 1) % words.length;
            const nextWord = words[currentIndex];
            nextWord.classList.remove('exit');
            nextWord.classList.add('active');

            setTimeout(function () {
                currentWord.classList.remove('exit');
            }, 600);
        }, 2500);
    }

    // ----------------------------------------------------
    // 3. RESPONSIVE MOBILE MENU DRAWER
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
            link.addEventListener('click', function () {
                closeDrawer();
            });
        });
    }

    // ----------------------------------------------------
    // 4. NAVBAR SCROLL EFFECT
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
    }

    // Initialize all modules when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    function initAll() {
        initComparisonSlider();
        initWordRotator();
        initMobileMenu();
        initNavbarScroll();
    }
})();
