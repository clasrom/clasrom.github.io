/* =========================
   CONFIGURACIÓN GENERAL
========================= */

const twinkleCanvas = document.getElementById("twinkle-bg");
const twinkleCtx = twinkleCanvas.getContext("2d");

const constellationCanvas = document.getElementById("constellation-bg");
const constellationCtx = constellationCanvas.getContext("2d");

function resizeCanvas() {
    twinkleCanvas.width = window.innerWidth;
    twinkleCanvas.height = window.innerHeight;

    constellationCanvas.width = window.innerWidth;
    constellationCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* =========================
   1️⃣ PUNTOS QUE PARPADEAN
========================= */

let twinkleDots = [];
const twinkleCount = 250;

class TwinkleDot {
    constructor() {
        this.x = Math.random() * twinkleCanvas.width;
        this.y = Math.random() * twinkleCanvas.height;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.015 + 0.003;
        this.fadingOut = Math.random() > 0.5;
    }

    update() {
        if (this.fadingOut) {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) this.fadingOut = false;
        } else {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= 1) this.fadingOut = true;
        }
    }

    draw() {
        twinkleCtx.beginPath();
        twinkleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        twinkleCtx.fillStyle = `rgba(210, 180, 255, ${this.opacity})`;
        twinkleCtx.fill();
    }
}

for (let i = 0; i < twinkleCount; i++) {
    twinkleDots.push(new TwinkleDot());
}

/* =========================
   2️⃣ CONSTELACIÓN EN MOVIMIENTO
========================= */

let particles = [];
const particleCount = 100;
const maxDistance = 120;

class Particle {
    constructor() {
        this.x = Math.random() * constellationCanvas.width;
        this.y = Math.random() * constellationCanvas.height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= constellationCanvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= constellationCanvas.height) this.vy *= -1;
    }

    draw() {
        constellationCtx.beginPath();
        constellationCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        constellationCtx.fillStyle = "rgba(210, 180, 255, 0.9)";
        constellationCtx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {

            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                let opacity = 1 - distance / maxDistance;

                constellationCtx.beginPath();
                constellationCtx.strokeStyle = `rgba(210, 180, 255, ${opacity * 0.4})`;
                constellationCtx.lineWidth = 1;
                constellationCtx.moveTo(particles[a].x, particles[a].y);
                constellationCtx.lineTo(particles[b].x, particles[b].y);
                constellationCtx.stroke();
            }
        }
    }
}

/* =========================
   ANIMACIÓN
========================= */

function animate() {

    // Limpiar ambos canvas
    twinkleCtx.clearRect(0, 0, twinkleCanvas.width, twinkleCanvas.height);
    constellationCtx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);

    // Dibujar puntos que parpadean
    twinkleDots.forEach(dot => {
        dot.update();
        dot.draw();
    });

    // Dibujar constelación
    particles.forEach(p => {
        p.move();
        p.draw();
    });

    connectParticles();

    requestAnimationFrame(animate);
}

animate();
