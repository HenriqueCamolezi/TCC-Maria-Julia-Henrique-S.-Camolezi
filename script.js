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

// ===== DETECTA PASSAGEM EM IMAGENS DA GALERIA/PROJETOS =====
const viewables = document.querySelectorAll('.gallery-img');
    
viewables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        // Remove o efeito de clique comum (se tiver) e adiciona o de visualização
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.classList.add('view-mode');
        cursorTrail.classList.add('view-mode');
    });
    
    el.addEventListener('mouseleave', () => {
        // Tira o modo de visualização quando o mouse sai da foto
        cursorDot.classList.remove('view-mode');
        cursorTrail.classList.remove('view-mode');
    });
});

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

// =========================================================================
// EASTER EGG: CÓDIGOS SECRETOS E EXPANSÕES DE DOMÍNIO
// =========================================================================

// INJEÇÃO DE CSS: Estilos Cinematográficos (Sukuna + Gojo)
const styleFix = document.createElement('style');
styleFix.innerHTML = `
    /* SUKUNA CORTES */
    .sukuna-slash {
        z-index: 99999 !important; 
        pointer-events: none;
    }

    /* GOJO VAZIO ROXO - ENERGIA CINEMÁTICA */
    .hollow-orb {
        position: fixed;
        top: 50%;
        border-radius: 50%;
        z-index: 100000;
        pointer-events: none;
        mix-blend-mode: normal; /* Removido o screen para contrastar no fundo branco! */
    }
    
    /* Esferas de convergência com rastro de energia */
    .orb-blue {
        left: -200px;
        transform: translateY(-50%);
        width: 150px; height: 150px;
        background: radial-gradient(circle, #ffffff 10%, #00bfff 40%, #0033aa 75%, transparent 100%);
        box-shadow: 0 0 40px #00bfff, 0 0 100px #0033aa, 0 0 200px #001155, inset 0 0 40px #ffffff;
        animation: moveRight 1.5s cubic-bezier(0.5, 0, 0.1, 1) forwards;
    }
    
    .orb-red {
        right: -200px;
        transform: translateY(-50%);
        width: 150px; height: 150px;
        background: radial-gradient(circle, #ffffff 10%, #ff003c 40%, #aa0000 75%, transparent 100%);
        box-shadow: 0 0 40px #ff003c, 0 0 100px #aa0000, 0 0 200px #550000, inset 0 0 40px #ffffff;
        animation: moveLeft 1.5s cubic-bezier(0.5, 0, 0.1, 1) forwards;
    }

    /* Núcleo do Vazio Roxo (Buraco Negro que se expande) */
    .orb-purple {
        left: 50%; top: 50%;
        width: 50px; height: 50px;
        background: radial-gradient(circle, #ffffff 0%, #d800ff 30%, #4b0082 60%, #1a0033 100%);
        box-shadow: 0 0 80px #d800ff, 0 0 150px #4b0082, 0 0 300px #1a0033, inset 0 0 30px #ffffff;
        animation: hollowPurpleExplosion 2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
    }

    /* Anéis de Choque (Shockwaves) */
    .purple-shockwave {
        position: fixed;
        left: 50%; top: 50%;
        width: 10px; height: 10px;
        border-radius: 50%;
        border: 15px solid rgba(216, 0, 255, 0.9);
        transform: translate(-50%, -50%);
        z-index: 99998;
        pointer-events: none;
        animation: expandShockwave 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
    }

    /* Partículas de Relâmpago / Detritos */
    .purple-particle {
        position: fixed;
        left: 50%; top: 50%;
        width: 8px; height: 8px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 15px #d800ff, 0 0 30px #8a2be2;
        z-index: 99999;
        pointer-events: none;
        animation: shootParticle 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
    }

    /* Clarão ofuscante da explosão */
    .purple-flash {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: #ffffff;
        z-index: 99997;
        opacity: 0;
        pointer-events: none;
        animation: flashScreen 2s ease-out forwards;
    }

    /* Tremor de Câmera Absoluto */
    body.gojo-domain-active {
        animation: gojoTremor 0.1s infinite alternate;
        filter: contrast(120%) saturate(150%);
    }

    /* Keyframes */
    @keyframes moveRight {
        0% { left: -10%; transform: translate(-50%, -50%) scale(0.2) rotate(0deg); }
        100% { left: 50%; transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0.8; }
    }
    @keyframes moveLeft {
        0% { right: -10%; transform: translate(50%, -50%) scale(0.2) rotate(0deg); }
        100% { right: 50%; transform: translate(50%, -50%) scale(1) rotate(-360deg); opacity: 0.8; }
    }
    @keyframes hollowPurpleExplosion {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        10% { transform: translate(-50%, -50%) scale(5); opacity: 1; box-shadow: 0 0 300px #d800ff; filter: hue-rotate(90deg); } /* Contração/Singularidade */
        30% { transform: translate(-50%, -50%) scale(3); opacity: 1; background: #000; } /* Instante sombrio antes de explodir */
        100% { transform: translate(-50%, -50%) scale(150); opacity: 0; } /* Expansão Devastadora */
    }
    @keyframes expandShockwave {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; border-width: 60px; }
        100% { transform: translate(-50%, -50%) scale(150); opacity: 0; border-width: 0px; }
    }
    @keyframes shootParticle {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0); opacity: 0; }
    }
    @keyframes flashScreen {
        0% { opacity: 0; background: #fff; }
        10% { opacity: 1; background: #fff; }
        30% { opacity: 1; background: #8a2be2; mix-blend-mode: hard-light; }
        100% { opacity: 0; background: transparent; }
    }
    @keyframes gojoTremor {
        0% { transform: translate(5px, 5px) rotate(1deg); }
        100% { transform: translate(-5px, -5px) rotate(-1deg); }
    }
`;
document.head.appendChild(styleFix);

let isSukunaEnraged = false;
let isGojoEnraged = false;
let originalGreeting = "";
let originalName = "";
let rageInterval = null;

// =========================================================================
// EASTER EGG UI (Botão Secreto e Janela de Código)
// =========================================================================

const secretBtn = document.createElement('button');
secretBtn.className = 'secret-btn';
secretBtn.textContent = '?';
secretBtn.title = 'Descobrir Segredo...';
document.body.appendChild(secretBtn);

const secretModal = document.createElement('div');
secretModal.className = 'secret-modal';
secretModal.innerHTML = `
    <div class="secret-content">
        <button class="secret-close" aria-label="Fechar">✕</button>
        <h3>Palavra de Poder</h3>
        <input type="password" class="secret-input" placeholder="Digite o Pacto..." autocomplete="off">
        <div class="secret-error">Pacto Inválido. A energia dissipou.</div>
        <button class="btn btn-primary secret-submit">Invocar</button>
        
        <!-- NOVO BOTÃO DE RESETAR OS DEDOS -->
        <button id="btn-reset-fingers" class="btn btn-outline" style="margin-top: 15px; width: 100%; border-color: #8b0000; color: #ff3333; padding: 10px; font-size: 0.9rem;">
            ⟳ Resetar Dedos do Sukuna
        </button>
    </div>
`;
document.body.appendChild(secretModal);

const inputField = secretModal.querySelector('.secret-input');
const submitBtn = secretModal.querySelector('.secret-submit');
const closeModBtn = secretModal.querySelector('.secret-close');
const errorMsg = secretModal.querySelector('.secret-error');
const resetFingersBtn = secretModal.querySelector('#btn-reset-fingers');

// ISSO FAZ O BOTÃO "?" ABRIR A ABA (Se sumir, o botão para de funcionar)
secretBtn.addEventListener('click', () => {
    secretModal.classList.add('active');
    inputField.value = ''; 
    errorMsg.style.display = 'none'; 
    inputField.focus(); 
});

// FECHAR A ABA DO PACTO
function closeSecretModal() {
    secretModal.classList.remove('active');
}
closeModBtn.addEventListener('click', closeSecretModal);
secretModal.addEventListener('click', (e) => {
    if(e.target === secretModal) closeSecretModal();
});

// LÓGICA DO BOTÃO DE RESETAR OS DEDOS
resetFingersBtn.addEventListener('click', () => {
    if (confirm("Tem certeza que deseja vomitar os dedos e espalhá-los pelo domínio novamente?")) {
        
        // 1. Limpa a memória e zera a matriz de dedos pegos
        localStorage.removeItem('sukunaFingers');
        collectedFingers = [];
        
        // 2. Apaga o botão "Ver Arte" se o usuário já tinha ele
        const btnArt = document.getElementById('btn-secret-art');
        if (btnArt) btnArt.remove();
        
        // 3. Remove possíveis dedos na tela para não duplicar
        document.querySelectorAll('.sukuna-finger').forEach(f => f.remove());
        
        // 4. Renasce os dedos nos locais de origem
        spawnFingers();
        
        alert("Pacto desfeito! Os 5 dedos retornaram aos seus locais de origem.");
        inputField.value = '';
        closeSecretModal();
    }
});

// =========================================================================
// FUNÇÃO DE CORTES (SUKUNA)
// =========================================================================
window.createSlash = function() {
    const slash = document.createElement('div');
    slash.className = 'sukuna-slash';
    slash.style.left = Math.random() * window.innerWidth + 'px';
    slash.style.top = Math.random() * window.innerHeight + 'px';
    const rotation = Math.random() * 360;
    slash.style.transform = `rotate(${rotation}deg)`;
    const duration = Math.random() * 300 + 200;
    slash.style.animationDuration = `${duration}ms`;

    if (isSukunaEnraged) {
        const enragedSlashes = ['X', '✖']; 
        slash.textContent = enragedSlashes[Math.floor(Math.random() * enragedSlashes.length)];
        const size = Math.random() * 80 + 80; 
        slash.style.fontSize = `${size}px`;
        slash.style.color = '#ff0000'; 
        slash.style.textShadow = '0 0 20px #ff0000, 0 0 40px #8b0000';
        slash.style.opacity = '1';
        slash.style.fontWeight = '900'; 
    } else {
        const normalSlashes = ['/', '//', '╱', '⟋'];
        slash.textContent = normalSlashes[Math.floor(Math.random() * normalSlashes.length)];
        const size = Math.random() * 30 + 20;
        slash.style.fontSize = `${size}px`;
        slash.style.color = 'rgba(255,255,255,0.35)';
        slash.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
        slash.style.fontWeight = 'bold';
    }
    document.body.appendChild(slash);
    setTimeout(() => slash.remove(), duration);
};

// =========================================================================
// ATIVAÇÃO SUKUNA (TEMA ESCURO)
// =========================================================================
function activateMalevolentShrine() {
    if (isSukunaEnraged || isGojoEnraged) return; 
    isSukunaEnraged = true;
    const greeting = document.querySelector('.greeting');
    const nameElement = document.querySelector('.name');
    
    if (greeting && !originalGreeting) originalGreeting = greeting.innerHTML;
    if (nameElement && !originalName) originalName = nameElement.innerHTML;

    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    const themeToggleBtn = document.getElementById('theme-toggle');
    if(themeToggleBtn) themeToggleBtn.textContent = '🌙';

    document.body.classList.add('sukuna-domain-active');

    if(greeting) greeting.textContent = "EXPANSÃO DE DOMÍNIO:";
    if(nameElement) nameElement.innerHTML = "Santuário <span>Malevolente</span>";

    rageInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) createSlash();
    }, 120);

    setTimeout(() => {
        document.body.classList.remove('sukuna-domain-active');
        if (greeting) greeting.innerHTML = originalGreeting;
        if (nameElement) nameElement.innerHTML = originalName;
        clearInterval(rageInterval);
        isSukunaEnraged = false;
    }, 3000); 
}

// =========================================================================
// ATIVAÇÃO GOJO - VAZIO ROXO CINEMÁTICO (TEMA CLARO)
// =========================================================================
function activateHollowPurple() {
    if (isSukunaEnraged || isGojoEnraged) return;
    isGojoEnraged = true;

    const greeting = document.querySelector('.greeting');
    const nameElement = document.querySelector('.name');
    
    if (greeting && !originalGreeting) originalGreeting = greeting.innerHTML;
    if (nameElement && !originalName) originalName = nameElement.innerHTML;

    // Força tema Claro
    document.body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    const themeToggleBtn = document.getElementById('theme-toggle');
    if(themeToggleBtn) themeToggleBtn.textContent = '☀️';

    if(greeting) greeting.textContent = "TÉCNICA IMAGINÁRIA:";
    if(nameElement) nameElement.innerHTML = "Vazio <span>Roxo</span>";

    // 1. Cria as Esferas de Atração
    const blueOrb = document.createElement('div');
    blueOrb.className = 'hollow-orb orb-blue';
    
    const redOrb = document.createElement('div');
    redOrb.className = 'hollow-orb orb-red';

    document.body.appendChild(blueOrb);
    document.body.appendChild(redOrb);

    // Array para guardar os elementos criados e apagá-los depois
    const elementsToRemove = [blueOrb, redOrb];

    // 2. Momento do Impacto (1.45 segundos após iniciar)
    setTimeout(() => {
        // Inicia Tremor Violento de Câmera
        document.body.classList.add('gojo-domain-active');

        // Cria a Singularidade Roxa
        const purpleOrb = document.createElement('div');
        purpleOrb.className = 'hollow-orb orb-purple';
        document.body.appendChild(purpleOrb);
        elementsToRemove.push(purpleOrb);

        // Cria o Clarão da Tela
        const flashScreen = document.createElement('div');
        flashScreen.className = 'purple-flash';
        document.body.appendChild(flashScreen);
        elementsToRemove.push(flashScreen);

        // Cria 3 Anéis de Onda de Choque (Shockwaves)
        for(let i = 0; i < 3; i++) {
            setTimeout(() => {
                const shockwave = document.createElement('div');
                shockwave.className = 'purple-shockwave';
                document.body.appendChild(shockwave);
                elementsToRemove.push(shockwave);
            }, i * 150); // Delay entre os anéis
        }

        // Cria 40 Partículas de Energia voando para todas as direções
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'purple-particle';
            
            // Matemática para atirar as partículas em um círculo 360º
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 1000 + 400; // O quão longe vão
            const dx = Math.cos(angle) * distance + 'px';
            const dy = Math.sin(angle) * distance + 'px';
            
            particle.style.setProperty('--dx', dx);
            particle.style.setProperty('--dy', dy);
            
            document.body.appendChild(particle);
            elementsToRemove.push(particle);
        }

        // 3. Finaliza tudo e limpa a tela após a explosão
        setTimeout(() => {
            document.body.classList.remove('gojo-domain-active');
            
            elementsToRemove.forEach(el => el.remove());

            if (greeting) greeting.innerHTML = originalGreeting;
            if (nameElement) nameElement.innerHTML = originalName;

            isGojoEnraged = false;
        }, 2000); // Fica ativo por mais 2 segundos

    }, 1450); // Delay do impacto das duas primeiras esferas
}

// =========================================================================
// VERIFICAÇÃO DO CÓDIGO
// =========================================================================
function checkSecretCode() {
    const val = inputField.value.trim().toLowerCase(); 
    
    if (val === 'sukuna') {
        closeSecretModal();
        activateMalevolentShrine();
    } 
    else if (val === 'gojo') {
        closeSecretModal();
        activateHollowPurple();
    } 
    else {
        errorMsg.style.display = 'block'; 
        inputField.value = ''; 
        inputField.focus();
    }
}

submitBtn.addEventListener('click', checkSecretCode);
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkSecretCode();
});

// =========================================================================
// CAÇA AOS DEDOS DO SUKUNA (EASTER EGG INTERATIVO)
// =========================================================================
const totalFingers = 5;
let collectedFingers = JSON.parse(localStorage.getItem('sukunaFingers')) || [];

// Define os locais onde os dedos vão aparecer (espalhados pelas páginas)
const fingerLocations = [
    // 1. Rodapé (Aparece em todas as páginas)
    { id: 'f_footer', selector: 'footer', style: 'bottom: 10px; left: 20px;' },
    // 2. Menu de Navegação (Aparece em todas as páginas)
    { id: 'f_header', selector: '#header', style: 'bottom: -40px; right: 10%; z-index: -1;' },
    // 3. Imagem Hero (Somente no index.html)
    { id: 'f_hero', selector: '.hero-image-wrapper', style: 'top: -10px; left: 10px; z-index: 10;' },
    // 4. Seção de Técnicas (Somente no index.html)
    { id: 'f_skills', selector: '.skills-category', style: 'top: -30px; right: 0px;' },
    // 5. Cabeçalho da Galeria (Somente nas páginas de galeria)
    { id: 'f_gallery', selector: '.gallery-header', style: 'top: 0px; right: 20px;' }
];

function spawnFingers() {
    fingerLocations.forEach(loc => {
        // Se o dedo já foi pego, ele não nasce de novo
        if (collectedFingers.includes(loc.id)) return;

        const parent = document.querySelector(loc.selector);
        if (parent) {
            // Garante que o elemento pai consiga segurar o dedo na posição correta
            if (window.getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }

            const finger = document.createElement('div');
            finger.className = 'sukuna-finger';
            finger.id = loc.id;
            finger.style.cssText = `position: absolute; ${loc.style}`;
            
            // Desenho do Dedo do Sukuna usando SVG puro (Não precisa de imagem externa)
            finger.innerHTML = `
                <svg viewBox="0 0 40 100" width="100%" height="100%" style="filter: drop-shadow(0 0 8px rgba(139,0,0,0.8));">
                    <path d="M10,95 Q5,50 10,10 Q20,-5 30,10 Q35,50 30,95 Q20,105 10,95 Z" fill="#4a2e35"/>
                    <path d="M12,15 Q20,5 28,15 L25,30 Q20,35 15,30 Z" fill="#1a0f12"/>
                    <path d="M8,50 L32,55 M7,70 L33,65 M9,85 L31,88" stroke="#8b0000" stroke-width="3" fill="none"/>
                </svg>
            `;
            
            // Evento ao clicar no dedo
            finger.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita bugs de clique duplo
                collectFinger(loc.id, finger);
            });

            parent.appendChild(finger);
        }
    });

    // Se já tiver os 5 dedos, destrava o botão de ver a arte de novo no menu secreto
    verificarBotaoArteSecreta();
}

function collectFinger(id, element) {
    // Animação do dedo sumindo
    element.style.transform = 'scale(0) rotate(180deg)';
    element.style.opacity = '0';
    
    setTimeout(() => element.remove(), 500);

    collectedFingers.push(id);
    localStorage.setItem('sukunaFingers', JSON.stringify(collectedFingers));

    checkRewards(collectedFingers.length);
    verificarBotaoArteSecreta();
}

function checkRewards(count) {
    let message = `Energia Amaldiçoada absorvida! (${count}/${totalFingers} Dedos)`;
    let rewardArt = null;

    if (count === 1) {
        message = `Você consumiu 1 Dedo do Sukuna!<br><br><strong>RECOMPENSA 1:</strong> A primeira palavra de poder foi revelada: <span style="color:#ff3333; font-weight:bold; letter-spacing:1px; font-size:1.3rem;">sukuna</span>.<br><span style="font-size:0.9rem; color:#aaa;">(Use-a no Pacto Secreto clicando no botão '?')</span>`;
    } 
    else if (count === 3) {
        message = `Você consumiu 3 Dedos do Sukuna!<br><br><strong>RECOMPENSA 2:</strong> A segunda palavra de poder foi revelada: <span style="color:#00bfff; font-weight:bold; letter-spacing:1px; font-size:1.3rem;">gojo</span>.<br><span style="font-size:0.9rem; color:#aaa;">(Use-a no Pacto Secreto clicando no botão '?')</span>`;
    } 
    else if (count === 5) {
        message = `Você consumiu todos os 5 Dedos!<br><br><strong>RECOMPENSA MÁXIMA ALCANÇADA:</strong> Uma Arte Secreta e Proibida foi destrancada apenas para você!`;
        // NOME DA IMAGEM SECRETA:
        rewardArt = 'THUKUNA KKK.gif'; 
    }

    showRewardModal(message, rewardArt);
}

function showRewardModal(text, imageUrl) {
    const existing = document.getElementById('finger-reward-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'finger-reward-modal';
    modal.className = 'reward-modal active';
    
    let contentHtml = `
        <div class="reward-content">
            <button class="reward-close" aria-label="Fechar">✕</button>
            <h3>Item Amaldiçoado</h3>
            <p>${text}</p>
    `;

    if (imageUrl) {
        contentHtml += `
            <div class="secret-art-container">
                <!-- Se quiser mudar o nome da imagem secreta, mude o src abaixo -->
                <img src="${imageUrl}" alt="Arte Secreta" class="secret-art-img" onerror="this.src='Satoru Gozo.jpg'; this.alt='Arte não encontrada';">
                <p class="small-text">Para que a arte apareça, salve sua imagem na pasta com o nome exato de 'Arte Secreta.jpg'</p>
            </div>
        `;
    }

    contentHtml += `</div>`;
    modal.innerHTML = contentHtml;
    document.body.appendChild(modal);

    modal.querySelector('.reward-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

function verificarBotaoArteSecreta() {
    // Se o usuário já pegou os 5 dedos, adiciona um botão no menu de senha '?' para ver a arte novamente
    if (collectedFingers.length === 5) {
        const secretContent = document.querySelector('.secret-content');
        if (secretContent && !document.getElementById('btn-secret-art')) {
            const btn = document.createElement('button');
            btn.id = 'btn-secret-art';
            btn.className = 'btn btn-primary';
            btn.style.marginTop = '20px';
            btn.style.width = '100%';
            btn.style.backgroundColor = '#4b0082';
            btn.style.borderColor = '#4b0082';
            btn.textContent = '🔍 Ver Arte Secreta';
            
            btn.addEventListener('click', () => {
                closeSecretModal();
                checkRewards(5); 
            });
            
            secretContent.appendChild(btn);
        }
    }
}

// Inicia os dedos quando a página carrega
document.addEventListener('DOMContentLoaded', spawnFingers);

// =========================================================================
// BOTÃO "IR PARA O TOPO" (SCROLL TO TOP)
// =========================================================================

// Cria o botão e joga ele na tela
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.setAttribute('aria-label', 'Voltar ao Topo');
// O símbolo abaixo parece a ponta de uma lâmina/lança subindo
scrollTopBtn.innerHTML = '▲'; 
document.body.appendChild(scrollTopBtn);

// Função para mostrar/esconder o botão baseado na rolagem da página
window.addEventListener('scroll', () => {
    // Se rolar mais de 300 pixels para baixo, o botão aparece
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Ação de clicar e subir suavemente
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Faz o scroll ser deslizado e não seco
    });
});