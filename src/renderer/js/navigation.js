// Navigation System for Rizal Digital Museum

const { ipcRenderer } = require('electron');

class NavigationSystem {
    constructor() {
        this.currentPage = this.getCurrentPageFromURL();
        this.init();
    }

    getCurrentPageFromURL() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop().replace('.html', '');
        return pageName || 'home';
    }

    init() {
        this.setupNavigation();
        this.setupFeatureCards();
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

    navigateToPage(page) {
        // Construct the path to the page
        const pagePath = `${page}.html`;
        
        // Navigate to the new page
        window.location.href = pagePath;
    }

    handleExit() {
        if (confirm('Are you sure you want to exit the Rizal Digital Museum?')) {
            try {
                // Use ipcRenderer to send close event to main process
                ipcRenderer.send('close-app');
            } catch (error) {
                console.error('Error closing app:', error);
                // Fallback to window.close()
                window.close();
            }
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new NavigationSystem();
    window.navigationSystem = navigation;
});

// Smooth scroll behavior
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.scrollBehavior = 'smooth';
    }
});
