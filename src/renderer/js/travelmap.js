// Interactive Travel Map for Rizal Digital Museum

class RizalTravelMap {
    constructor() {
        this.travelsData = [];
        this.currentLocationIndex = 0;
        this.mapLocations = [
            { id: 'philippines', name: 'Philippines', x: 82, y: 45, year: '1861-1882', description: 'Birthplace and early life in Calamba, Laguna. Education at Ateneo and UST.' },
            { id: 'singapore', name: 'Singapore', x: 72, y: 52, year: '1882', description: 'First stop on his journey to Europe aboard SS Salvadora.' },
            { id: 'ceylon', name: 'Ceylon (Sri Lanka)', x: 58, y: 50, year: '1882', description: 'Brief stop during voyage to Europe.' },
            { id: 'aden', name: 'Aden (Yemen)', x: 48, y: 47, year: '1882', description: 'Port stop on the way to the Suez Canal.' },
            { id: 'suez', name: 'Suez Canal', x: 42, y: 38, year: '1882', description: 'Passed through the famous canal connecting East and West.' },
            { id: 'italy', name: 'Naples, Italy', x: 32, y: 32, year: '1882', description: 'First European city visited.' },
            { id: 'spain', name: 'Spain', x: 24, y: 32, year: '1882-1885', description: 'Studied medicine at Universidad Central de Madrid.' },
            { id: 'france', name: 'Paris, France', x: 28, y: 28, year: '1885-1886', description: 'Studied ophthalmology and witnessed the 1889 World\'s Fair.' },
            { id: 'germany', name: 'Germany', x: 32, y: 26, year: '1886-1887', description: 'Heidelberg and Berlin - completed Noli Me Tangere.' },
            { id: 'austria', name: 'Austria', x: 34, y: 28, year: '1887', description: 'Met Ferdinand Blumentritt, his closest European friend.' },
            { id: 'switzerland', name: 'Switzerland', x: 30, y: 28, year: '1887', description: 'Brief visit during European travels.' },
            { id: 'belgium', name: 'Ghent, Belgium', x: 28, y: 26, year: '1891', description: 'Completed and published El Filibusterismo.' },
            { id: 'england', name: 'London, England', x: 25, y: 24, year: '1888-1889', description: 'Research at British Museum, annotated Morga\'s Sucesos.' },
            { id: 'usa', name: 'United States', x: 8, y: 32, year: '1888', description: 'Crossed from San Francisco to New York by train.' },
            { id: 'japan', name: 'Japan', x: 88, y: 34, year: '1888', description: 'Visited Tokyo and Yokohama, met O-Sei-San.' },
            { id: 'hongkong', name: 'Hong Kong', x: 78, y: 40, year: '1888, 1891-1892', description: 'Practiced medicine and reunited with family.' },
            { id: 'dapitan', name: 'Dapitan', x: 84, y: 48, year: '1892-1896', description: 'Four years of exile - built school, water system, practiced medicine.' }
        ];
    }

    async loadTravelsData() {
        try {
            const response = await fetch('../../data/travelsofrizal.json');
            const data = await response.json();
            this.travelsData = data.travels;
            return true;
        } catch (error) {
            console.error('Error loading travels data:', error);
            return false;
        }
    }

    renderMap() {
        const container = document.getElementById('map-container');
        if (!container) return;

        container.innerHTML = `
            <div class="travel-map-wrapper">
                <div class="map-header">
                    <h3>🌍 Rizal's Journey Around the World</h3>
                    <p>Click on the markers to explore each destination</p>
                </div>
                
                <div class="world-map-container">
                    <div class="world-map">
                        <svg viewBox="0 0 100 60" class="map-svg">
                            <!-- Simplified World Map Background -->
                            <defs>
                                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:#1a3a5c;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#0d2137;stop-opacity:1" />
                                </linearGradient>
                                <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:#3d5a3d;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#2d4a2d;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            
                            <!-- Ocean Background -->
                            <rect x="0" y="0" width="100" height="60" fill="url(#oceanGradient)"/>
                            
                            <!-- Simplified Continents -->
                            <!-- North America -->
                            <path d="M5,15 Q8,12 15,14 L18,18 Q20,22 18,28 L15,32 Q12,35 8,34 L5,30 Q3,25 5,20 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- South America -->
                            <path d="M15,38 Q18,36 20,40 L22,48 Q20,54 17,55 L14,52 Q12,46 15,38 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- Europe -->
                            <path d="M25,18 Q30,16 35,18 L38,22 Q36,26 32,28 L28,26 Q24,24 25,18 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- Africa -->
                            <path d="M30,32 Q35,30 40,32 L42,40 Q40,50 35,52 L30,48 Q28,40 30,32 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- Asia -->
                            <path d="M40,15 Q50,12 65,14 L75,18 Q80,22 82,30 L85,38 Q82,42 78,44 L70,42 Q60,38 55,35 L48,32 Q42,28 40,22 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- Southeast Asia / Philippines -->
                            <path d="M78,42 Q82,40 85,44 L86,50 Q84,54 80,52 L78,48 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- Japan -->
                            <path d="M86,30 Q88,28 90,32 L89,38 Q87,40 86,36 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- Australia -->
                            <path d="M75,52 Q82,50 88,54 L90,58 Q85,60 78,58 L75,55 Z" fill="url(#landGradient)" opacity="0.9"/>
                            
                            <!-- Travel Route Lines -->
                            <g class="travel-routes" stroke="#D4AF37" stroke-width="0.3" fill="none" stroke-dasharray="1,0.5" opacity="0.6">
                                <!-- Philippines to Singapore -->
                                <path d="M82,45 Q78,48 72,52"/>
                                <!-- Singapore to Ceylon -->
                                <path d="M72,52 Q65,51 58,50"/>
                                <!-- Ceylon to Aden -->
                                <path d="M58,50 Q53,48 48,47"/>
                                <!-- Aden to Suez -->
                                <path d="M48,47 Q45,42 42,38"/>
                                <!-- Suez to Naples -->
                                <path d="M42,38 Q37,35 32,32"/>
                                <!-- Naples to Spain -->
                                <path d="M32,32 Q28,32 24,32"/>
                                <!-- Spain to France -->
                                <path d="M24,32 Q26,30 28,28"/>
                                <!-- France to Germany -->
                                <path d="M28,28 Q30,27 32,26"/>
                                <!-- Germany to Belgium -->
                                <path d="M32,26 Q30,26 28,26"/>
                                <!-- Belgium to England -->
                                <path d="M28,26 Q26,25 25,24"/>
                                <!-- England to USA -->
                                <path d="M25,24 Q15,28 8,32"/>
                                <!-- USA to Japan -->
                                <path d="M8,32 Q40,20 88,34"/>
                                <!-- Japan to Hong Kong -->
                                <path d="M88,34 Q83,37 78,40"/>
                                <!-- Hong Kong to Philippines -->
                                <path d="M78,40 Q80,42 82,45"/>
                                <!-- Philippines to Dapitan -->
                                <path d="M82,45 Q83,46 84,48"/>
                            </g>
                        </svg>
                        
                        <!-- Location Markers -->
                        <div class="map-markers">
                            ${this.mapLocations.map((loc, index) => `
                                <div class="map-marker ${index === 0 ? 'active' : ''}" 
                                     data-index="${index}"
                                     data-location="${loc.id}"
                                     style="left: ${loc.x}%; top: ${loc.y}%;"
                                     title="${loc.name}">
                                    <div class="marker-dot"></div>
                                    <div class="marker-pulse"></div>
                                    <span class="marker-label">${loc.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Location Info Panel -->
                <div class="location-info-panel">
                    <div class="location-nav">
                        <button class="location-nav-btn prev-btn" onclick="travelMap.previousLocation()">← Previous</button>
                        <span class="location-counter">${this.currentLocationIndex + 1} / ${this.mapLocations.length}</span>
                        <button class="location-nav-btn next-btn" onclick="travelMap.nextLocation()">Next →</button>
                    </div>
                    
                    <div id="location-details" class="location-details">
                        ${this.renderLocationDetails(this.mapLocations[0])}
                    </div>
                </div>
                
                <!-- Journey Timeline -->
                <div class="journey-timeline">
                    <h4>Journey Timeline</h4>
                    <div class="timeline-scroll">
                        ${this.mapLocations.map((loc, index) => `
                            <div class="journey-stop ${index === 0 ? 'active' : ''}" 
                                 data-index="${index}"
                                 onclick="travelMap.goToLocation(${index})">
                                <div class="stop-year">${loc.year}</div>
                                <div class="stop-name">${loc.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderLocationDetails(location) {
        return `
            <div class="location-header">
                <h3>${location.name}</h3>
                <span class="location-year">${location.year}</span>
            </div>
            <p class="location-description">${location.description}</p>
        `;
    }

    attachEventListeners() {
        const markers = document.querySelectorAll('.map-marker');
        markers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.goToLocation(index);
            });
        });
    }

    goToLocation(index) {
        if (index < 0 || index >= this.mapLocations.length) return;
        
        this.currentLocationIndex = index;
        const location = this.mapLocations[index];
        
        // Update marker states
        document.querySelectorAll('.map-marker').forEach((marker, i) => {
            marker.classList.toggle('active', i === index);
        });
        
        // Update journey timeline
        document.querySelectorAll('.journey-stop').forEach((stop, i) => {
            stop.classList.toggle('active', i === index);
        });
        
        // Update location details
        const detailsContainer = document.getElementById('location-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = this.renderLocationDetails(location);
        }
        
        // Update counter
        const counter = document.querySelector('.location-counter');
        if (counter) {
            counter.textContent = `${index + 1} / ${this.mapLocations.length}`;
        }
        
        // Scroll timeline to active stop
        const activeStop = document.querySelector('.journey-stop.active');
        if (activeStop) {
            activeStop.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    nextLocation() {
        const nextIndex = (this.currentLocationIndex + 1) % this.mapLocations.length;
        this.goToLocation(nextIndex);
    }

    previousLocation() {
        const prevIndex = (this.currentLocationIndex - 1 + this.mapLocations.length) % this.mapLocations.length;
        this.goToLocation(prevIndex);
    }

    async initialize() {
        await this.loadTravelsData();
        this.renderMap();
    }
}

let travelMap;

function initTravelMap() {
    travelMap = new RizalTravelMap();
    travelMap.initialize();
}
