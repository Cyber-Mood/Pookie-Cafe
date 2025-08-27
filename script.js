document.addEventListener('DOMContentLoaded', () => {

// --- NEW: DYNAMIC HERO HEADLINE ANIMATION ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        const chars = text.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
        heroTitle.innerHTML = chars;

    // Trigger animation after a short delay
    setTimeout(() => {
        heroTitle.classList.add('is-animated');
        const charSpans = heroTitle.querySelectorAll('.char');
        charSpans.forEach((span, i) => {
            // Stagger the animation start time for each character
            span.style.animationDelay = `${i * 0.05}s`;
        });
    }, 500); // 500ms delay
    }

    // --- (Header, Mobile Menu, and Theme Toggle code is unchanged) ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { header.classList.add('scrolled'); } 
        else { header.classList.remove('scrolled'); }
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const toggleMenu = () => {
        const isMenuOpen = navMenuWrapper.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isMenuOpen);
        menuToggle.querySelector('i').className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    };
    menuToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', () => { if (navMenuWrapper.classList.contains('active')) { toggleMenu(); } });
    });

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.querySelector('i').className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
    // --- (End of unchanged code) ---


    // --- NEW: MENU FILTERING ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class on button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            // Filter menu cards
            menuCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    // --- NEW: GALLERY LIGHTBOX ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        // Close if the dark background is clicked, but not the image itself
        if (e.target === lightbox) {
            closeLightbox();
        }
    });


    // --- (Intersection Observer for scroll animations is unchanged) ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    revealElements.forEach(el => observer.observe(el));


    // in script.js, at the bottom

// --- BLOG MODAL LOGIC ---
const allPostCards = document.querySelectorAll('.post-card');
const blogModal = document.getElementById('blog-modal');
const blogModalClose = document.querySelector('.blog-modal-close');

if (allPostCards.length > 0 && blogModal) {
    allPostCards.forEach(card => {
        const readMoreBtn = card.querySelector('.post-card-link');
        readMoreBtn.addEventListener('click', () => {
            // Get content from the clicked card
            const imageSrc = card.querySelector('.post-card-image').src;
            const title = card.querySelector('.post-card-title').textContent;
            const date = card.querySelector('.post-card-date').textContent;
            const fullContent = card.querySelector('.full-post-content').innerHTML;

            // Populate the modal
            blogModal.querySelector('.blog-modal-image').src = imageSrc;
            blogModal.querySelector('.blog-modal-title').textContent = title;
            blogModal.querySelector('.blog-modal-meta').textContent = `Published on ${date}`;
            blogModal.querySelector('.blog-modal-body').innerHTML = fullContent;

            // Show the modal
            blogModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Function to close the modal
    const closeBlogModal = () => {
        blogModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    blogModalClose.addEventListener('click', closeBlogModal);
    blogModal.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            closeBlogModal();
        }
    });
}

});


// in script.js

// --- TESTIMONIAL CAROUSEL LOGIC (LOOPING VERSION) ---
const track = document.querySelector('.testimonial-track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const slideWidth = slides[0].getBoundingClientRect().width;

    let currentIndex = 0;

    // Function to move to a specific slide
    const moveToSlide = (targetIndex) => {
        track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
        currentIndex = targetIndex;
    };

    // When clicking the 'Next' button
    nextButton.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        // If we are at the last slide, loop back to the first slide
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        moveToSlide(newIndex);
    });

    // When clicking the 'Previous' button
    prevButton.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        // If we are at the first slide, loop around to the last slide
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        }
        moveToSlide(newIndex);
    });
}