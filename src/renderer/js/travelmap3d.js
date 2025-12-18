// 3D Interactive Travel Map for Rizal Digital Museum
// Uses Globe.gl for 3D globe visualization

class RizalTravelMap3D {
    constructor() {
        this.globe = null;
        this.currentLocationIndex = 0;
        this.isZoomedIn = false;
        this.zoomThreshold = 1.5; // Altitude threshold for showing images
        
        // Accurate coordinates for Rizal's travels (lat, lng) - ALL with images
        this.mapLocations = [
            { 
                id: 'philippines', 
                name: 'Philippines (Calamba)', 
                lat: 14.2117, 
                lng: 121.1653, 
                year: '1861-1882', 
                description: 'Birthplace and early life in Calamba, Laguna. Education at Ateneo and UST.',
                image: 'calamba.jpg',
                color: '#FFD700'
            },
            { 
                id: 'singapore', 
                name: 'Singapore', 
                lat: 1.3521, 
                lng: 103.8198, 
                year: '1882', 
                description: 'First stop on his journey to Europe aboard SS Salvadora.',
                image: 'singapore.jpg',
                color: '#FF6B6B'
            },
            { 
                id: 'ceylon', 
                name: 'Ceylon (Sri Lanka)', 
                lat: 7.8731, 
                lng: 80.7718, 
                year: '1882', 
                description: 'Brief stop during voyage to Europe. Observed the beauty of Colombo.',
                image: 'ceylon.jpg',
                color: '#4ECDC4'
            },
            { 
                id: 'aden', 
                name: 'Aden (Yemen)', 
                lat: 12.7855, 
                lng: 45.0187, 
                year: '1882', 
                description: 'Port stop on the way to the Suez Canal.',
                image: 'aden.jpg',
                color: '#45B7D1'
            },
            { 
                id: 'suez', 
                name: 'Suez Canal, Egypt', 
                lat: 30.0444, 
                lng: 32.4396, 
                year: '1882', 
                description: 'Passed through the famous canal connecting East and West.',
                image: 'suez.jpg',
                color: '#96CEB4'
            },
            { 
                id: 'italy', 
                name: 'Naples, Italy', 
                lat: 40.8518, 
                lng: 14.2681, 
                year: '1882', 
                description: 'First European city visited. Climbed Mount Vesuvius.',
                image: 'naples.jpg',
                color: '#FFEAA7'
            },
            { 
                id: 'spain', 
                name: 'Madrid, Spain', 
                lat: 40.4168, 
                lng: -3.7038, 
                year: '1882-1885', 
                description: 'Studied medicine at Universidad Central de Madrid. Wrote "Noli Me Tangere".',
                image: 'madrid.jpg',
                color: '#DDA0DD'
            },
            { 
                id: 'france', 
                name: 'Paris, France', 
                lat: 48.8566, 
                lng: 2.3522, 
                year: '1885-1886', 
                description: 'Studied ophthalmology under Dr. Louis de Wecker. Witnessed the 1889 World\'s Fair.',
                image: 'paris.jpg',
                color: '#98D8C8'
            },
            { 
                id: 'germany', 
                name: 'Heidelberg, Germany', 
                lat: 49.3988, 
                lng: 8.6724, 
                year: '1886-1887', 
                description: 'Studied at University of Heidelberg. Completed Noli Me Tangere in Berlin.',
                image: 'heidelberg.jpg',
                color: '#F7DC6F'
            },
            { 
                id: 'austria', 
                name: 'Vienna, Austria', 
                lat: 48.2082, 
                lng: 16.3738, 
                year: '1887', 
                description: 'Met Ferdinand Blumentritt in Leitmeritz, his closest European friend.',
                image: 'vienna.jpg',
                color: '#BB8FCE'
            },
            { 
                id: 'switzerland', 
                name: 'Geneva, Switzerland', 
                lat: 46.2044, 
                lng: 6.1432, 
                year: '1887', 
                description: 'Brief visit during European travels.',
                image: 'geneva.jpg',
                color: '#85C1E9'
            },
            { 
                id: 'belgium', 
                name: 'Ghent, Belgium', 
                lat: 51.0543, 
                lng: 3.7174, 
                year: '1891', 
                description: 'Completed and published El Filibusterismo.',
                image: 'ghent.jpg',
                color: '#F8B500'
            },
            { 
                id: 'england', 
                name: 'London, England', 
                lat: 51.5074, 
                lng: -0.1278, 
                year: '1888-1889', 
                description: 'Research at British Museum. Annotated Morga\'s Sucesos de las Islas Filipinas.',
                image: 'london.jpg',
                color: '#E74C3C'
            },
            { 
                id: 'usa', 
                name: 'San Francisco, USA', 
                lat: 37.7749, 
                lng: -122.4194, 
                year: '1888', 
                description: 'Crossed from San Francisco to New York by train. Observed American democracy.',
                image: 'sanfrancisco.jpg',
                color: '#3498DB'
            },
            { 
                id: 'japan', 
                name: 'Tokyo, Japan', 
                lat: 35.6762, 
                lng: 139.6503, 
                year: '1888', 
                description: 'Visited Tokyo and Yokohama. Met O-Sei-San (Seiko Usui).',
                image: 'tokyo.jpg',
                color: '#E91E63'
            },
            { 
                id: 'hongkong', 
                name: 'Hong Kong', 
                lat: 22.3193, 
                lng: 114.1694, 
                year: '1888, 1891-1892', 
                description: 'Practiced ophthalmology. Reunited with family. Planned La Liga Filipina.',
                image: 'hongkong.jpg',
                color: '#9C27B0'
            },
            { 
                id: 'dapitan', 
                name: 'Dapitan, Philippines', 
                lat: 8.6568, 
                lng: 123.4246, 
                year: '1892-1896', 
                description: 'Four years of exile. Built school, water system, practiced medicine. Met Josephine Bracken.',
                image: 'dapitan.jpg',
                color: '#FF9800'
            }
        ];

        // Travel arcs connecting locations in chronological order
        this.travelArcs = this.generateTravelArcs();
    }

    generateTravelArcs() {
        const arcs = [];
        for (let i = 0; i < this.mapLocations.length - 1; i++) {
            const start = this.mapLocations[i];
            const end = this.mapLocations[i + 1];
            arcs.push({
                startLat: start.lat,
                startLng: start.lng,
                endLat: end.lat,
                endLng: end.lng,
                color: start.color
            });
        }
        return arcs;
    }

    async initialize() {
        const container = document.getElementById('globe-container');
        if (!container) return;

        // Get responsive height from CSS (60vh with min/max)
        const containerHeight = container.offsetHeight || 450;

        // Initialize Globe.gl with responsive dimensions
        this.globe = Globe()
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            .showAtmosphere(true)
            .atmosphereColor('#3a7bd5')
            .atmosphereAltitude(0.25)
            .width(container.offsetWidth)
            .height(containerHeight)
            (container);

        // Add location points
        this.globe
            .pointsData(this.mapLocations)
            .pointLat(d => d.lat)
            .pointLng(d => d.lng)
            .pointColor(d => d.color)
            .pointAltitude(0.02)
            .pointRadius(0.5)
            .pointLabel(d => `
                <div class="globe-tooltip">
                    <strong>${d.name}</strong><br/>
                    <span class="tooltip-year">${d.year}</span>
                </div>
            `)
            .onPointClick(d => this.handleLocationClick(d))
            .onPointHover(d => {
                container.style.cursor = d ? 'pointer' : 'grab';
            });

        // Add travel arcs
        this.globe
            .arcsData(this.travelArcs)
            .arcStartLat(d => d.startLat)
            .arcStartLng(d => d.startLng)
            .arcEndLat(d => d.endLat)
            .arcEndLng(d => d.endLng)
            .arcColor(d => d.color)
            .arcAltitude(0.15)
            .arcStroke(0.5)
            .arcDashLength(0.5)
            .arcDashGap(0.2)
            .arcDashAnimateTime(2000);

        // Add location labels
        this.globe
            .labelsData(this.mapLocations)
            .labelLat(d => d.lat)
            .labelLng(d => d.lng)
            .labelText(d => d.name)
            .labelSize(0.8)
            .labelDotRadius(0.4)
            .labelColor(() => '#ffffff')
            .labelResolution(2)
            .labelAltitude(0.025);

        // Set initial view to Philippines
        this.globe.pointOfView({ lat: 14.2117, lng: 121.1653, altitude: 2.5 }, 1000);

        // Monitor zoom level for image display
        this.setupZoomMonitor();

        // Handle window resize - update both width and height
        window.addEventListener('resize', () => {
            if (this.globe && container) {
                this.globe.width(container.offsetWidth);
                this.globe.height(container.offsetHeight);
            }
        });

        // Render location info panel
        this.renderLocationInfo(this.mapLocations[0]);
        this.renderJourneyTimeline();
    }

    setupZoomMonitor() {
        // Check zoom level periodically
        setInterval(() => {
            if (!this.globe) return;
            
            const pov = this.globe.pointOfView();
            const altitude = pov.altitude;
            
            // Check if zoomed in close enough
            if (altitude < this.zoomThreshold) {
                // Find nearest location
                const nearestLocation = this.findNearestLocation(pov.lat, pov.lng);
                if (nearestLocation && nearestLocation.image) {
                    this.showLocationImage(nearestLocation);
                }
            } else {
                this.hideLocationImage();
            }
        }, 500);
    }

    findNearestLocation(lat, lng) {
        let nearest = null;
        let minDistance = Infinity;

        this.mapLocations.forEach(loc => {
            const distance = this.calculateDistance(lat, lng, loc.lat, loc.lng);
            if (distance < minDistance && distance < 15) { // Within 15 degrees
                minDistance = distance;
                nearest = loc;
            }
        });

        return nearest;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
    }

    showLocationImage(location) {
        let imageOverlay = document.getElementById('location-image-overlay');
        
        if (!imageOverlay) {
            imageOverlay = document.createElement('div');
            imageOverlay.id = 'location-image-overlay';
            imageOverlay.className = 'location-image-overlay';
            document.getElementById('globe-container').appendChild(imageOverlay);
        }

        if (!this.isZoomedIn || this.currentZoomedLocation !== location.id) {
            this.isZoomedIn = true;
            this.currentZoomedLocation = location.id;
            
            imageOverlay.innerHTML = `
                <div class="image-overlay-content">
                    <div class="overlay-header">
                        <h4>${location.name}</h4>
                        <span class="overlay-year">${location.year}</span>
                    </div>
                    <div class="overlay-image">
                        <img src="../../assets/images/${location.image}" 
                             alt="${location.name}"
                             onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>📍</span><p>Historical Image</p></div>'">
                    </div>
                    <p class="overlay-description">${location.description}</p>
                </div>
            `;
            imageOverlay.classList.add('visible');
        }
    }

    hideLocationImage() {
        const imageOverlay = document.getElementById('location-image-overlay');
        if (imageOverlay && this.isZoomedIn) {
            imageOverlay.classList.remove('visible');
            this.isZoomedIn = false;
            this.currentZoomedLocation = null;
        }
    }

    handleLocationClick(location) {
        const index = this.mapLocations.findIndex(loc => loc.id === location.id);
        if (index !== -1) {
            this.goToLocation(index);
        }
    }

    goToLocation(index) {
        if (index < 0 || index >= this.mapLocations.length) return;
        
        this.currentLocationIndex = index;
        const location = this.mapLocations[index];
        
        // Animate globe to location with zoom
        this.globe.pointOfView({
            lat: location.lat,
            lng: location.lng,
            altitude: 0.8  // Closer zoom to see the location better
        }, 1500);

        // Update marker highlights
        this.updateMarkerHighlight(location);

        // Update UI
        this.renderLocationInfo(location);
        this.updateTimelineActive(index);
        this.updateCounter();
        
        // Show location image overlay after zoom animation
        setTimeout(() => {
            if (location.image) {
                this.showLocationImage(location);
            }
        }, 1600);
    }

    updateMarkerHighlight(activeLocation) {
        // Update points to highlight current location
        this.globe
            .pointColor(d => d.id === activeLocation.id ? '#FFFFFF' : d.color)
            .pointRadius(d => d.id === activeLocation.id ? 0.8 : 0.5)
            .pointAltitude(d => d.id === activeLocation.id ? 0.05 : 0.02);
    }

    renderLocationInfo(location) {
        const infoPanel = document.getElementById('location-info');
        if (!infoPanel) return;

        const currentIndex = this.currentLocationIndex;
        const totalLocations = this.mapLocations.length;
        const progressPercent = ((currentIndex + 1) / totalLocations) * 100;

        infoPanel.innerHTML = `
            <div class="location-indicator">
                <div class="indicator-badge" style="background: ${location.color}">
                    <span class="indicator-number">${currentIndex + 1}</span>
                    <span class="indicator-total">/ ${totalLocations}</span>
                </div>
                <div class="journey-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%; background: ${location.color}"></div>
                    </div>
                    <span class="progress-label">Journey Progress</span>
                </div>
            </div>
            <div class="location-info-header">
                <div class="location-color-dot" style="background: ${location.color}"></div>
                <h3>${location.name}</h3>
            </div>
            <div class="location-year-badge">${location.year}</div>
            <p class="location-description">${location.description}</p>
        `;
    }

    renderJourneyTimeline() {
        const timeline = document.getElementById('journey-timeline-3d');
        if (!timeline) return;

        timeline.innerHTML = this.mapLocations.map((loc, index) => `
            <div class="journey-stop-3d ${index === 0 ? 'active' : ''}" 
                 data-index="${index}"
                 onclick="travelMap3D.goToLocation(${index})"
                 style="border-left-color: ${loc.color}">
                <div class="stop-year-3d">${loc.year}</div>
                <div class="stop-name-3d">${loc.name.split(',')[0]}</div>
            </div>
        `).join('');
    }

    updateTimelineActive(index) {
        document.querySelectorAll('.journey-stop-3d').forEach((stop, i) => {
            stop.classList.toggle('active', i === index);
        });

        // Scroll timeline horizontally without affecting page scroll
        const activeStop = document.querySelector('.journey-stop-3d.active');
        const timelineContainer = document.getElementById('journey-timeline-3d');
        if (activeStop && timelineContainer) {
            // Calculate scroll position to center the active stop
            const containerWidth = timelineContainer.offsetWidth;
            const stopLeft = activeStop.offsetLeft;
            const stopWidth = activeStop.offsetWidth;
            const scrollPosition = stopLeft - (containerWidth / 2) + (stopWidth / 2);
            
            // Scroll only the timeline container, not the page
            timelineContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }

    updateCounter() {
        const counter = document.querySelector('.location-counter-3d');
        if (counter) {
            counter.textContent = `${this.currentLocationIndex + 1} / ${this.mapLocations.length}`;
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

    autoRotate(enable) {
        if (this.globe) {
            this.globe.controls().autoRotate = enable;
            this.globe.controls().autoRotateSpeed = 0.5;
        }
    }
}

let travelMap3D;

function initTravelMap3D() {
    // Check if already initialized
    if (travelMap3D && travelMap3D.globe) {
        return;
    }
    travelMap3D = new RizalTravelMap3D();
    travelMap3D.initialize();
}
