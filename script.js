// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger, Flip);

// Preloader Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.progress');
    
    // Animate progress bar
    gsap.to(progress, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut'
    });
    
    // Hide loader after progress completes
    gsap.to(loader, {
        opacity: 0,
        delay: 2,
        duration: 0.8,
        onComplete: () => {
            loader.style.display = 'none';
            // Start page animations
            initPageAnimations();
        }
    });
});

// Initialize all page animations
function initPageAnimations() {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Animate menu items
        if (mobileMenu.classList.contains('active')) {
            gsap.from('.mobile-menu ul li', {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });
    });
    
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-item');
    
    revealElements.forEach(element => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleClass: 'active'
                }
            }
        );
    });
    
    // Job filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const jobCards = document.querySelectorAll('.job-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Store initial state for FLIP animation
            const state = Flip.getState(jobCards);
            
            // Filter jobs
            jobCards.forEach(card => {
                if (filter === 'all' || card.dataset.category.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Animate the transition
            Flip.from(state, {
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.05,
                onEnter: elements => gsap.fromTo(elements, 
                    { opacity: 0, scale: 0.8 }, 
                    { opacity: 1, scale: 1, duration: 0.6 }
                ),
                onLeave: elements => gsap.to(elements, 
                    { opacity: 0, scale: 0.8, duration: 0.6 }
                )
            });
        });
    });
    
    // Testimonial slider
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    let currentIndex = 0;
    const testimonialWidth = 100; // 100%
    
    function updateSlider() {
        testimonialTrack.style.transform = `translateX(-${currentIndex * testimonialWidth}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSlider();
    });
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateSlider();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });
    
    // Auto slide
    let slideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSlider();
    }, 5000);
    
    // Pause auto slide on hover
    testimonialTrack.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    testimonialTrack.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateSlider();
        }, 5000);
    });
    
    // Bookmark functionality
    const bookmarkBtns = document.querySelectorAll('.job-card-bookmark');
    
    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.innerHTML = btn.innerHTML.includes('far') ? 
                '<i class="fas fa-bookmark"></i>' : 
                '<i class="far fa-bookmark"></i>';
            
            // Add flip animation
            gsap.fromTo(btn, 
                { rotationY: 0 }, 
                { rotationY: 360, duration: 0.6, ease: 'back.out(1.7)' }
            );
        });
    });
    
    // Hero section animations
    gsap.timeline()
        .from('.hero-content h1', { 
            y: 50, 
            opacity: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        })
        .from('.hero-content p', { 
            y: 30, 
            opacity: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        }, '-=0.4')
        .from('.search-box', { 
            y: 30, 
            opacity: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        }, '-=0.4')
        .from('.popular-searches', { 
            y: 30, 
            opacity: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        }, '-=0.4')
        .from('.hero-image', { 
            x: 50, 
            opacity: 0, 
            duration: 1, 
            ease: 'power2.out' 
        }, '-=0.8');
    
    // Stats counter animation
    const statItems = document.querySelectorAll('.stat-item h2');
    
    statItems.forEach(item => {
        const target = parseInt(item.textContent);
        const plus = item.textContent.includes('+') ? '+' : '';
        
        gsap.fromTo(item, 
            { textContent: 0 },
            {
                textContent: target,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                },
                onUpdate: function() {
                    item.textContent = Math.ceil(this.targets()[0].textContent) + plus;
                }
            }
        );
    });
    
    // Apply hover effects for job cards
    jobCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { 
                y: -10, 
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)', 
                duration: 0.3 
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
                y: 0, 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                duration: 0.3 
            });
        });
    });
    
    // Newsletter form animation
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const input = newsletterForm.querySelector('input');
        const value = input.value.trim();
        
        if (value) {
            // Success animation
            gsap.to(newsletterForm, { 
                scale: 1.05, 
                duration: 0.2, 
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(newsletterForm, { 
                        scale: 1, 
                        duration: 0.2, 
                        ease: 'power2.in' 
                    });
                    
                    // Clear input
                    input.value = '';
                    
                    // Show success message (you can add a real message element)
                    alert('Thank you for subscribing!');
                }
            });
        }
    });
}