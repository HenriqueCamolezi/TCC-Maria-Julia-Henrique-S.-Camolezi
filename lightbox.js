// =========================================================================
// LIGHTBOX - SISTEMA DE VISUALIZAÇÃO E ZOOM DE IMAGENS
// =========================================================================

let currentImageIndex = 0;
let galleryImages = [];
let zoomLevel = 1;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;
const ZOOM_STEP = 0.25;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0;
let offsetY = 0;

// Cria o modal apenas uma vez
const lightboxModal = document.createElement('div');
lightboxModal.id = 'lightbox-modal';
lightboxModal.className = 'lightbox-modal';
lightboxModal.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Fechar">✕</button>
    <button type="button" class="lightbox-prev" aria-label="Imagem Anterior">❮</button>
    <button type="button" class="lightbox-next" aria-label="Próxima Imagem">❯</button>
    
    <div class="lightbox-container">
        <div class="lightbox-stage">
            <img src="" alt="Lightbox Image" class="lightbox-image">
        </div>
        <div class="lightbox-controls">
            <button type="button" class="lightbox-zoom-in" aria-label="Aumentar Zoom">🔍+</button>
            <button type="button" class="lightbox-zoom-out" aria-label="Diminuir Zoom">🔍−</button>
            <button type="button" class="lightbox-reset-zoom" aria-label="Resetar Zoom">Resetar</button>
            <span class="lightbox-counter">1 / 1</span>
        </div>
    </div>
`;

function ensureLightboxInBody() {
    if (document.body && !document.getElementById('lightbox-modal')) {
        document.body.appendChild(lightboxModal);
    }
}

if (document.body) {
    ensureLightboxInBody();
} else {
    document.addEventListener('DOMContentLoaded', ensureLightboxInBody);
}

const lightboxStage = lightboxModal.querySelector('.lightbox-stage');
const lightboxImage = lightboxModal.querySelector('.lightbox-image');
const closeBtn = lightboxModal.querySelector('.lightbox-close');
const prevBtn = lightboxModal.querySelector('.lightbox-prev');
const nextBtn = lightboxModal.querySelector('.lightbox-next');
const zoomInBtn = lightboxModal.querySelector('.lightbox-zoom-in');
const zoomOutBtn = lightboxModal.querySelector('.lightbox-zoom-out');
const resetZoomBtn = lightboxModal.querySelector('.lightbox-reset-zoom');
const counterSpan = lightboxModal.querySelector('.lightbox-counter');

// Função global para abrir o visualizador (Galerias + Arte Secreta)
window.openLightbox = function(imageElement) {
    if (!imageElement) return;
    ensureLightboxInBody();

    const section = imageElement.closest('section');
    if (section && imageElement.classList.contains('gallery-img')) {
        galleryImages = Array.from(section.querySelectorAll('.gallery-img'));
        currentImageIndex = galleryImages.indexOf(imageElement);
    } else {
        galleryImages = [imageElement];
        currentImageIndex = 0;
    }

    // Garante que fique acima de outros modais e abaixo do cursor customizado
    document.body.appendChild(lightboxModal);
    lightboxModal.style.setProperty('z-index', '999990', 'important');
    closeBtn.style.setProperty('z-index', '999995', 'important');
    prevBtn.style.setProperty('z-index', '999995', 'important');
    nextBtn.style.setProperty('z-index', '999995', 'important');
    lightboxModal.querySelector('.lightbox-controls').style.setProperty('z-index', '999995', 'important');

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    loadImage();
    resetZoom();
};

function closeLightbox() {
    lightboxModal.classList.remove('active');
    resetZoom();

    const otherModalOpen = document.querySelector('.reward-modal.active, .secret-modal.active, .nav-menu.active');
    if (!otherModalOpen) {
        document.body.style.overflow = '';
    }
}

function loadImage() {
    const img = galleryImages[currentImageIndex];
    if (!img) return;

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || 'Arte';
    counterSpan.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;

    prevBtn.disabled = currentImageIndex <= 0;
    nextBtn.disabled = currentImageIndex >= galleryImages.length - 1;
}

function nextImage() {
    if (currentImageIndex < galleryImages.length - 1) {
        currentImageIndex++;
        loadImage();
        resetZoom();
    }
}

function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        loadImage();
        resetZoom();
    }
}

function updateZoomButtons() {
    zoomOutBtn.disabled = zoomLevel <= MIN_ZOOM;
    zoomInBtn.disabled = zoomLevel >= MAX_ZOOM;
    resetZoomBtn.disabled = zoomLevel === MIN_ZOOM && offsetX === 0 && offsetY === 0;
}

function zoomIn() {
    if (zoomLevel < MAX_ZOOM) {
        zoomLevel = Math.min(MAX_ZOOM, Math.round((zoomLevel + ZOOM_STEP) * 100) / 100);
        clampOffsets();
        applyZoom();
    }
}

function zoomOut() {
    if (zoomLevel > MIN_ZOOM) {
        zoomLevel = Math.max(MIN_ZOOM, Math.round((zoomLevel - ZOOM_STEP) * 100) / 100);
        clampOffsets();
        applyZoom();
    }
}

function resetZoom() {
    zoomLevel = 1;
    offsetX = 0;
    offsetY = 0;
    isDragging = false;
    lightboxImage.style.transition = 'transform 0.2s ease';
    applyZoom();
}

function clampOffsets() {
    if (zoomLevel <= 1) {
        offsetX = 0;
        offsetY = 0;
        return;
    }

    const maxX = (lightboxImage.offsetWidth * (zoomLevel - 1)) / 2;
    const maxY = (lightboxImage.offsetHeight * (zoomLevel - 1)) / 2;

    offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
    offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
}

function applyZoom() {
    lightboxImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
    lightboxImage.style.cursor = zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
    updateZoomButtons();
}

// =========================================================================
// ZOOM COM SCROLL DO MOUSE
// =========================================================================
lightboxStage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
}, { passive: false });

// =========================================================================
// ARRASTAR A IMAGEM (MOUSE + TOUCH CORRIGIDO PARA MOBILE)
// =========================================================================
function startDrag(clientX, clientY) {
    if (zoomLevel <= 1) return;
    isDragging = true;
    dragStartX = clientX - offsetX;
    dragStartY = clientY - offsetY;
    lightboxImage.style.transition = 'none';
    lightboxImage.style.cursor = 'grabbing';
}

function moveDrag(clientX, clientY) {
    if (!isDragging || zoomLevel <= 1) return;
    offsetX = clientX - dragStartX;
    offsetY = clientY - dragStartY;
    clampOffsets();
    applyZoom();
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    lightboxImage.style.transition = 'transform 0.2s ease';
    lightboxImage.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
}

lightboxImage.addEventListener('mousedown', (e) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
window.addEventListener('mouseup', endDrag);

lightboxImage.addEventListener('touchstart', (e) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('touchend', endDrag);

// =========================================================================
// ABERTURA PARA GALERIAS E ARTE SECRETA (DESKTOP E MOBILE)
// =========================================================================
function handleImageOpen(e) {
    const targetImg = e.target.closest('.gallery-img, .secret-art-img');
    if (!targetImg || targetImg.classList.contains('lightbox-image')) return;

    e.preventDefault();
    e.stopPropagation();
    window.openLightbox(targetImg);
}

document.addEventListener('click', handleImageOpen);

// =========================================================================
// EVENTOS DOS BOTÕES E FECHAMENTO
// =========================================================================
closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
zoomInBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomIn(); });
zoomOutBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomOut(); });
resetZoomBtn.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });

lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target === lightboxStage) {
        closeLightbox();
    }
});

// =========================================================================
// NAVEGAÇÃO COM TECLADO
// =========================================================================
document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;

    e.stopImmediatePropagation();

    switch (e.key) {
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
}, true);
