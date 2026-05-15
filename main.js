// MAIN JAVASCRIPT - All Inclusive Turismo

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PANTALLA DE CARGA (Robust logic)
    const loader = document.getElementById('loader');
    const hideLoader = () => {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
            }, 600);
        }
    };

    // Hide loader when window is fully loaded or after a safety timeout
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3000); // Safety fallback

    // 2. INITIALIZE SWIPER
    const initSwiper = () => {
        if (typeof Swiper !== 'undefined' && document.querySelector('.packages-swiper')) {
            new Swiper('.packages-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                speed: 800,
                grabCursor: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1440: { slidesPerView: 4 }
                }
            });
        }
    };
    initSwiper();

    // 3. NAVBAR SCROLL
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 4. MOBILE MENU (DRAWER)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-links a');

    if (menuToggle && drawer) {
        const toggleDrawer = () => {
            drawer.classList.toggle('active');
            document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', toggleDrawer);
        if (drawerClose) drawerClose.addEventListener('click', toggleDrawer);
        
        drawerLinks.forEach(link => {
            link.addEventListener('click', toggleDrawer);
        });
    }

    // 5. REVEAL ON SCROLL
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 6. FORMULARIO DE CONTACTO
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerText = '¡Mensaje enviado!';
                submitBtn.style.background = '#4CAF50';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // 7. INITIALIZE LUCIDE ICONS
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 9. SMOOTH SCROLL (Eased scrolling)
    // We use a simple script to ease anchor link clicks, 
    // but for regular scroll fluidity, CSS scroll-behavior: smooth is often enough.
    // However, we can add a custom eased scroll for better "fluidity".
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
