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
const wordsToType = ["Desenhista", "Feiticeiro de Grau Especial"];
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
// SLASHES DO SUKUNA (Animações de Corte com Detecção de Device)
// =========================================================================

function createSlash() {
    const slashChars = ['/'];
    const randomSlash = slashChars[Math.floor(Math.random() * slashChars.length)];
    
    const slash = document.createElement('div');
    slash.className = 'sukuna-slash';
    slash.textContent = randomSlash;
    
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    
    slash.style.left = `${randomX}px`;
    slash.style.top = `${randomY}px`;
    
    // 50% de chance de vibrar
    if (Math.random() > 0.5) {
        slash.classList.add('vibrate');
    }
    
    document.body.appendChild(slash);
    
    // Remove o slash após a animação
    setTimeout(() => {
        slash.remove();
    }, 600);
}

// Gera slashes periodicamente (menos frequentes em mobile)
function initSlashAnimation() {
    const isMobile = window.innerWidth <= 768;
    const interval = isMobile ? 5000 : 3000; // 5s em mobile, 3s em desktop
    
    setInterval(() => {
        // 70% de chance de criar um slash
        if (Math.random() > 0.3) {
            createSlash();
        }
    }, interval);
}

// Gera slashes ao fazer scroll (menos frequente em mobile)
window.addEventListener('scroll', () => {
    const isMobile = window.innerWidth <= 768;
    const chance = isMobile ? 0.05 : 0.1; // 5% em mobile, 10% em desktop
    
    if (Math.random() < chance) {
        createSlash();
    }
});

// Gera slashes ao clicar (compatível com touch)
document.addEventListener('click', (e) => {
    const isMobile = window.innerWidth <= 768;
    const chance = isMobile ? 0.15 : 0.3; // 15% em mobile, 30% em desktop
    
    if (Math.random() < chance) {
        // Cria 1-2 slashes perto do clique
        const numSlashes = isMobile ? 1 : (Math.random() > 0.5 ? 1 : 2);
        
        for (let i = 0; i < numSlashes; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 150;
                const offsetY = (Math.random() - 0.5) * 150;
                
                const slash = document.createElement('div');
                slash.className = 'sukuna-slash';
                slash.textContent = Math.random() > 0.5 ? '/' : '';
                
                slash.style.left = `${e.clientX + offsetX}px`;
                slash.style.top = `${e.clientY + offsetY}px`;
                
                document.body.appendChild(slash);
                
                setTimeout(() => {
                    slash.remove();
                }, 600);
            }, i * 100);
        }
    }
});

// Inicializa slashes periódicos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initSlashAnimation);

// =========================================================================
// RESIZE LISTENER PARA AJUSTES EM TEMPO REAL
// =========================================================================
window.addEventListener('resize', () => {
    // Reposiciona elementos se necessário
    if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
        toggleMenu();
    }
});