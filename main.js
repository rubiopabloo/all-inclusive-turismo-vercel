// Disable shortcuts like Ctrl+S, Ctrl+P, Ctrl+U
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
        e.preventDefault();
    }
});

// Navbar background change on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for Reveal animations
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Mobile Menu Toggle (Simplified for this version)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    // Basic alert for now, can be expanded to a full mobile menu later
    alert('Menú móvil en desarrollo. Puedes navegar usando los enlaces de escritorio.');
});

// About Us navigation (handled by browser links now)


// Student Destinations Toggle
const showDestinationsBtn = document.getElementById('btn-show-destinations');
const destinationsWrapper = document.getElementById('student-grid');
const studentSection = document.getElementById('estudiantil');
const extraDestinations = document.querySelectorAll('.extra-destination');

if (showDestinationsBtn && destinationsWrapper && studentSection) {
    showDestinationsBtn.addEventListener('click', () => {
        const isCatalogActive = studentSection.classList.toggle('catalog-active');
        const isGridOpen = destinationsWrapper.classList.toggle('open');

        extraDestinations.forEach(dest => {
            dest.classList.add('show');
        });

        if (isCatalogActive) {
            showDestinationsBtn.innerHTML = 'Ocultar catálogo <i class="fas fa-chevron-up ms-2"></i>';
            // Smooth scroll only if needed, making it less jarring
            setTimeout(() => {
                destinationsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1200);
        } else {
            showDestinationsBtn.innerHTML = 'Ver catálogo de destinos <i class="fas fa-chevron-down ms-2"></i>';
            studentSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Form Submission Handling (with AJAX)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        const formData = new FormData(contactForm);

        btn.textContent = 'Enviando...';
        btn.disabled = true;

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('¡Gracias por tu consulta! Hemos recibido tu mensaje y nos pondremos en contacto pronto.');
                    contactForm.reset();
                } else {
                    alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo o contáctanos por WhatsApp.');
                }
            })
            .catch(error => {
                alert('Error de conexión. Por favor, revisa tu conexión a internet o contáctanos directamente.');
            })
            .finally(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            });
    });
}

// Stats Count Up Animation
const countNumbers = () => {
    const stats = document.querySelectorAll('.stat-number');
    const duration = 2500; // Duration in ms for all counters

    stats.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic for a smoother finish
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentAmount = Math.floor(easeOutCubic * target);

            counter.innerText = currentAmount;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.innerText = target;
            }
        };

        requestAnimationFrame(animate);
    });
};

const statsSection = document.querySelector('.stats-grid');
const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        countNumbers();
        statsObserver.unobserve(statsSection);
    }
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.getElementById('carouselNext');
    const prevButton = document.getElementById('carouselPrev');
    const dotsNav = document.querySelector('.carousel-dots');
    
    if (track && slides.length > 0 && nextButton && prevButton && dotsNav) {
        const dots = Array.from(dotsNav.children);
        let currentSlideIndex = 0;

        const moveToSlide = (index) => {
            slides.forEach((s, idx) => {
                s.classList.remove('active');
                if (dots[idx]) dots[idx].classList.remove('active');
            });
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentSlideIndex = index;
        };

        nextButton.addEventListener('click', () => {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentSlideIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            moveToSlide(prevIndex);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('span');
            if (!targetDot) return;
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            moveToSlide(targetIndex);
        });

        // Auto-slide
        setInterval(() => {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            moveToSlide(nextIndex);
        }, 5000);
        
        // Mobile Swipe
        let touchstartX = 0;
        let touchendX = 0;
        
        track.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        function handleSwipe() {
            if (touchendX < touchstartX - 50) {
                let nextIndex = currentSlideIndex + 1;
                if (nextIndex >= slides.length) nextIndex = 0;
                moveToSlide(nextIndex);
            }
            if (touchendX > touchstartX + 50) {
                let prevIndex = currentSlideIndex - 1;
                if (prevIndex < 0) prevIndex = slides.length - 1;
                moveToSlide(prevIndex);
            }
        }
    }
});


// Transport Modal Functionality
function openTransportModal() {
    const modal = document.getElementById('transport-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}
function closeTransportModal() {
    const modal = document.getElementById('transport-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}
window.addEventListener('click', (e) => {
    const modal = document.getElementById('transport-modal');
    if (e.target === modal) {
        closeTransportModal();
    }
});
