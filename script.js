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


// 2. CURSOR DE ENERGIA AMALDIÇOADA
const cursorDot = document.querySelector('.cursor-dot');
const cursorTrail = document.querySelector('.cursor-trail');

// Atualiza a posição do cursor baseado no movimento do mouse
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // O ponto central segue instantaneamente
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // O rastro (trail) tem um leve delay controlado pelo CSS (transition)
    // Usamos setTimeout para criar o efeito de "cauda amaldiçoada" arrastando
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
        cursorTrail.style.backgroundColor = 'rgba(139, 0, 0, 0.1)'; // Tom vermelho fraco
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.backgroundColor = 'transparent';
    });
});


// 3. EFEITO DE DIGITAÇÃO (Typing Effect para a Seção Hero)
const wordsToType = ["Desenhista", "Feiticeiro de Grau Especial"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typistElement = document.getElementById('typist');

function typeEffect() {
    const currentWord = wordsToType[wordIndex];
    
    if (isDeleting) {
        // Apaga um caractere
        typistElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Digita um caractere
        typistElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Velocidades variáveis de digitação (simulando energia natural)
    let typeSpeed = isDeleting ? 50 : 100;

    // Se terminou de digitar a palavra inteira
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pausa no final da palavra
        isDeleting = true;
    } 
    // Se apagou a palavra inteira
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsToType.length; // Cicla para a próxima palavra
        typeSpeed = 500; // Pausa antes de começar a próxima
    }

    setTimeout(typeEffect, typeSpeed);
}

// Inicia o feitiço de digitação ao carregar a página
document.addEventListener('DOMContentLoaded', typeEffect);


// 4. MENU MOBILE (Cortina / Veil Toggle)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Trava o scroll do body quando o menu está aberto para evitar fundo rolando
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

hamburger.addEventListener('click', toggleMenu);

// Fecha o menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});


// 5. OBSERVAÇÃO DE INTERSEÇÃO (Revelação de Domínio On-Scroll)
// Esta API observa quando os elementos entram na viewport
const fadeElements = document.querySelectorAll('.section-hidden');
const progressBars = document.querySelectorAll('.progress-bar');

const observerOptions = {
    root: null, // usa a viewport do browser
    threshold: 0.2, // Dispara quando 20% do elemento estiver visível
    rootMargin: "0px 0px -50px 0px" // Dispara um pouco antes de chegar na borda inferior
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return; // Ignora se não estiver na tela
        
        // Adiciona classe para animar opacidade e translação (Slide Up Fade)
        entry.target.classList.add('section-show');
        
        // Verifica se a seção tem barras de progresso (Técnicas) para animá-las
        if (entry.target.id === 'habilidades') {
            progressBars.forEach(bar => {
                // Pega a largura alvo do atributo data-width
                const targetWidth = bar.getAttribute('data-width');
                // O CSS cuidará da transição suave da largura
                bar.style.width = targetWidth; 
            });
        }

        // Para de observar o elemento após a animação rodar 1 vez
        observer.unobserve(entry.target);
    });
}, observerOptions);

// Inicia a observação de todas as seções escondidas
fadeElements.forEach(el => sectionObserver.observe(el));


// 6. DESTAQUE NO MENU ATIVO DURANTE SCROLL
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Se rolamos passado de 1/3 da seção, consideramos ela ativa
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Se o href do link contiver o id da seção atual, adicione classe active
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});