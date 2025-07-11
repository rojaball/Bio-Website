// Enhanced animations and smooth scrolling system
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for internal links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Enhanced typing animation for bio text
    function enhancedTypingAnimation() {
        const bioContent = document.getElementById('bio-content');
        if (!bioContent) return;
        
        // Add typing cursor
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        
        // Observe when bio content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && bioContent.textContent.length > 0) {
                    // Add cursor after typing completes
                    setTimeout(() => {
                        bioContent.appendChild(cursor);
                        setTimeout(() => {
                            cursor.remove();
                        }, 3000);
                    }, 100);
                }
            });
        });
        
        observer.observe(bioContent, { childList: true, subtree: true });
    }
    
    // Add glitch effect to headings
    function addGlitchEffect() {
        const headings = document.querySelectorAll('h1, h2, h3');
        
        headings.forEach(heading => {
            const text = heading.textContent;
            heading.setAttribute('data-text', text);
            heading.classList.add('glitch');
            
            // Remove glitch effect after 3 seconds
            setTimeout(() => {
                heading.classList.remove('glitch');
            }, 3000);
        });
    }
    
    // Add hover effects to elements
    function addHoverEffects() {
        // Add glow effect to links
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.classList.add('glow');
        });
        
        // Add pulse effect to buttons
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.classList.add('pulse');
            });
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('pulse');
            });
        });
        
        // Add floating effect to containers
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.classList.add('floating');
        });
    }
    
    // Intersection Observer for scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all containers and sections
        const elementsToObserve = document.querySelectorAll('.container, .contact-section, .social-buttons');
        elementsToObserve.forEach(el => observer.observe(el));
    }
    
    // Add scroll-triggered animations
    function addScrollAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease-out forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .container, .contact-section, .social-buttons {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-scroll to bio section after video plays
    function autoScrollToBio() {
        const video = document.getElementById('myVideo');
        const bioContainer = document.getElementById('bio-container');
        
        if (video && bioContainer) {
            // Wait for video to play for 5 seconds, then scroll to bio
            setTimeout(() => {
                bioContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 5000);
        }
    }
    
    // Initialize parallax effect for background
    function initParallax() {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const videoBackground = document.getElementById('video-background');
            
            if (videoBackground) {
                videoBackground.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Add typewriter effect to specific elements
    function addTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 50);
        });
    }
    
    // Initialize all animations
    function initializeAnimations() {
        initSmoothScrolling();
        enhancedTypingAnimation();
        addGlitchEffect();
        addHoverEffects();
        addScrollAnimations();
        initScrollAnimations();
        autoScrollToBio();
        initParallax();
        addTypewriterEffect();
    }
    
    // Start animations after a short delay
    setTimeout(initializeAnimations, 500);
    
    // Add custom scroll behavior
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        // Update particle system based on scroll
        if (window.particleSystem) {
            window.particleSystem.updateScroll(scrollPercent);
        }
    });
    
    // Add window resize handler
    window.addEventListener('resize', function() {
        // Recalculate animations on resize
        setTimeout(initializeAnimations, 100);
    });
});
