// Gallery page category switching and modal functionality

document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const gallerySections = document.querySelectorAll('.gallery-section');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Hide all sections
            gallerySections.forEach(section => section.classList.remove('active'));

            // Show selected section
            const targetSection = document.getElementById(`${category}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    initGalleryModal();
});

function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // Make items focusable
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('click', () => {
            // Remove focused class from all items
            galleryItems.forEach(i => i.classList.remove('focused'));
            // Add focused class to clicked item
            item.classList.add('focused');
            openGalleryModal(item);
        });
    });
}

function openGalleryModal(item) {
    const title = item.querySelector('h4')?.textContent || 'Gallery Item';
    const description = item.querySelector('p')?.textContent || '';
    const date = item.querySelector('.gallery-date')?.textContent || '';
    const imageElement = item.querySelector('.gallery-image img');
    const placeholderElement = item.querySelector('.image-placeholder');
    
    let modalHTML = `
        <div class="gallery-modal active">
            <div class="gallery-modal-backdrop" onclick="closeGalleryModal()"></div>
            <div class="gallery-modal-content">
                <div class="gallery-modal-header">
                    <h3>${title}</h3>
                    <div class="gallery-modal-actions">
                        <button class="modal-btn" onclick="openFullscreen()">
                            <span>🔍</span> Fullscreen
                        </button>
                        <button class="modal-btn close-btn" onclick="closeGalleryModal()">
                            ✕ Close
                        </button>
                    </div>
                </div>
                <div class="gallery-modal-body">
                    <div class="gallery-modal-image" id="modal-image-container">`;
    
    if (imageElement) {
        const imageSrc = imageElement.src;
        modalHTML += `<img src="${imageSrc}" alt="${title}" id="modal-image">`;
    } else if (placeholderElement) {
        const placeholderText = placeholderElement.textContent;
        modalHTML += `<div class="image-placeholder">${placeholderText}</div>`;
    }
    
    modalHTML += `
                    </div>
                    <div class="gallery-modal-info">
                        <p><strong>${title}</strong></p>
                        <p>${description}</p>
                        <p><span class="gallery-date">${date}</span></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            // Remove focused class from all gallery items
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.classList.remove('focused');
            });
        }, 300);
    }
}

function openFullscreen() {
    const modalImage = document.querySelector('#modal-image');
    if (!modalImage) return;
    
    const imageSrc = modalImage.src;
    const imageAlt = modalImage.alt;
    
    const fullscreenHTML = `
        <div class="gallery-fullscreen active">
            <div class="gallery-fullscreen-controls">
                <button class="gallery-fullscreen-zoom" id="zoom-in-btn">🔍 Zoom In</button>
                <button class="gallery-fullscreen-zoom" id="zoom-out-btn">🔍 Zoom Out</button>
                <button class="gallery-fullscreen-close" onclick="closeFullscreen()">✕ Close</button>
            </div>
            <div class="gallery-fullscreen-content">
                <img src="${imageSrc}" alt="${imageAlt}" class="gallery-fullscreen-image" id="fullscreen-img">
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', fullscreenHTML);
    initFullscreenZoom();
}

function closeFullscreen() {
    const fullscreen = document.querySelector('.gallery-fullscreen');
    if (fullscreen) {
        fullscreen.classList.remove('active');
        setTimeout(() => {
            fullscreen.remove();
        }, 300);
    }
}

function initFullscreenZoom() {
    const img = document.getElementById('fullscreen-img');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    
    if (!img || !zoomInBtn || !zoomOutBtn) return;
    
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.min(scale + 0.25, 3);
        updateTransform();
        updateCursor();
    });
    
    zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.max(scale - 0.25, 1);
        if (scale === 1) {
            translateX = 0;
            translateY = 0;
        }
        updateTransform();
        updateCursor();
    });
    
    img.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            img.classList.add('zoomed');
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    function updateTransform() {
        img.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
    }
    
    function updateCursor() {
        if (scale > 1) {
            img.classList.add('zoomed');
        } else {
            img.classList.remove('zoomed');
        }
    }
}

window.closeGalleryModal = closeGalleryModal;
window.openFullscreen = openFullscreen;
window.closeFullscreen = closeFullscreen;
