const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 100 };

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
}

window.addEventListener('resize', setupCanvas);
window.addEventListener('load', setupCanvas); 
setupCanvas();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y + window.scrollY;
});

class Particle {
    constructor(x, y, radius, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityY = velocityY;
        this.color = 'rgb(0, 132, 255)'; 
    }

    draw() {
        ctx.shadowColor = 'rgba(255, 255, 0, 1)'; 
        ctx.shadowBlur = this.radius * 200; 
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.shadowBlur = 10;
        ctx.shadowColor = 'transparent';
    }

    update() {
        this.y -= this.velocityY;

        if (this.y < -this.radius) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.radius;
        }

        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.radius) {
                const angle = Math.atan2(dy, dx);
                const pushStrength = (mouse.radius + this.radius - distance) / mouse.radius;
                this.x += Math.cos(angle) * pushStrength * 2;
                this.y += Math.sin(angle) * pushStrength * 2;
            }
        }
        
        this.draw();
    }
}

function init() {
    particles = [];
    const calculatedParticleCount = Math.floor(canvas.height / 10) * 2; 

    for (let i = 0; i < calculatedParticleCount; i++) {
        const radius = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height; 
        const velocityY = Math.random() * 0.5 + 0.5; 
        particles.push(new Particle(x, y, radius, velocityY));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    
    if (canvas.height !== document.documentElement.scrollHeight) {
        setupCanvas();
    }
}

init();
animate();
