// 0. PROTEÇÃO: se o navegador bloquear o localStorage (arquivo local, modo privado),
//    usa a memória no lugar, para o script não travar e o site continuar funcionando.
(function () {
    try { window.localStorage.getItem('__teste'); return; } catch (e) {}
    const mem = {};
    const fake = {
        getItem: k => (k in mem ? mem[k] : null),
        setItem: (k, v) => { mem[k] = String(v); },
        removeItem: k => { delete mem[k]; },
        clear: () => { for (const k in mem) delete mem[k]; }
    };
    try { Object.defineProperty(window, 'localStorage', { value: fake, configurable: true }); } catch (e) {}
})();

// =========================================================================
// IMAGENS COM NOME ALTERNATIVO
// Se a imagem da esquerda não existir na pasta, o site tenta as da direita, na ordem.
// (Corrige a foto do Geto quando o nome do arquivo não bate com o que está no HTML.)
// =========================================================================
const imagensAlternativas = {
    'Suguru geto 2.jpg': ['Suguru Getou 2.jpg', 'Suguru Getou.jpg']
};

function imagemCarrega(url) {
    return new Promise(resolve => {
        const teste = new Image();
        teste.onload = () => resolve(true);
        teste.onerror = () => resolve(false);
        teste.src = url;
    });
}

async function usarPrimeiraImagemQueExistir(img, candidatas) {
    for (const url of candidatas) {
        if (await imagemCarrega(url)) {
            if (img.getAttribute('src') !== url) img.src = url;
            return;
        }
    }
}

document.querySelectorAll('img').forEach(img => {
    const original = img.getAttribute('src');
    const alternativas = imagensAlternativas[original];
    if (alternativas) usarPrimeiraImagemQueExistir(img, [original, ...alternativas]);
});

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
    if (!typistElement) return; // as páginas de galeria não têm o texto digitado
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

// Função 1: Cortes Reais do Sukuna (Lâminas de Energia Amaldiçoada)
window.createSlash = function() {
    const slash = document.createElement('div');
    slash.className = 'sukuna-slash-blade';

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const angle = Math.random() * 360;

    slash.style.left = `${x}px`;
    slash.style.top = `${y}px`;
    slash.style.setProperty('--angle', `${angle}deg`);

    if (isSukunaEnraged) {
        // Cortes intensos e longos durante a Expansão de Domínio
        const length = Math.random() * 250 + 180; // 180px a 430px
        const thickness = Math.random() * 3 + 2;  // 2px a 5px
        const duration = Math.random() * 180 + 150;

        slash.style.width = `${length}px`;
        slash.style.height = `${thickness}px`;
        slash.style.background = 'linear-gradient(90deg, transparent, #ff0000 30%, #ffffff 50%, #ff0000 70%, transparent)';
        slash.style.boxShadow = '0 0 12px #ff0000, 0 0 25px #8b0000';
        slash.style.animationDuration = `${duration}ms`;

        document.body.appendChild(slash);
        setTimeout(() => slash.remove(), duration);
    } else {
        // Cortes sutis de fundo no tema escuro normal
        const length = Math.random() * 100 + 60;
        const duration = Math.random() * 250 + 200;

        slash.style.width = `${length}px`;
        slash.style.height = '2px';
        slash.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)';
        slash.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.3)';
        slash.style.animationDuration = `${duration}ms`;

        document.body.appendChild(slash);
        setTimeout(() => slash.remove(), duration);
    }
};

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
        const isMobile = window.innerWidth <= 768;

        if (currentTheme === 'dark') {
            if (isSukunaEnraged) return; // durante a expansão, só o loop da fúria gera cortes (evita travar o som)
            const amount = isMobile ? 2 : 4; // Menos partículas no celular
            for (let i = 0; i < amount; i++) {
                createSlash(); // Invoca cortes se for Sukuna
            }
        } else {
            // Tema Claro (Gojo): Quantidade de bolas significativamente reduzida
            // Só gera em cerca de 25% das vezes e apenas 1 partícula por vez
            if (Math.random() > 0.75) {
                const amount = isMobile ? 1 : 1;
                for (let i = 0; i < amount; i++) {
                    createGojoParticle(); // Invoca esferas se for Gojo
                }
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
// MÚSICA DE BACKGROUND (Compatível com Desktop e Mobile)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    if (!bgMusic) return;

    // 1. CONFIGURE AQUI OS NOMES DOS SEUS ARQUIVOS DE ÁUDIO (.mp3)
    const MUSICA_HOME = 'King Gnu - SPECIALZ.mp3';       // Música para o index.html
    const MUSICA_GALERIA = 'Where Our Blue Is Tatsuya Kitani.mp3';  // Música para Gojo e Geto

    // Identifica se está na página inicial ou nas galerias
    const caminho = window.location.pathname.toLowerCase();
    const isGaleria = caminho.includes('galeria') || Boolean(document.querySelector('.gallery-header'));

    const musicaEscolhida = isGaleria ? MUSICA_GALERIA : MUSICA_HOME;
    const chaveTempo = isGaleria ? 'music-time-galeria' : 'music-time-home';

    // Limpa tags <source> antigas (se existirem) e carrega o novo áudio
    bgMusic.innerHTML = '';
    bgMusic.src = musicaEscolhida;
    bgMusic.preload = 'auto';
    bgMusic.volume = 0.20;
    bgMusic.load();

    // 2. Restaura o tempo salvo APENAS quando o celular carregar o áudio
    let tempoRestaurado = false;
    function restaurarTempo() {
        if (tempoRestaurado) return;
        const savedTime = localStorage.getItem(chaveTempo);
        if (savedTime) {
            const time = parseFloat(savedTime);
            if (!isNaN(time) && time > 0) {
                try {
                    bgMusic.currentTime = time;
                } catch (e) {}
            }
        }
        tempoRestaurado = true;
    }

    bgMusic.addEventListener('loadedmetadata', restaurarTempo);

    // 3. Salva continuamente o progresso da música atual
    bgMusic.addEventListener('timeupdate', () => {
        if (!bgMusic.paused && bgMusic.currentTime > 0) {
            localStorage.setItem(chaveTempo, bgMusic.currentTime);
        }
    });

    let musicEnabled = localStorage.getItem('music-playing') !== 'false';

    function removerOuvintes() {
        document.removeEventListener('click', initMusic);
        document.removeEventListener('touchend', initMusic);
        document.removeEventListener('keydown', initMusic);
    }

    async function playMusic() {
        try {
            if (bgMusic.readyState >= 1) {
                restaurarTempo();
            }
            await bgMusic.play();
            musicEnabled = true;
            localStorage.setItem('music-playing', 'true');
            if (musicToggle) musicToggle.classList.add('active');
            // Só remove os eventos depois que o áudio realmente começar a tocar
            removerOuvintes();
        } catch (err) {
            if (musicToggle) musicToggle.classList.remove('active');
        }
    }

    function pauseMusic() {
        bgMusic.pause();
        musicEnabled = false;
        localStorage.setItem('music-playing', 'false');
        if (musicToggle) musicToggle.classList.remove('active');
        removerOuvintes();
    }

    function initMusic() {
        if (musicEnabled) {
            playMusic();
        }
    }

    // Tenta iniciar ao carregar (funciona no PC e se o celular já tiver permissão)
    if (musicEnabled) {
        playMusic();
    } else if (musicToggle) {
        musicToggle.classList.remove('active');
    }

    // No mobile, 'touchend' e 'click' são aceitos como toque válido para liberar áudio
    document.addEventListener('click', initMusic);
    document.addEventListener('touchend', initMusic);
    document.addEventListener('keydown', initMusic);

    // Botão flutuante de Tocar/Pausar
    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
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
/* SUKUNA CORTES REAIS (LÂMINAS) */
    .sukuna-slash-blade {
        position: fixed;
        z-index: 99999 !important;
        pointer-events: none;
        border-radius: 50%;
        transform-origin: center;
        animation: bladeCut ease-out forwards;
    }

    @keyframes bladeCut {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) scaleX(0.1);
        }
        30% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) scaleX(1.1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) scaleX(0.8);
        }
    }

    /* GOJO VAZIO ROXO - ENERGIA CINEMÁTICA */
    .hollow-orb {
        position: fixed;
        top: 50%;
        border-radius: 50%;
        z-index: 100000;
        pointer-events: none;
        mix-blend-mode: normal;
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

// ISSO FAZ O BOTÃO "?" ABRIR A ABA (CORRIGIDO)
secretBtn.addEventListener('click', () => {
    secretModal.classList.add('active');
    inputField.value = ''; 
    errorMsg.style.display = 'none'; 
    inputField.focus(); 
    
    // Força o botão a aparecer sempre que abrir a caixinha
    verificarBotaoArteSecreta();
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
// EFEITOS SONOROS - PRÉ-CARREGAMENTO COM FALLBACK (CORRIGIDO)
// =========================================================================
const urlsEfeitos = {};
const efeitosIndisponiveis = new Set();
const efeitosEmCarga = {};

const sonsAlternativos = {
    'sukuna domain expansion sound effect.mp3': [
        'sukuna-domain.mp3',
        'sukuna-domain-expansion-sound-effect.mp3',
        'sukuna domain expansion sound effect.mp3'
    ]
};

async function precarregarEfeito(arquivo) {
    if (efeitosEmCarga[arquivo] || urlsEfeitos[arquivo] || efeitosIndisponiveis.has(arquivo)) return;

    const candidatos = sonsAlternativos[arquivo] || [arquivo];

    efeitosEmCarga[arquivo] = (async () => {
        for (const nome of candidatos) {
            try {
                const resp = await fetch(encodeURI(nome));
                if (resp.ok) {
                    const blob = await resp.blob();
                    urlsEfeitos[arquivo] = URL.createObjectURL(blob);
                    return;
                }
            } catch (e) {
                // Tenta o próximo nome da lista
            }
        }
        efeitosIndisponiveis.add(arquivo);
        console.warn(`Áudio não encontrado no servidor: ${arquivo}`);
    })();

    return efeitosEmCarga[arquivo];
}

function precarregarTodosEfeitos() {
    ['sukuna-slash.mp3', 'sukuna-slash2.mp3', 'gojo-purple.mp3']
        .forEach(precarregarEfeito);
}

function criarEfeito(arquivo, volume) {
    // Se já sabemos que o arquivo deu 404, retorna um objeto silencioso sem gerar erro no console
    if (efeitosIndisponiveis.has(arquivo)) {
        return {
            play: () => Promise.resolve(),
            pause: () => {},
            addEventListener: () => {},
            currentTime: 0,
            loop: false,
            muted: false
        };
    }

    const origem = urlsEfeitos[arquivo] || encodeURI(arquivo);
    const audio = new Audio(origem);
    audio.preload = 'auto';
    audio.volume = volume;
    return audio;
}

// =========================================================================
// ATIVAÇÃO SUKUNA (TEMA ESCURO) - VOLUMES SEPARADOS
// =========================================================================
let sukunaSessao = 0; // identifica cada execução: áudio/timer atrasado de uma execução antiga não mexe na nova

function activateMalevolentShrine() {
    if (isSukunaEnraged || isGojoEnraged) return; 
    isSukunaEnraged = true;
    const sessao = ++sukunaSessao;
    const sessaoAtiva = () => isSukunaEnraged && sessao === sukunaSessao;

    // --- CONFIGURAÇÃO DE TEMPO ---
    const tempoCortes = 5000; // 5 segundos de massacre

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

    // --- EFEITOS SONOROS (CONFIGURAÇÃO INDIVIDUAL) ---
    // Aqui você define o nome do arquivo e o volume exato (0.0 até 1.0) para cada um deles!
    const configuracaoSons = [
        { arquivo: 'sukuna-slash.mp3', volume: 0.50 },
        { arquivo: 'sukuna-slash2.mp3',volume: 0.50 },
    ];

    // Transforma a sua configuração acima em áudios reais
    const sukunaSounds = configuracaoSons.map(config => {
        const audio = criarEfeito(config.arquivo, config.volume); // volume específico de cada arquivo
        audio.loop = true;
        return audio;
    });

    const bgMusic = document.getElementById('bg-music');

    // Quando o tempo configurado acabar:
    const finalizarSukuna = () => {
        if (!sessaoAtiva()) return; // já encerrado (ou é de uma execução antiga): não faz nada

        document.body.classList.remove('sukuna-domain-active');
        if (greeting) greeting.innerHTML = originalGreeting;
        if (nameElement) nameElement.innerHTML = originalName;
        
        clearInterval(rageInterval); 
        
        // Silencia e zera todos os 3 áudios
        sukunaSounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        isSukunaEnraged = false;

        // Restaura a música de fundo
        if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.02;
    };

    // O tempo só começa a contar quando o áudio principal REALMENTE começa a tocar
    // (no celular ele demora a carregar e, antes, era cortado no meio).
    let fimAgendado = false;
    const agendarFim = () => {
        if (fimAgendado || !sessaoAtiva()) return;
        fimAgendado = true;
        setTimeout(finalizarSukuna, tempoCortes);
    };
    sukunaSounds[0].addEventListener('playing', agendarFim, { once: true });
    setTimeout(agendarFim, 6000); // reserva, caso o áudio nunca comece

    // Dá o play nos 3 áudios AGORA, ainda dentro do clique/Enter da pessoa.
    // (Antes o play ficava dentro de setTimeout: o celular bloqueava ou atrasava o som,
    //  e os 3 efeitos saíam fora de sincronia.)
    // O atraso de 250ms entre um e outro é feito "destampando" o som (muted),
    // então os dois cortes já estão tocando, só entram com 250ms/500ms de diferença.
    sukunaSounds.forEach((audio, index) => {
        if (index > 0) audio.muted = true;

        const promessa = audio.play();
        if (promessa) {
            promessa.catch(e => {
                if (e && e.name === 'AbortError') return; // interrompido ao encerrar o efeito: normal
                console.log('Áudio bloqueado:', e);
                if (index === 0) agendarFim(); // áudio bloqueado: encerra só o visual
            });
        }

        if (index > 0) {
            setTimeout(() => { if (sessaoAtiva()) audio.muted = false; }, index * 250);
        }
    });
    
    // Reduz a música de fundo
    if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.002;

    // Inicia a "chuva" de cortes visuais
    const qtdCortes = window.innerWidth <= 768 ? 6 : 8;

    rageInterval = setInterval(() => {
        for (let i = 0; i < qtdCortes; i++) {
            window.createSlash();
        }
    }, 100);
}

// =========================================================================
// ATIVAÇÃO GOJO - VAZIO ROXO CINEMÁTICO (TEMA CLARO) - SINCRONIZADO
// =========================================================================
function activateHollowPurple() {
    if (isSukunaEnraged || isGojoEnraged) return;
    isGojoEnraged = true;

    // --- CONFIGURAÇÃO DE TEMPO ---
    const tempoConvergencia = 2300; // Tempo que as esferas demoram para se chocar
    const tempoExplosao = 2300;     // Tempo da explosão até o fim do efeito
    const tempoFecharOlhos = 900;   // Inicia o fechamento 0.9s antes do fim

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

    // --- EFEITO SONORO DO GOJO ---
    const gojoAudio = criarEfeito('gojo-purple.mp3', 1.0);
    window.efeitoGojoAtual = gojoAudio;
    gojoAudio.play().catch(e => console.log('Áudio bloqueado:', e));
    
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.002;

    // --- NOVO: CRIA OS SEIS OLHOS DO GOJO ABRINDO ---
    const sixEyesOverlay = document.createElement('div');
    sixEyesOverlay.className = 'six-eyes-overlay';
    
    const eyeSvg = (idSuffix) => `
        <svg class="six-eye" viewBox="0 0 200 100">
            <defs>
                <radialGradient id="gojoIris-${idSuffix}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="25%" stop-color="#a6f0ff" />
                    <stop offset="65%" stop-color="#00bfff" />
                    <stop offset="92%" stop-color="#0055cc" />
                    <stop offset="100%" stop-color="#001f4d" />
                </radialGradient>
                <clipPath id="eyeClip-${idSuffix}">
                    <path d="M 10,55 Q 100,5 190,55 Q 100,98 10,55 Z" />
                </clipPath>
            </defs>
            <!-- Esclera (fundo do olho) -->
            <path d="M 10,55 Q 100,5 190,55 Q 100,98 10,55 Z" fill="#e6f7ff" />
            <!-- Íris e Pupila com brilho -->
            <g clip-path="url(#eyeClip-${idSuffix})">
                <g class="six-eye-iris">
                    <circle cx="100" cy="52" r="34" fill="url(#gojoIris-${idSuffix})" />
                    <circle cx="100" cy="52" r="11" fill="#e0faff" opacity="0.9" />
                    <!-- Reflexos cristalinos -->
                    <circle cx="88" cy="40" r="6" fill="#ffffff" />
                    <circle cx="114" cy="62" r="3" fill="#ffffff" opacity="0.85" />
                </g>
            </g>
            <!-- Cílios brancos característicos do Gojo -->
            <path d="M 6,56 Q 100,0 194,56" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
            <path d="M 22,42 L 10,32 M 45,28 L 36,16 M 155,28 L 164,16 M 178,42 L 190,32" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
            <path d="M 18,58 Q 100,98 182,58" fill="none" stroke="#80dfff" stroke-width="2.5" stroke-linecap="round" />
        </svg>
    `;

    sixEyesOverlay.innerHTML = eyeSvg('left') + eyeSvg('right');
    document.body.appendChild(sixEyesOverlay);

    // 1. Cria as Esferas de Atração (Azul e Vermelho)
    const blueOrb = document.createElement('div');
    blueOrb.className = 'hollow-orb orb-blue';
    blueOrb.style.animationDuration = (tempoConvergencia / 1000) + 's'; 
    
    const redOrb = document.createElement('div');
    redOrb.className = 'hollow-orb orb-red';
    redOrb.style.animationDuration = (tempoConvergencia / 1000) + 's'; 

    document.body.appendChild(blueOrb);
    document.body.appendChild(redOrb);

    const elementsToRemove = [sixEyesOverlay, blueOrb, redOrb];

    // 2. Momento do Impacto
    setTimeout(() => {
        document.body.classList.add('gojo-domain-active');

        const purpleOrb = document.createElement('div');
        purpleOrb.className = 'hollow-orb orb-purple';
        purpleOrb.style.animationDuration = (tempoExplosao / 1000) + 's';
        document.body.appendChild(purpleOrb);
        elementsToRemove.push(purpleOrb);

        const flashScreen = document.createElement('div');
        flashScreen.className = 'purple-flash';
        flashScreen.style.animationDuration = (tempoExplosao / 1000) + 's';
        document.body.appendChild(flashScreen);
        elementsToRemove.push(flashScreen);

        for(let i = 0; i < 3; i++) {
            setTimeout(() => {
                const shockwave = document.createElement('div');
                shockwave.className = 'purple-shockwave';
                shockwave.style.animationDuration = '1.5s'; 
                document.body.appendChild(shockwave);
                elementsToRemove.push(shockwave);
            }, i * 200); 
        }

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'purple-particle';
            particle.style.animationDuration = '1.5s';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 1000 + 400; 
            const dx = Math.cos(angle) * distance + 'px';
            const dy = Math.sin(angle) * distance + 'px';
            
            particle.style.setProperty('--dx', dx);
            particle.style.setProperty('--dy', dy);
            
            document.body.appendChild(particle);
            elementsToRemove.push(particle);
        }

        // --- NOVO: FECHA OS OLHOS POUCO ANTES DA EXPLOSÃO ACABAR ---
        setTimeout(() => {
            sixEyesOverlay.classList.add('closing');
        }, Math.max(0, tempoExplosao - tempoFecharOlhos));

        // 3. Finaliza tudo e limpa a tela após a explosão
        setTimeout(() => {
            document.body.classList.remove('gojo-domain-active');
            
            elementsToRemove.forEach(el => el.remove());

            if (greeting) greeting.innerHTML = originalGreeting;
            if (nameElement) nameElement.innerHTML = originalName;

            isGojoEnraged = false;

            if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.02;

        }, tempoExplosao);

    }, tempoConvergencia - 100); 
}

// =========================================================================
// VERIFICAÇÃO DO CÓDIGO
// =========================================================================
function checkSecretCode() {
    const val = inputField.value.trim().toLowerCase(); 
    
    if (val === 'sukuna') {
        closeSecretModal();
        activateMalevolentShrine();
        const configuracaoSons = [
            { arquivo: 'sukuna-slash.mp3', volume: 0.7 },
            { arquivo: 'sukuna-slash2.mp3', volume: 0.7 }
        ];
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
    // 1. VISÍVEL (Todas as páginas): Flutuando de forma óbvia no meio do rodapé (Footer).
    { id: 'f_footer', selector: 'footer', style: 'top: -30px; left: 50%; transform: translateX(-50%) rotate(15deg); z-index: 10;' },
    
    // 2. BEM ESCONDIDO (Todas as páginas): Atrás da barra de navegação no topo esquerdo. Quase invisível, só a pontinha aparece.
    { id: 'f_header', selector: '.nav-container', style: 'bottom: -35px; left: 15px; z-index: -1; transform: rotate(160deg); opacity: 0.6;' },
    
    // 3. VISÍVEL (Apenas na Página Inicial): Grudado na borda da imagem de perfil brilhante.
    { id: 'f_hero', selector: '.hero-image-wrapper', style: 'bottom: 10px; right: -30px; z-index: 10; transform: rotate(-25deg);' },
    
    // 4. ESCONDIDO (Apenas na Página Inicial): Camuflado e escondido um pouco acima dos cartões de Técnicas/Domínios.
    { id: 'f_skills', selector: '.skills-grid', style: 'top: -45px; right: 5%; z-index: -1; transform: rotate(45deg); filter: brightness(0.6);' },
    
    // 5. VISÍVEL (Apenas nas páginas de Galeria): Obriga o usuário a entrar em alguma arte para achar o último dedo perto do título.
    { id: 'f_gallery', selector: '.gallery-header', style: 'bottom: 10px; right: 15%; z-index: 10; transform: rotate(-15deg);' }
]

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

// =========================================================================
// BOTÃO DA ARTE SECRETA (Aparece no modal '?' ao coletar os 5 dedos)
// =========================================================================
function verificarBotaoArteSecreta() {
    const secretContent = document.querySelector('.secret-content');
    const resetBtn = document.getElementById('btn-reset-fingers');
    if (!secretContent || !resetBtn) return;

    // Atualiza a lista direto do localStorage para garantir sincronia entre páginas
    const dedosSalvos = JSON.parse(localStorage.getItem('sukunaFingers')) || [];
    let btnArt = document.getElementById('btn-secret-art');

    // Se ainda não pegou todos os 5 dedos, remove o botão (caso exista) e sai
    if (dedosSalvos.length < totalFingers) {
        if (btnArt) btnArt.remove();
        return;
    }

    // Cria o botão apenas se ele ainda não estiver na tela
    if (!btnArt) {
        btnArt = document.createElement('button');
        btnArt.id = 'btn-secret-art';
        btnArt.type = 'button';
        btnArt.className = 'btn btn-primary';
        btnArt.innerHTML = '👁️ Ver Arte Secreta';
        btnArt.style.cssText = `
            margin-top: 15px;
            width: 100%;
            background: linear-gradient(45deg, #4b0082, #8b0000);
            border: 1px solid #ff3333;
            color: #fff;
            padding: 10px;
            font-size: 0.95rem;
            box-shadow: 0 0 15px rgba(139, 0, 0, 0.6);
        `;

        btnArt.addEventListener('click', () => {
            closeSecretModal();
            showRewardModal(
                `<strong>ARTE SECRETA DESBLOQUEADA!</strong><br><br>Você absorveu todos os 5 Dedos do Rei das Maldições. Clique na imagem abaixo para ampliar.`,
                'Thukuna.jpg'
            );
        });

        // Insere o botão logo acima do botão "Resetar Dedos do Sukuna"
        secretContent.insertBefore(btnArt, resetBtn);
    }
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
        rewardArt = 'Thukuna.jpg'; 
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
        <div class="reward-content" style="max-width: 90vw; width: 500px; display: flex; flex-direction: column; align-items: center;">
            <button class="reward-close" aria-label="Fechar">✕</button>
            <h3>Item Amaldiçoado</h3>
            <p style="text-align: center; width: 100%;">${text}</p>
    `;

    if (imageUrl) {
        contentHtml += `
            <div class="secret-art-container" style="width: 100%; height: 350px; display: flex; justify-content: center; align-items: center; overflow: hidden; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 15px;">
                <img src="${imageUrl}" alt="Arte Secreta" class="secret-art-img" 
                     style="max-width: 100%; max-height: 100%; object-fit: contain; display: block; cursor: pointer;"
                     onerror="this.src='Satoru Gozo.jpg'; this.alt='Arte não encontrada';">
            </div>
        `;
    }

    contentHtml += `</div>`;
    modal.innerHTML = contentHtml;
    document.body.appendChild(modal);

    // Conecta o clique direto na Arte Secreta para abrir o modo de visualização
    const secretImg = modal.querySelector('.secret-art-img');
    if (secretImg) {
        secretImg.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const lbModal = document.getElementById('lightbox-modal');
            if (lbModal) {
                document.body.appendChild(lbModal);
                lbModal.style.setProperty('z-index', '999990', 'important');
            }

            if (typeof window.openLightbox === 'function') {
                window.openLightbox(secretImg);
            }
        });
    }

    modal.querySelector('.reward-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
        // Libera a rolagem por toque (o visualizador de imagem pode ter deixado travada)
        if (typeof window.liberarRolagem === 'function') window.liberarRolagem();
        else document.body.style.overflow = '';
    });
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

// =========================================================================
// BOTÃO EXTRA FLUTUANTE DE VOLTAR (Apenas nas pastas/galerias)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos em uma página de galeria (não na principal)
    // Ele confere se a URL tem "galeria" ou se existe o cabeçalho de galeria
    const isGalleryPage = window.location.pathname.includes('galeria') || document.querySelector('.gallery-header');

    if (isGalleryPage) {
        // Cria o botão no HTML
        const extraBackBtn = document.createElement('a');
        extraBackBtn.href = 'index.html#projetos';
        extraBackBtn.className = 'extra-back-btn';
        extraBackBtn.title = 'Voltar para as Artes';
        extraBackBtn.innerHTML = '←'; // Seta apontando pra esquerda
        
        document.body.appendChild(extraBackBtn);

        // Adiciona o CSS automaticamente via JS para você não precisar mexer no style.css
        const style = document.createElement('style');
        style.innerHTML = `
            .extra-back-btn {
                position: fixed;
                bottom: 90px; /* Fica perfeitamente simétrico, acima do botão secreto '?' */
                left: 25px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--glass-bg);
                border: 1px solid var(--accent-primary);
                color: var(--accent-primary);
                font-size: 1.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                z-index: 9998;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                box-shadow: var(--shadow-aura);
                text-decoration: none;
            }

            .extra-back-btn:hover {
                background: var(--accent-primary);
                color: #fff;
                transform: scale(1.1) translateX(-5px); /* Dá um empurrãozinho para a esquerda */
                box-shadow: 0 0 20px rgba(139, 0, 0, 0.8);
            }

            /* Brilho Azulado se estiver no tema claro do Gojo */
            [data-theme="light"] .extra-back-btn:hover {
                box-shadow: 0 0 20px rgba(0, 191, 255, 0.8);
            }
            
            @media (max-width: 768px) {
                .extra-back-btn {
                    bottom: 85px;
                    left: 20px;
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// =========================================================================
// PROTEÇÃO DE IMAGENS E DETECÇÃO DE CAPTURA DE TELA (PC E MOBILE)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Impede o atributo draggable em todas as imagens atuais e futuras
    function protegerImagens() {
        document.querySelectorAll('img').forEach(img => {
            img.setAttribute('draggable', 'false');
        });
    }
    protegerImagens();

    // Observa imagens criadas dinamicamente (como a Arte Secreta e o Lightbox)
    const obsImagens = new MutationObserver(protegerImagens);
    obsImagens.observe(document.body, { childList: true, subtree: true });

    // 2. Bloqueia clique direito (PC) e menu de segurar o dedo (Mobile) nas imagens
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('.gallery-item, .lightbox-stage, .secret-art-container, .project-img-container')) {
            e.preventDefault();
            return false;
        }
    }, true);

    // 3. Impede arrastar a imagem para outra aba ou para a área de trabalho
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, true);

    // 4. Bloqueia atalhos de teclado (PrintScreen, Ctrl+S, Ctrl+P, Ctrl+U, F12)
    document.addEventListener('keydown', (e) => {
        const tecla = e.key.toLowerCase();

        // Bloqueia PrintScreen
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            ativarEscudoPrint(1500);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('').catch(() => {});
            }
        }

        // Bloqueia Ctrl+S (Salvar), Ctrl+P (Imprimir), Ctrl+U (Código-fonte) e Ctrl+Shift+I/S
        if ((e.ctrlKey || e.metaKey) && (tecla === 's' || tecla === 'p' || tecla === 'u')) {
            e.preventDefault();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (tecla === 'i' || tecla === 's' || tecla === 'c')) {
            e.preventDefault();
        }
    });

    // 5. Escudo visual contra Ferramenta de Captura (Win+Shift+S) e troca de aba no Mobile
    function ativarEscudoPrint(tempoMs = 0) {
        document.body.classList.add('anti-print-blur');
        if (tempoMs > 0) {
            setTimeout(() => {
                document.body.classList.remove('anti-print-blur');
            }, tempoMs);
        }
    }

    // Borra a tela imediatamente quando a aba perde foco (ex: abrir ferramenta de print ou menu do celular)
    window.addEventListener('blur', () => {
        ativarEscudoPrint();
    });

    window.addEventListener('focus', () => {
        document.body.classList.remove('anti-print-blur');
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            ativarEscudoPrint();
        } else {
            document.body.classList.remove('anti-print-blur');
        }
    });
});