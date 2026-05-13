// 1. GESTÃO DE TEMA (Pacto de Vinculação com LocalStorage)
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Verifica se o usuário já tem um pacto (preferência) salvo
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
    // Alterna a energia do domínio entre Escuro (Sukuna) e Claro (Gojo)
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    // 🌙 para Sukuna (Sombrio) | ☀️ para Gojo (Vazio Infinito/Claro)
    themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// =========================================================================
// HEADER AUTO HIDE/SHOW (Técnica de Scroll Direcional)
// =========================================================================
const header = document.getElementById('header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    // Pega a posição atual do scroll
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Verifica se o menu mobile está aberto (Cortina/Veil). 
    // Se estiver aberto, não esconde o header para não bugar a navegação.
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        return; 
    }

    // Lógica de esconder/mostrar
    if (scrollTop > lastScrollTop && scrollTop > 80) {
        // Rolou para baixo (passando de 80px) -> Oculta o header
        header.classList.add('header-hidden');
    } else {
        // Rolou para cima -> Revela o header
        header.classList.remove('header-hidden');
    }

    // Atualiza a última posição do scroll (o Math.max evita valores negativos no scroll elástico do iOS)
    lastScrollTop = Math.max(0, scrollTop);
});

// 2. CURSOR DE ENERGIA AMALDIÇOADA (Desabilitado em Touch Devices)
const cursorDot = document.querySelector('.cursor-dot');
const cursorTrail = document.querySelector('.cursor-trail');

// Detecta se é um dispositivo touch
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
};

// Se for touch, esconde o cursor customizado
if (isTouchDevice()) {
    cursorDot.style.display = 'none';
    cursorTrail.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => el.style.cursor = 'auto');
} else {
    // ADICIONE ESTA LINHA ABAIXO PARA AVISAR O CSS QUE O MOUSE CUSTOMIZADO ESTÁ ON
    document.body.classList.add('custom-cursor-active');

    // Atualiza a posição do cursor baseado no movimento do mouse
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // O ponto central segue instantaneamente
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // O rastro (trail) tem um leve delay controlado pelo CSS (transition)
        setTimeout(() => {
            cursorTrail.style.left = `${posX}px`;
            cursorTrail.style.top = `${posY}px`;
        }, 50);
    });

    // Aumenta o cursor ao passar sobre elementos clicáveis
    const clickables = document.querySelectorAll('a, button');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorTrail.style.backgroundColor = 'rgba(139, 0, 0, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorTrail.style.backgroundColor = 'transparent';
        });
    });
}

// 3. EFEITO DE DIGITAÇÃO (Typing Effect para a Seção Hero)
const wordsToType = ["Desenhista", "Programador", "Feiticeiro de Grau Especial"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typistElement = document.getElementById('typist');

function typeEffect() {
    const currentWord = wordsToType[wordIndex];
    
    if (isDeleting) {
        typistElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typistElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } 
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsToType.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

document.addEventListener('DOMContentLoaded', typeEffect);

// 4. MENU MOBILE (Cortina / Veil Toggle)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

hamburger.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// 5. OBSERVAÇÃO DE INTERSEÇÃO (Revelação de Domínio On-Scroll)
const fadeElements = document.querySelectorAll('.section-hidden');
const progressBars = document.querySelectorAll('.progress-bar');

const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        entry.target.classList.add('section-show');
        
        if (entry.target.id === 'habilidades') {
            progressBars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth; 
            });
        }

        observer.unobserve(entry.target);
    });
}, observerOptions);

fadeElements.forEach(el => sectionObserver.observe(el));

// 6. DESTAQUE NO MENU ATIVO DURANTE SCROLL
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// =========================================================================
// EFEITOS DE DOMÍNIO (Sukuna Slashes e Gojo Particles)
// =========================================================================

// Função 1: Cortes do Sukuna (Tema Escuro)
function createSlash() {
    const slash = document.createElement('div');
    slash.className = 'sukuna-slash';

    const slashes = ['/', '//', '╱', '⟋'];
    slash.textContent = slashes[Math.floor(Math.random() * slashes.length)];

    slash.style.left = Math.random() * window.innerWidth + 'px';
    slash.style.top = Math.random() * window.innerHeight + 'px';

    const rotation = Math.random() * 360;
    slash.style.transform = `rotate(${rotation}deg)`;

    const size = Math.random() * 30 + 20;
    slash.style.fontSize = `${size}px`;

    const duration = Math.random() * 300 + 200;
    slash.style.animationDuration = `${duration}ms`;

    slash.style.color = 'rgba(255,255,255,0.35)';
    slash.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';

    document.body.appendChild(slash);

    setTimeout(() => {
        slash.remove();
    }, duration);
}

// Função 2: Vazio Infinito do Gojo (Tema Claro)
function createGojoParticle() {
    const particle = document.createElement('div');
    particle.className = 'gojo-particle';

    // Tamanho aleatório (entre 10px e 30px)
    const size = Math.random() * 20 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Posição aleatória na tela
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';

    // Cores das Técnicas: Azul, Vermelho e Roxo
    const colors = [
        '#00bfff', // Azul (Lapse)
        '#ff003c', // Vermelho (Reversal)
        '#8a2be2'  // Roxo (Hollow)
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    
    // Brilho da partícula
    particle.style.boxShadow = `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}`;

    // Direção aleatória de movimento gerada dinamicamente
    const tx = (Math.random() - 0.5) * 200; // Movimento no eixo X (-100 a 100)
    const ty = (Math.random() - 0.5) * 200 - 100; // Movimento no eixo Y (tendência a subir)
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    // Duração (flutua entre 2 e 5 segundos)
    const duration = Math.random() * 3000 + 2000;
    particle.style.animationDuration = `${duration}ms`;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, duration);
}

// Controlador Principal de Efeitos
function initBackgroundEffects() {
    setInterval(() => {
        const currentTheme = document.body.getAttribute('data-theme');
        const amount = window.innerWidth <= 768 ? 2 : 4; // Menos partículas no celular

        for (let i = 0; i < amount; i++) {
            if (currentTheme === 'dark') {
                createSlash(); // Invoca cortes se for Sukuna
            } else {
                createGojoParticle(); // Invoca esferas se for Gojo
            }
        }
    }, 250);
}

// Inicialização dos Efeitos
document.addEventListener('DOMContentLoaded', initBackgroundEffects);

// =========================================================================
// RESIZE LISTENER PARA AJUSTES EM TEMPO REAL
// =========================================================================
window.addEventListener('resize', () => {
    // Reposiciona elementos se necessário
    if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
        toggleMenu();
    }
});

// =========================================================================
// COMANDO DE RETROCEDER COM ESC + BOTÃO VOLTAR DO MOBILE
// =========================================================================

// Voltar usando a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Se estiver em uma página de galeria, volta para index
        if (
            window.location.pathname.includes('galeria-gojo.html') ||
            window.location.pathname.includes('galeria-geto.html')
        ) {
            window.location.href = 'index.html#projetos';
        }
    }
});

// =========================================================================
// BOTÃO VOLTAR DO CELULAR (ANDROID / MOBILE)
// =========================================================================

// Cria um histórico falso para detectar o botão voltar
history.pushState({ page: 1 }, "", "");

// Detecta quando o usuário aperta o botão voltar do dispositivo
window.addEventListener('popstate', () => {

    // Se estiver em páginas da galeria → volta para a home
    if (
        window.location.pathname.includes('galeria-gojo.html') ||
        window.location.pathname.includes('galeria-geto.html')
    ) {
        window.location.href = 'index.html#projetos';
    } else {
        // Se já estiver na home, mantém no site
        history.pushState({ page: 1 }, "", "");
    }
});

// =========================================================================
// MÚSICA DE BACKGROUND
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    // Se não encontrar o áudio na página, interrompe para não dar erro
    if (!bgMusic) return;

    bgMusic.volume = 0.02; // Define o volume (2%)
    
    // 1. Restaura o tempo da música salvo no navegador
    const savedTime = localStorage.getItem('music-time');
    if (savedTime) {
        const time = parseFloat(savedTime);
        if (!isNaN(time)) {
            bgMusic.currentTime = time;
        }
    }
    
    // 2. Salva continuamente o progresso da música
    bgMusic.addEventListener('timeupdate', () => {
        localStorage.setItem('music-time', bgMusic.currentTime);
    });

    // Por padrão a música é habilitada, a não ser que o usuário a tenha pausado
    let musicEnabled = localStorage.getItem('music-playing') !== 'false';

    // Função para tocar a música
    async function playMusic() {
        try {
            await bgMusic.play();
            musicEnabled = true;
            localStorage.setItem('music-playing', 'true');
            if (musicToggle) musicToggle.classList.add('active');
        } catch (err) {
            console.log('Autoplay bloqueado pelo navegador, aguardando interação do usuário.');
            if (musicToggle) musicToggle.classList.remove('active');
        }
    }

    // Função para pausar a música
    function pauseMusic() {
        bgMusic.pause();
        musicEnabled = false;
        localStorage.setItem('music-playing', 'false');
        if (musicToggle) musicToggle.classList.remove('active');
    }

    // Tenta tocar a música na primeira interação na tela
    function initMusic() {
        if (musicEnabled) {
            playMusic();
        }
        // Remove os eventos após a primeira interação
        document.removeEventListener('click', initMusic);
        document.removeEventListener('touchstart', initMusic);
        document.removeEventListener('keydown', initMusic);
    }

    // Logo ao carregar, tenta tocar a música
    if (musicEnabled) {
        playMusic();
    } else {
        if (musicToggle) musicToggle.classList.remove('active');
    }

    // Escuta a primeira interação na tela inteira
    document.addEventListener('click', initMusic);
    document.addEventListener('touchstart', initMusic);
    document.addEventListener('keydown', initMusic);

    // Lógica do botão de Tocar/Pausar
    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita conflito com o clique da tela
            if (bgMusic.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });
    }
});