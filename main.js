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

// About Us Modal Logic
const aboutModal = document.getElementById('nosotros-modal');
const aboutBtn = document.querySelector('a[href="#nosotros"]');
const closeBtn = document.querySelector('.close-modal');

if (aboutBtn && aboutModal) {
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.style.display = 'block';
        document.body.classList.add('modal-open');
    });

    closeBtn.addEventListener('click', () => {
        aboutModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

// Student Destinations Toggle
const showDestinationsBtn = document.getElementById('btn-show-destinations');
const destinationsWrapper = document.getElementById('student-grid');
const extraDestinations = document.querySelectorAll('.extra-destination');

if (showDestinationsBtn && destinationsWrapper) {
    showDestinationsBtn.addEventListener('click', () => {
        const isOpen = destinationsWrapper.classList.toggle('open');
        
        extraDestinations.forEach(dest => {
            dest.classList.add('show');
        });

        if (isOpen) {
            showDestinationsBtn.textContent = 'Ocultar catálogo';
            // Optional: smooth scroll to the first revealed card
            setTimeout(() => {
                destinationsWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            showDestinationsBtn.textContent = 'Ver catálogo de destinos';
            document.getElementById('estudiantil').scrollIntoView({ behavior: 'smooth' });
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
    const speed = 200;

    stats.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
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
