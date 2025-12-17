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
                const eventId = e.currentTarget.getAttribute('data-event-id');
                this.toggleDetails(eventId, e.currentTarget);
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

    async initialize() {
        const loaded = await this.loadTimelineData();
        if (loaded) {
            this.renderTimeline();
            this.attachEventListeners();
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
}

let timeline;

document.addEventListener('DOMContentLoaded', () => {
    timeline = new RizalTimeline();
    timeline.initialize();
});
