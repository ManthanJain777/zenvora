// ZENOVRA — Cinematic Interactions

// Particle System for Hero
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mousePosition = { x: 0, y: 0 };
        
        this.init();
        this.animate();
        this.setupListeners();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    setupListeners() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 229, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 102, 255, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    if (canvas) {
        new ParticleSystem(canvas);
    }
});

// Scroll-triggered animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Staggered animation for stages
            if (entry.target.classList.contains('stage')) {
                const delay = parseInt(entry.target.dataset.stage) * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.stage, .os-layer, .journey-step, .flow-step, .blueprint-card, .case-card, .why-card'
    );
    
    animatedElements.forEach(el => observer.observe(el));
});

// Smooth scroll for CTA buttons
document.querySelectorAll('a[href^="#"], button').forEach(element => {
    element.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else if (this.textContent.includes('Book Strategy Session')) {
            e.preventDefault();
            // Add your booking form logic here
            alert('Strategy Session booking form would open here. Connect to Calendly or your booking system.');
        }
    });
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// Number counter animation for case studies
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const text = element.textContent;
            
            // Extract number from text like "₹8L" or "2.1x" or "135%"
            const match = text.match(/[\d.]+/);
            if (match) {
                const number = parseFloat(match[0]);
                const prefix = text.split(match[0])[0];
                const suffix = text.split(match[0])[1];
                
                let current = 0;
                const increment = number / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        element.textContent = prefix + number + suffix;
                        clearInterval(timer);
                    } else {
                        element.textContent = prefix + current.toFixed(1) + suffix;
                    }
                }, 16);
            }
            
            counterObserver.unobserve(element);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.impact-number');
    counters.forEach(counter => counterObserver.observe(counter));
});

// Glassmorphism hover effects
document.querySelectorAll('.glass, .blueprint-card, .case-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Cursor glow effect (subtle)
let cursorGlow = null;

document.addEventListener('DOMContentLoaded', () => {
    cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursorGlow);
});

document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    }
});

// Navigation scroll effect
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(10, 10, 15, 0.9)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(10, 10, 15, 0.7)';
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Preload critical assets
document.addEventListener('DOMContentLoaded', () => {
    // Add any image preloading here if needed
    console.log('ZENOVRA website loaded successfully');
});

// Handle "Explore The Future" button
document.querySelectorAll('.btn-secondary').forEach(btn => {
    if (btn.textContent.includes('Explore The Future')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#os').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    }
});

// Accessibility: Respect reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--ease-smooth', 'ease');
    document.documentElement.style.setProperty('--ease-entrance', 'ease');
}
