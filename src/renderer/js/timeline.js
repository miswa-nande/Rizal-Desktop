class RizalTimeline {
    constructor() {
        this.timelineData = [];
        this.filteredData = [];
        this.currentFilter = 'all';
    }

    async loadTimelineData() {
        try {
            const response = await fetch('../../data/comprehensive_timeline.json');
            const data = await response.json();
            this.timelineData = data.timeline_events;
            this.filteredData = this.timelineData;
            return true;
        } catch (error) {
            console.error('Error loading timeline data:', error);
            return false;
        }
    }

    getCategories() {
        const categories = new Set();
        this.timelineData.forEach(event => {
            categories.add(event.category);
        });
        return ['all', ...Array.from(categories)];
    }

    filterByCategory(category) {
        this.currentFilter = category;
        if (category === 'all') {
            this.filteredData = this.timelineData;
        } else {
            this.filteredData = this.timelineData.filter(event => event.category === category);
        }
        this.renderTimeline();
        this.attachEventListeners();
    }

    searchEvents(query) {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) {
            this.filteredData = this.currentFilter === 'all' 
                ? this.timelineData 
                : this.timelineData.filter(event => event.category === this.currentFilter);
        } else {
            const baseData = this.currentFilter === 'all' 
                ? this.timelineData 
                : this.timelineData.filter(event => event.category === this.currentFilter);
            
            this.filteredData = baseData.filter(event => {
                return event.title.toLowerCase().includes(searchTerm) ||
                       event.description.toLowerCase().includes(searchTerm) ||
                       event.date.toLowerCase().includes(searchTerm) ||
                       (event.location && event.location.toLowerCase().includes(searchTerm)) ||
                       (event.significance && event.significance.toLowerCase().includes(searchTerm));
            });
        }
        this.renderTimeline();
        this.attachEventListeners();
    }

    renderCategoryFilters() {
        const categories = this.getCategories();
        const filterContainer = document.getElementById('timeline-filters');
        
        if (!filterContainer) return;

        filterContainer.innerHTML = categories.map(category => `
            <button class="timeline-filter-btn ${category === this.currentFilter ? 'active' : ''}" 
                    data-category="${category}">
                ${category === 'all' ? 'All Events' : category}
            </button>
        `).join('');

        // Attach click listeners to filter buttons
        const filterButtons = filterContainer.querySelectorAll('.timeline-filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-category');
                this.filterByCategory(category);
            });
        });
    }

    renderTimeline() {
        const container = document.getElementById('timeline-container');
        if (!container) return;

        container.innerHTML = `
            <div class="timeline-wrapper">
                ${this.filteredData.map((event, index) => this.renderTimelineEvent(event, index)).join('')}
            </div>
        `;

        this.renderCategoryFilters();
    }

    renderTimelineEvent(event, index) {
        const hasImage = event.image_filename;
        const hasDetails = event.details && event.details.length > 0;
        const eventId = `event-${index}`;

        return `
            <div class="timeline-event ${index % 2 === 0 ? 'left' : 'right'}" data-category="${event.category}">
                <div class="timeline-marker">
                    <div class="timeline-dot"></div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-date">${event.date}</div>
                    <div class="timeline-category-badge">${event.category}</div>
                    
                    ${hasImage ? `
                        <div class="timeline-image">
                            <img src="../../assets/images/${event.image_filename}" 
                                 alt="${event.title}"
                                 onerror="this.parentElement.style.display='none'">
                        </div>
                    ` : ''}
                    
                    <h3 class="timeline-title">${event.title}</h3>
                    
                    ${event.location ? `
                        <div class="timeline-location">
                            <span class="location-icon">📍</span>
                            ${event.location}
                        </div>
                    ` : ''}
                    
                    <p class="timeline-description">${event.description}</p>
                    
                    ${event.significance ? `
                        <div class="timeline-significance">
                            <strong>Significance:</strong> ${event.significance}
                        </div>
                    ` : ''}
                    
                    ${hasDetails ? `
                        <button class="timeline-expand-btn" data-event-id="${eventId}">
                            <span class="expand-icon">▼</span> Show Details
                        </button>
                        <div id="${eventId}" class="timeline-details" style="display: none;">
                            <h4>Additional Details:</h4>
                            <ul>
                                ${event.details.map(detail => `<li>${detail}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Attach click listeners to all expand buttons
        const expandButtons = document.querySelectorAll('.timeline-expand-btn');
        expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = e.currentTarget.getAttribute('data-event-id');
                this.toggleDetails(eventId, e.currentTarget);
            });
        });

        // Attach click listeners to timeline content for modal
        const timelineContents = document.querySelectorAll('.timeline-content');
        timelineContents.forEach((content, index) => {
            content.addEventListener('click', () => {
                this.openTimelineModal(this.filteredData[index]);
            });
        });
    }

    toggleDetails(eventId, button) {
        const detailsElement = document.getElementById(eventId);
        if (!detailsElement || !button) return;
        
        if (detailsElement.style.display === 'none' || detailsElement.style.display === '') {
            detailsElement.style.display = 'block';
            button.innerHTML = '<span class="expand-icon">▲</span> Hide Details';
        } else {
            detailsElement.style.display = 'none';
            button.innerHTML = '<span class="expand-icon">▼</span> Show Details';
        }
    }

    openTimelineModal(event) {
        const hasImage = event.image_filename;
        
        let modalHTML = `
            <div class="gallery-modal active">
                <div class="gallery-modal-backdrop" onclick="closeTimelineModal()"></div>
                <div class="gallery-modal-content">
                    <div class="gallery-modal-header">
                        <h3>${event.title}</h3>
                        <div class="gallery-modal-actions">
                            <button class="modal-btn close-btn" onclick="closeTimelineModal()">
                                ✕ Close
                            </button>
                        </div>
                    </div>
                    <div class="gallery-modal-body">
                        ${hasImage ? `
                            <div class="gallery-modal-image">
                                <img src="../../assets/images/${event.image_filename}" alt="${event.title}">
                            </div>
                        ` : ''}
                        <div class="gallery-modal-info">
                            <p><strong>Date:</strong> ${event.date}</p>
                            ${event.location ? `<p><strong>Location:</strong> 📍 ${event.location}</p>` : ''}
                            <p><strong>Category:</strong> ${event.category}</p>
                            <p>${event.description}</p>
                            ${event.significance ? `<p><strong>Significance:</strong> ${event.significance}</p>` : ''}
                            ${event.details && event.details.length > 0 ? `
                                <p><strong>Additional Details:</strong></p>
                                <ul style="margin-left: 20px; margin-top: 10px;">
                                    ${event.details.map(detail => `<li>${detail}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
    }

    async initialize() {
        const loaded = await this.loadTimelineData();
        if (loaded) {
            this.renderTimeline();
            this.attachEventListeners();
            this.initializeSearch();
            this.initializeScrollToTop();
        } else {
            const container = document.getElementById('timeline-container');
            if (container) {
                container.innerHTML = `
                    <div class="timeline-error">
                        <h3>⚠️ Error Loading Timeline</h3>
                        <p>Unable to load timeline data. Please refresh the page and try again.</p>
                    </div>
                `;
            }
        }
    }

    initializeSearch() {
        const searchInput = document.getElementById('timeline-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchEvents(e.target.value);
            });
        }
    }

    initializeScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        const mainContent = document.querySelector('.main-content');
        
        if (!scrollBtn || !mainContent) return;

        mainContent.addEventListener('scroll', () => {
            if (mainContent.scrollTop > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function closeTimelineModal() {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

window.closeTimelineModal = closeTimelineModal;

let timeline;

document.addEventListener('DOMContentLoaded', () => {
    timeline = new RizalTimeline();
    timeline.initialize();
});
