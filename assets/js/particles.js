// Particle effects system
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        // Set canvas properties
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        // Insert canvas after video background
        const videoBackground = document.getElementById('video-background');
        videoBackground.parentNode.insertBefore(this.canvas, videoBackground.nextSibling);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.updateMouse(e));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    updateMouse(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
            
            // Remove dead particles
            if (particle.opacity <= 0) {
                this.particles.splice(index, 1);
                this.particles.push(new Particle(this.canvas.width, this.canvas.height));
            }
        });
        
        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.5;
                    this.ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = Math.random() * 300 + 100;
        this.maxLife = this.life;
    }
    
    reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.5;
    }
    
    update(mouse) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.vx += (dx / distance) * force * 0.5;
            this.vy += (dy / distance) * force * 0.5;
        }
        
        // Reduce life
        this.life--;
        this.opacity = this.life / this.maxLife;
        
        // Boundary check
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ParticleSystem();
    }, 1000); // Delay to ensure video background is loaded
});
