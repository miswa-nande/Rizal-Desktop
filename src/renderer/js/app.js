// Rizal Digital Museum - Main Application JavaScript

class RizalMuseumApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFeatureCards();
        this.setupGalleryTabs();
        this.showPage('home');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                
                if (page === 'exit') {
                    this.handleExit();
                    return;
                }
                
                this.navigateToPage(page);
            });
        });
    }

    setupFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const page = card.dataset.navigate;
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });
    }

    setupGalleryTabs() {
        const categoryTabs = document.querySelectorAll('.category-tab');
        
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Here you would typically load different gallery content
                // For now, we'll just update the visual state
                const category = tab.dataset.category;
                this.loadGalleryCategory(category);
            });
        });
    }

    navigateToPage(page) {
        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        // Show the selected page
        this.showPage(page);
        this.currentPage = page;
    }

    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show the selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    loadGalleryCategory(category) {
        // This would typically load different images based on category
        // For now, we'll just log the category change
        console.log(`Loading gallery category: ${category}`);
        
        // You could implement different gallery content here
        const galleryGrid = document.querySelector('.gallery-grid');
        
        // Example: Update gallery items based on category
        const categoryContent = {
            photos: [
                { title: 'Rizal in Europe', description: 'Historical photograph from his travels' },
                { title: 'Calamba Childhood Home', description: 'Rizal\'s birthplace in Laguna' },
                { title: 'Dapitan Exile', description: 'During his exile years' }
            ],
            artifacts: [
                { title: 'Original Manuscripts', description: 'Handwritten documents' },
                { title: 'Personal Items', description: 'Belongings from his travels' },
                { title: 'Medical Instruments', description: 'From his practice as a doctor' }
            ],
            manuscripts: [
                { title: 'Noli Me Tangere Draft', description: 'Original manuscript pages' },
                { title: 'El Filibusterismo', description: 'Handwritten chapters' },
                { title: 'Mi Último Adiós', description: 'Final poem manuscript' }
            ],
            sketches: [
                { title: 'Self Portraits', description: 'Rizal\'s artistic works' },
                { title: 'European Sketches', description: 'Drawings from his travels' },
                { title: 'Scientific Illustrations', description: 'Medical and botanical drawings' }
            ]
        };

        if (categoryContent[category]) {
            this.updateGalleryItems(categoryContent[category]);
        }
    }

    updateGalleryItems(items) {
        const galleryGrid = document.querySelector('.gallery-grid');
        
        galleryGrid.innerHTML = items.map(item => `
            <div class="gallery-item">
                <div class="placeholder-image">${item.title}</div>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    handleExit() {
        if (confirm('Are you sure you want to exit the Rizal Digital Museum?')) {
            // In Electron, we can close the window
            if (typeof require !== 'undefined') {
                const { remote } = require('electron');
                const window = remote.getCurrentWindow();
                window.close();
            } else {
                // Fallback for web version
                window.close();
            }
        }
    }

    // Method to load timeline data (for future implementation)
    async loadTimelineData() {
        try {
            // This would load from your JSON data files
            const response = await fetch('../data/timeline.json');
            const timelineData = await response.json();
            return timelineData;
        } catch (error) {
            console.log('Timeline data not yet available');
            return [];
        }
    }

    // Method to load works data (for future implementation)
    async loadWorksData() {
        try {
            const response = await fetch('../data/works.json');
            const worksData = await response.json();
            return worksData;
        } catch (error) {
            console.log('Works data not yet available');
            return [];
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new RizalMuseumApp();
    
    // Make app globally accessible for debugging
    window.rizalApp = app;
    
    console.log('Rizal Digital Museum initialized successfully');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Add any responsive behavior adjustments here
    console.log('Window resized');
});

// Keyboard navigation support
document.addEventListener('keydown', (event) => {
    const app = window.rizalApp;
    if (!app) return;

    // ESC key to go back to home
    if (event.key === 'Escape') {
        app.navigateToPage('home');
    }
    
    // Number keys for quick navigation
    const keyMap = {
        '1': 'home',
        '2': 'life',
        '3': 'works',
        '4': 'gallery',
        '5': 'interactive',
        '6': 'about'
    };
    
    if (keyMap[event.key]) {
        app.navigateToPage(keyMap[event.key]);
    }
});
