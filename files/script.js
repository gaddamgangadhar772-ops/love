document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const starsContainer = document.getElementById('stars-container');
    const heartsContainer = document.getElementById('hearts-container');
    const loveButton = document.getElementById('love-button');
    const secretMessage = document.getElementById('secret-message');
    const envelope = document.getElementById('envelope');
    const prologueBg = document.querySelector('.prologue-bg');
    const resilienceBg = document.querySelector('.parallax-bg');
    const vowSparkle = document.getElementById('vow-sparkle');
    const debrisContainer = document.getElementById('debris-container');

    // --- Cursor Trail ---
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.8) {
            const trail = document.createElement('div');
            const isHeart = Math.random() > 0.5;
            trail.className = isHeart ? 'cursor-heart' : 'cursor-sparkle';
            if (isHeart) trail.innerHTML = '❤️';
            else trail.style.background = 'gold';

            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.fontSize = Math.random() * 10 + 5 + 'px';

            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            trail.style.setProperty('--x', x + 'px');
            trail.style.setProperty('--y', y + 'px');

            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 1000);
        }
    });

    // --- Love Timer ---
    const startDate = new Date(2021, 7, 1);

    function updateTimer() {
        if (!document.getElementById('days')) return;
        const now = new Date();
        const diff = now - startDate;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        document.getElementById('days').innerText = d.toString().padStart(2, '0');
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // --- Love Letter Interaction ---
    if (envelope) {
        envelope.addEventListener('click', () => {
            envelope.classList.toggle('open');
        });
    }

    // --- Particle & Debris Generation ---
    function createParticle(container, className, symbol = null, options = {}) {
        const particle = document.createElement('div');
        particle.className = className;

        if (symbol) {
            particle.innerHTML = symbol;
            particle.style.fontSize = Math.random() * (options.maxSize || 20) + (options.minSize || 10) + 'px';
        } else {
            const size = Math.random() * (options.maxSize || 4) + (options.minSize || 1);
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            if (options.color) particle.style.backgroundColor = options.color;
        }

        const x = Math.random() * 100;
        const y = options.fixedY !== undefined ? options.fixedY : Math.random() * 100;
        const duration = Math.random() * (options.maxDuration || 10) + (options.minDuration || 5);
        const delay = Math.random() * 5;

        particle.style.left = x + '%';
        if (options.top !== undefined) particle.style.top = options.top + '%';
        else if (y !== undefined) particle.style.top = y + '%';

        particle.style.setProperty('--duration', duration + 's');
        particle.style.animationDelay = delay + 's';

        container.appendChild(particle);

        if (options.autoRemove) {
            setTimeout(() => particle.remove(), (duration + delay) * 1000);
        }
        return particle;
    }

    // Initialize stars
    if (starsContainer) {
        for (let i = 0; i < 150; i++) {
            createParticle(starsContainer, 'star');
        }
    }

    // Continuous heart generation
    if (heartsContainer) {
        setInterval(() => {
            createParticle(heartsContainer, 'floating-heart', '❤️', { autoRemove: true });
        }, 800);
    }

    // Resilience Debris
    if (debrisContainer) {
        for (let i = 0; i < 50; i++) {
            createParticle(debrisContainer, 'debris', null, { color: 'rgba(255,255,255,0.2)' });
        }
    }

    // --- Parallax Scrolling Effect ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        if (prologueBg) {
            prologueBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }

        if (resilienceBg) {
            const rect = resilienceBg.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = window.innerHeight - rect.top;
                resilienceBg.style.transform = `translateY(${offset * 0.15}px)`;
            }
        }

        // Music fade in prologue
        if (bgMusic) {
            if (scrolled < window.innerHeight) {
                bgMusic.volume = Math.max(0.2, 1 - (scrolled / window.innerHeight) * 0.5);
            } else {
                bgMusic.volume = 1;
            }
        }
    });

    // --- Entry Animation ---
    const startUniverse = () => {
        if (loader) loader.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');

        if (bgMusic) {
            bgMusic.play().catch(error => { console.log("Audio autoplay blocked."); });
        }

        setTimeout(() => {
            const elements = document.querySelectorAll('.fade-in-up');
            elements.forEach(el => el.classList.add('active'));
        }, 500);
    };

    if (loader) loader.addEventListener('click', startUniverse);
    setTimeout(startUniverse, 3000);

    // --- Interactive Love Button ---
    if (loveButton) {
        loveButton.addEventListener('click', () => {
            if (secretMessage) {
                secretMessage.classList.remove('hidden');
                secretMessage.classList.add('fade-in-up', 'active');
            }
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    createParticle(heartsContainer, 'floating-heart', '💕', { autoRemove: true });
                }, i * 50);
            }
            loveButton.innerHTML = "You are Loved! ✨";
            if (bgMusic && bgMusic.paused) bgMusic.play();
        });
    }

    // --- Scroll Triggered Cinematic Scenes ---
    const observerOptions = { threshold: 0.3 };
    let vowTriggered = false;
    let climaxTriggered = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Memory Cards Animation
                if (entry.target.classList.contains('memories')) {
                    const cards = entry.target.querySelectorAll('.memory-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }

                // Scene 2: The Vow Sparkle Explosion
                if (entry.target.id === 'the-vow' && !vowTriggered) {
                    vowTriggered = true;
                    for (let i = 0; i < 50; i++) {
                        setTimeout(() => {
                            const p = createParticle(vowSparkle, 'floating-heart', '💛', {
                                autoRemove: true,
                                minDuration: 2,
                                maxDuration: 4,
                                top: 50
                            });
                            p.style.left = '50%';
                            p.style.top = '50%';
                            const angle = Math.random() * Math.PI * 2;
                            const dist = Math.random() * 300;
                            p.style.setProperty('--x', Math.cos(angle) * dist + 'px');
                            p.style.setProperty('--y', Math.sin(angle) * dist + 'px');
                            p.style.animationName = 'fadeOut';
                        }, i * 20);
                    }
                }

                // Final Climax
                if (entry.target.id === 'climax' && !climaxTriggered) {
                    climaxTriggered = true;
                    setInterval(() => {
                        createParticle(entry.target, 'floating-heart', '✨', { autoRemove: true });
                    }, 300);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .fade-in-up').forEach(el => observer.observe(el));
});
