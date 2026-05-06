// =========================================================================
// LIGHTBOX - SISTEMA DE VISUALIZAÇÃO E ZOOM DE IMAGENS
// =========================================================================

const lightboxModal = document.createElement('div');
lightboxModal.id = 'lightbox-modal';
lightboxModal.className = 'lightbox-modal';
lightboxModal.innerHTML = `
    <div class="lightbox-container">
        <button class="lightbox-close" aria-label="Fechar">✕</button>
        <button class="lightbox-prev" aria-label="Imagem Anterior">❮</button>
        <button class="lightbox-next" aria-label="Próxima Imagem">❯</button>
        <img src="" alt="Lightbox Image" class="lightbox-image">
        <div class="lightbox-controls">
            <button class="lightbox-zoom-in" aria-label="Aumentar Zoom">🔍+</button>
            <button class="lightbox-zoom-out" aria-label="Diminuir Zoom">🔍−</button>
            <button class="lightbox-reset-zoom" aria-label="Resetar Zoom">Resetar</button>
            <span class="lightbox-counter">1 / 1</span>
        </div>
    </div>
`;

document.body.appendChild(lightboxModal);

let currentImageIndex = 0;
let galleryImages = [];
let zoomLevel = 1;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;
const ZOOM_STEP = 0.2;

// Elementos do lightbox
const modal = document.getElementById('lightbox-modal');
const lightboxImage = modal.querySelector('.lightbox-image');
const closeBtn = modal.querySelector('.lightbox-close');
const prevBtn = modal.querySelector('.lightbox-prev');
const nextBtn = modal.querySelector('.lightbox-next');
const zoomInBtn = modal.querySelector('.lightbox-zoom-in');
const zoomOutBtn = modal.querySelector('.lightbox-zoom-out');
const resetZoomBtn = modal.querySelector('.lightbox-reset-zoom');
const counterSpan = modal.querySelector('.lightbox-counter');

// Função para abrir o lightbox
function openLightbox(imageElement) {
    // Pega todas as imagens da galeria da seção atual
    const section = imageElement.closest('section');
    galleryImages = Array.from(section.querySelectorAll('.gallery-img'));
    
    // Encontra o índice da imagem clicada
    currentImageIndex = galleryImages.indexOf(imageElement);
    
    // Exibe o modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloqueia scroll
    
    // Carrega a imagem
    loadImage();
    resetZoom();
}

// Função para fechar o lightbox
function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaura scroll
    zoomLevel = 1;
}

// Função para carregar a imagem atual
function loadImage() {
    const img = galleryImages[currentImageIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    
    // Atualiza o contador
    counterSpan.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    
    // Desabilita botões de navegação se necessário
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === galleryImages.length - 1;
}

// Função para ir para a próxima imagem
function nextImage() {
    if (currentImageIndex < galleryImages.length - 1) {
        currentImageIndex++;
        loadImage();
        resetZoom();
    }
}

// Função para voltar à imagem anterior
function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        loadImage();
        resetZoom();
    }
}

// Função para aumentar zoom
function zoomIn() {
    if (zoomLevel < MAX_ZOOM) {
        zoomLevel += ZOOM_STEP;
        applyZoom();
    }
}

// Função para diminuir zoom
function zoomOut() {
    if (zoomLevel > MIN_ZOOM) {
        zoomLevel -= ZOOM_STEP;
        applyZoom();
    }
}

// Função para resetar zoom
function resetZoom() {
    zoomLevel = 1;
    applyZoom();
}

// Função para aplicar o zoom à imagem
function applyZoom() {
    lightboxImage.style.transform = `scale(${zoomLevel.toFixed(2)})`;
}

// Event Listeners
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);
zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);
resetZoomBtn.addEventListener('click', resetZoom);

// Fechar ao clicar fora da imagem
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeLightbox();
    }
});

// Navegação com teclado
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            prevImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
        case '+':
        case '=':
            zoomIn();
            break;
        case '-':
        case '_':
            zoomOut();
            break;
    }
});

// Adiciona event listeners a todas as imagens da galeria
document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(img));
    });
});