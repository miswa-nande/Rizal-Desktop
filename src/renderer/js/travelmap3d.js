// 3D Interactive Travel Map for Rizal Digital Museum
// Uses Globe.gl for 3D globe visualization

class RizalTravelMap3D {
    constructor() {
        this.globe = null;
        this.currentLocationIndex = 0;
        this.isZoomedIn = false;
        this.zoomThreshold = 1.5; // Altitude threshold for showing images
        
        // Accurate coordinates for Rizal's travels (lat, lng) - ALL with images
        // Each location has: summary (for image cards) and details (for info panel)
        this.mapLocations = [
            { 
                id: 'philippines', 
                name: 'Philippines (Calamba)', 
                lat: 14.2117, 
                lng: 121.1653, 
                year: '1861-1882', 
                summary: 'Born June 19, 1861. Studied at Ateneo Municipal de Manila and UST. His early years shaped his love for homeland and awareness of colonial injustices.',
                details: 'José Protasio Rizal Mercado y Alonso Realonda was born on June 19, 1861, in Calamba, Laguna. He was the seventh of eleven children of Francisco Mercado and Teodora Alonso, a prosperous family who leased land from the Dominican friars. <br><br><strong>Key Facts:</strong><ul><li>At age 3, he learned the alphabet from his mother Teodora</li><li>At age 8, he wrote his first poem "Sa Aking Mga Kabata" (To My Fellow Children)</li><li>At age 11, enrolled at Ateneo Municipal de Manila, graduating with highest honors (Sobresaliente)</li><li>Earned a Bachelor of Arts degree at age 16</li><li>Studied medicine at UST (1877-1882) but faced discrimination as an "Indio"</li><li>Could speak 22 languages including Tagalog, Spanish, Latin, Greek, German, French, and Japanese</li></ul><strong>Historical Significance:</strong> His early experiences with injustice—including witnessing his mother\'s wrongful imprisonment and the execution of the GOMBURZA priests—planted the seeds of his nationalist awakening.',
                image: 'calamba.jpg',
                color: '#FFD700'
            },
            { 
                id: 'singapore', 
                name: 'Singapore', 
                lat: 1.3521, 
                lng: 103.8198, 
                year: '1882', 
                summary: 'First foreign port on May 3, 1882 aboard SS Salvadora. Observed the contrast between Singapore\'s progressive British administration and conditions in the Philippines.',
                details: 'On May 3, 1882, the 21-year-old Rizal secretly left the Philippines aboard the SS Salvadora, beginning his journey to Spain without his parents\' knowledge. His brother Paciano funded the trip. Singapore was his first foreign port of call.<br><br><strong>Key Facts:</strong><ul><li>Arrived in Singapore on May 9, 1882</li><li>Stayed at Hotel de la Paz for two days</li><li>Explored the city and was impressed by its cleanliness and order</li><li>Observed the harmonious coexistence of Chinese, Malays, Indians, and Europeans</li><li>Noted the contrast between British colonial efficiency and Spanish misrule in the Philippines</li></ul><strong>Rizal\'s Observations:</strong> In his travel diary, he wrote admiringly of Singapore\'s botanical gardens, well-maintained streets, and the absence of racial discrimination in public spaces. This was his first glimpse of how a well-governed colony could function, planting ideas that would later influence his reform writings.',
                image: 'singapore.jpg',
                color: '#FF6B6B'
            },
            { 
                id: 'ceylon', 
                name: 'Ceylon (Sri Lanka)', 
                lat: 7.8731, 
                lng: 80.7718, 
                year: '1882', 
                summary: 'Stopped at Point Galle and Colombo. Impressed by the island\'s natural beauty, noting similarities between Ceylonese and Filipinos in physical features and temperament.',
                details: 'Rizal\'s ship stopped at Point Galle and Colombo in Ceylon (now Sri Lanka) in May 1882. He was deeply impressed by the natural beauty of the island, describing it in his diary as a paradise.<br><br><strong>Key Facts:</strong><ul><li>Stopped at Point Galle on May 11, 1882</li><li>Visited Colombo, the capital city</li><li>Described Ceylon as "the most beautiful place I have ever seen"</li><li>Noted similarities between Ceylonese and Filipinos in physical features</li><li>Observed Buddhist temples and Hindu shrines</li><li>Impressed by the tropical vegetation similar to the Philippines</li></ul><strong>Rizal\'s Reflections:</strong> The lush landscape reminded him of his homeland, stirring feelings of both admiration and homesickness. He observed how the British administered the colony differently from the Spanish in the Philippines, with more respect for local culture and less religious interference.',
                image: 'ceylon.jpg',
                color: '#4ECDC4'
            },
            { 
                id: 'aden', 
                name: 'Aden (Yemen)', 
                lat: 12.7855, 
                lng: 45.0187, 
                year: '1882', 
                summary: 'British coaling station at the Arabian Peninsula. Observed the diverse mix of Arabs, Somalis, Indians, and Europeans at this strategic imperial port.',
                details: 'Aden, a British coaling station at the southern tip of the Arabian Peninsula, was a stop on Rizal\'s voyage in May 1882. He described it as a barren, rocky place with extreme heat.<br><br><strong>Key Facts:</strong><ul><li>Arrived in Aden on May 17, 1882</li><li>Temperature reached over 40°C (104°F)</li><li>Described the landscape as "rocks upon rocks, entirely devoid of vegetation"</li><li>Observed the diverse mix of Arabs, Somalis, Indians, Jews, and Europeans</li><li>Witnessed the camel market and trading activities</li><li>Noted British military presence guarding the strategic port</li></ul><strong>Strategic Importance:</strong> Rizal reflected on how colonial powers controlled key maritime routes. Aden was vital for ships traveling between Europe and Asia, serving as a coaling station before the age of oil. This observation deepened his understanding of global imperialism and its economic motivations.',
                image: 'aden.jpg',
                color: '#45B7D1'
            },
            { 
                id: 'suez', 
                name: 'Suez Canal, Egypt', 
                lat: 30.0444, 
                lng: 32.4396, 
                year: '1882', 
                summary: 'Passed through the 1869 engineering marvel connecting Mediterranean to Red Sea. Reflected on the labor sacrificed in its construction and the connection between East and West.',
                details: 'Rizal\'s passage through the Suez Canal in May 1882 was a significant moment in his journey. The canal, completed in 1869, was an engineering marvel connecting the Mediterranean Sea to the Red Sea.<br><br><strong>Key Facts:</strong><ul><li>Passed through the canal on May 18-19, 1882</li><li>The canal was 193 km (120 miles) long</li><li>Over 1.5 million workers, mostly Egyptian peasants, built the canal</li><li>An estimated 120,000 workers died during construction</li><li>Rizal observed both European ships and traditional Arab dhows</li><li>Saw the desert landscape of Egypt for the first time</li></ul><strong>Rizal\'s Reflections:</strong> He marveled at this feat of human ingenuity while also reflecting on the labor and lives sacrificed in its construction. The canal symbolized the connection between East and West—a theme that would resonate throughout his life. He noted how European powers controlled this vital waterway, understanding the economic dimensions of colonialism.',
                image: 'suez.jpg',
                color: '#96CEB4'
            },
            { 
                id: 'italy', 
                name: 'Naples, Italy', 
                lat: 40.8518, 
                lng: 14.2681, 
                year: '1882', 
                summary: 'First European destination in June 1882. Visited Pompeii ruins, climbed Mount Vesuvius, and was captivated by Italian art, history, and architecture.',
                details: 'Naples was Rizal\'s first European destination, arriving on June 11, 1882. He was captivated by the city\'s rich history, art, and architecture.<br><br><strong>Key Facts:</strong><ul><li>Arrived in Naples on June 11, 1882 after 39 days at sea</li><li>Visited the ruins of Pompeii, destroyed by Mount Vesuvius in 79 AD</li><li>Climbed Mount Vesuvius and peered into the volcanic crater</li><li>Toured the Naples National Archaeological Museum</li><li>Observed Italian street life, markets, and social customs</li><li>Noted both the beauty and poverty of Naples</li></ul><strong>Cultural Impact:</strong> Rizal was particularly impressed by the museums and historical sites, which deepened his appreciation for European civilization. Seeing how Italy preserved its ancient heritage made him reflect on the Philippines\' own pre-colonial history that the Spanish had suppressed. This experience later influenced his decision to annotate Morga\'s historical work in London.',
                image: 'naples.jpg',
                color: '#FFEAA7'
            },
            { 
                id: 'spain', 
                name: 'Madrid, Spain', 
                lat: 40.4168, 
                lng: -3.7038, 
                year: '1882-1885', 
                summary: 'Primary residence 1882-1885. Earned medical degree (1884) and Philosophy degree at Universidad Central. Joined Propaganda Movement and began writing Noli Me Tangere.',
                details: 'Madrid became Rizal\'s primary residence in Europe from 1882 to 1885. He enrolled at the Universidad Central de Madrid to complete his medical studies.<br><br><strong>Key Facts:</strong><ul><li>Arrived in Madrid on June 15, 1882</li><li>Earned his Licentiate in Medicine on June 21, 1884</li><li>Also earned a degree in Philosophy and Letters (1885)</li><li>Joined the Circulo Hispano-Filipino, a society of Filipino students</li><li>Became active in the Propaganda Movement for Philippine reforms</li><li>Began writing Noli Me Tangere in Madrid (1884)</li><li>Contributed articles to La Solidaridad newspaper</li><li>Lived frugally, often skipping meals to save money for books</li></ul><strong>Political Awakening:</strong> Madrid exposed Rizal to liberal ideas, European politics, and the contrast between Spain\'s democratic aspirations at home and its oppressive colonial policies abroad. He met fellow Filipino reformists like Marcelo H. del Pilar and Graciano López Jaena, forming the core of the Propaganda Movement.',
                image: 'madrid.jpg',
                color: '#DDA0DD'
            },
            { 
                id: 'france', 
                name: 'Paris, France', 
                lat: 48.8566, 
                lng: 2.3522, 
                year: '1885-1886', 
                summary: 'Specialized in ophthalmology under Dr. Louis de Wecker to treat his mother\'s blindness. Absorbed French ideals of liberty, equality, and fraternity. Witnessed 1889 World\'s Fair.',
                details: 'In Paris, Rizal specialized in ophthalmology under the renowned Dr. Louis de Wecker at the Hôpital Lariboisière. He chose this specialty to treat his mother, Teodora Alonso, who was going blind.<br><br><strong>Key Facts:</strong><ul><li>Studied under Dr. Louis de Wecker, a famous eye surgeon</li><li>Worked at the Hôpital Lariboisière (1885-1886)</li><li>Frequented the Bibliothèque Nationale for research</li><li>Visited the Louvre Museum and studied European art</li><li>Witnessed the construction of the Eiffel Tower (completed 1889)</li><li>Attended the 1889 Universal Exposition on a later visit</li><li>Absorbed French ideals of "Liberté, Égalité, Fraternité"</li></ul><strong>Intellectual Growth:</strong> Paris exposed Rizal to French culture, art, and revolutionary history. He frequented libraries, museums, and theaters, absorbing the ideals that had shaped modern France. The French Revolution\'s principles deeply influenced his thinking about reform and independence. Paris refined his worldview and strengthened his resolve to fight for Philippine reforms through peaceful, intellectual means.',
                image: 'paris.jpg',
                color: '#98D8C8'
            },
            { 
                id: 'germany', 
                name: 'Heidelberg, Germany', 
                lat: 49.3988, 
                lng: 8.6724, 
                year: '1886-1887', 
                summary: 'Pivotal for intellectual development. Studied under Professor Otto Becker. Completed and published Noli Me Tangere in Berlin (March 1887), exposing Spanish colonial abuses.',
                details: 'Germany was pivotal in Rizal\'s intellectual development. He studied ophthalmology at the University of Heidelberg under Professor Otto Becker, then moved to Berlin to complete his novel.<br><br><strong>Key Facts:</strong><ul><li>Arrived in Heidelberg in February 1886</li><li>Studied under Professor Otto Becker, a renowned ophthalmologist</li><li>Moved to Berlin in 1886 to focus on writing</li><li>Completed Noli Me Tangere on February 21, 1887</li><li>Published Noli Me Tangere on March 21, 1887 (2,000 copies)</li><li>Maximo Viola, a friend, funded the printing costs</li><li>Learned German fluently and translated Schiller\'s Wilhelm Tell to Tagalog</li><li>Admired German discipline, scientific advancement, and educational system</li></ul><strong>Literary Milestone:</strong> Noli Me Tangere ("Touch Me Not") exposed the abuses of Spanish friars and colonial officials through the story of Crisostomo Ibarra. The novel became a catalyst for Philippine nationalism and was banned by Spanish authorities, making Rizal a marked man.',
                image: 'heidelberg.jpg',
                color: '#F7DC6F'
            },
            { 
                id: 'austria', 
                name: 'Vienna, Austria', 
                lat: 48.2082, 
                lng: 16.3738, 
                year: '1887', 
                summary: 'Historic 1887 meeting with Professor Ferdinand Blumentritt in Leitmeritz. Their friendship lasted until Rizal\'s death. Blumentritt became his most trusted European confidant.',
                details: 'Rizal\'s visit to Austria in 1887 was marked by his historic meeting with Professor Ferdinand Blumentritt in Leitmeritz (now Litoměřice, Czech Republic).<br><br><strong>Key Facts:</strong><ul><li>Met Ferdinand Blumentritt on May 13, 1887</li><li>Blumentritt was an Austrian professor and ethnographer</li><li>They had corresponded since 1886 about Philippine languages</li><li>Rizal stayed with Blumentritt\'s family for several days</li><li>Blumentritt was 34 years old, Rizal was 26</li><li>Their friendship lasted until Rizal\'s execution in 1896</li><li>Blumentritt wrote over 200 letters to Rizal</li><li>He defended Rizal against Spanish colonial propaganda in European newspapers</li></ul><strong>A Lifelong Friendship:</strong> Blumentritt became Rizal\'s most trusted European confidant and supporter of Philippine reforms. When Rizal was executed, Blumentritt mourned deeply and continued to honor his memory. Their correspondence provides invaluable insights into Rizal\'s thoughts, struggles, and the reform movement.',
                image: 'vienna.jpg',
                color: '#BB8FCE'
            },
            { 
                id: 'switzerland', 
                name: 'Geneva, Switzerland', 
                lat: 46.2044, 
                lng: 6.1432, 
                year: '1887', 
                summary: 'Admired Swiss natural beauty and governance model: federal republic with direct democracy, neutrality, and respect for multiple cultures. Influenced his vision for an independent Philippines.',
                details: 'Rizal visited Switzerland during his European travels in 1887, passing through Geneva and other cities. He was impressed by Switzerland\'s natural beauty and unique political system.<br><br><strong>Key Facts:</strong><ul><li>Visited Geneva, Lausanne, and other Swiss cities in 1887</li><li>Admired the Alps, lakes, and pristine landscapes</li><li>Studied the Swiss federal republic system</li><li>Impressed by direct democracy and citizen participation</li><li>Noted Switzerland\'s neutrality and peaceful foreign policy</li><li>Observed respect for multiple languages (German, French, Italian, Romansh)</li><li>Saw how diverse cantons coexisted peacefully</li></ul><strong>Political Inspiration:</strong> Switzerland represented an ideal of peaceful coexistence and self-governance that contrasted sharply with colonial rule. Rizal\'s observations of Swiss society—where different ethnic groups lived harmoniously under a federal system—influenced his vision for a future independent Philippines with respect for regional diversity.',
                image: 'geneva.jpg',
                color: '#85C1E9'
            },
            { 
                id: 'belgium', 
                name: 'Ghent, Belgium', 
                lat: 51.0543, 
                lng: 3.7174, 
                year: '1891', 
                summary: 'Completed and published El Filibusterismo (September 1891) with help from Valentin Ventura. Dedicated to GOMBURZA martyrs. Cemented his reputation as voice of Philippine nationalism.',
                details: 'Ghent holds special significance as the place where Rizal completed and published his second novel, El Filibusterismo, in September 1891.<br><br><strong>Key Facts:</strong><ul><li>Arrived in Ghent in 1891 to reduce printing costs</li><li>Completed El Filibusterismo on March 29, 1891</li><li>Published on September 18, 1891</li><li>Valentin Ventura, a wealthy friend, funded the printing</li><li>Rizal pawned his jewelry to help cover costs</li><li>Dedicated to GOMBURZA—the three martyred priests executed in 1872</li><li>The novel was darker and more revolutionary than Noli Me Tangere</li><li>Featured the character Simoun, a revolutionary seeking violent change</li></ul><strong>Literary Significance:</strong> El Filibusterismo ("The Reign of Greed") depicted the consequences of colonial oppression and hinted at revolution. The dedication to GOMBURZA read: "To the memory of the priests Don Mariano Gomez, Don Jose Burgos, and Don Jacinto Zamora... whose execution awakened in me the desire to dedicate my life to avenge your deaths." This novel cemented Rizal\'s reputation as the foremost voice of Philippine nationalism.',
                image: 'ghent.jpg',
                color: '#F8B500'
            },
            { 
                id: 'england', 
                name: 'London, England', 
                lat: 51.5074, 
                lng: -0.1278, 
                year: '1888-1889', 
                summary: 'Crucial for historical research at British Museum. Discovered and annotated Morga\'s "Sucesos de las Islas Filipinas" (1609), proving Filipinos had rich pre-colonial culture.',
                details: 'London was crucial for Rizal\'s historical research. He spent months at the British Museum, where he discovered and annotated Antonio de Morga\'s "Sucesos de las Islas Filipinas" (1609).<br><br><strong>Key Facts:</strong><ul><li>Arrived in London on May 24, 1888</li><li>Stayed at the Beckett family\'s boarding house</li><li>Spent hours daily at the British Museum Reading Room</li><li>Discovered Morga\'s 1609 book about pre-colonial Philippines</li><li>Hand-copied and annotated the entire 372-page book</li><li>Published his annotated edition in Paris in 1890</li><li>Learned to read and write in several more languages</li><li>Interacted with scholars and reformists from around the world</li></ul><strong>Historical Significance:</strong> Morga\'s work documented pre-colonial Philippine civilization, proving that Filipinos had a rich culture, trade networks, and social systems before Spanish colonization. Rizal\'s annotations corrected Spanish biases and reclaimed Filipino history. This work was a powerful statement of Filipino identity and historical consciousness.',
                image: 'london.jpg',
                color: '#E74C3C'
            },
            { 
                id: 'usa', 
                name: 'San Francisco, USA', 
                lat: 37.7749, 
                lng: -122.4194, 
                year: '1888', 
                summary: 'Arrived April 1888 on SS Belgic. Traveled by train through Oakland, Salt Lake City, Denver, Chicago to New York. Observed American democracy and its contradictions on racial discrimination.',
                details: 'In April 1888, Rizal arrived in San Francisco aboard the SS Belgic from Japan. He spent time in quarantine due to anti-Chinese sentiment affecting Asian travelers.<br><br><strong>Key Facts:</strong><ul><li>Arrived in San Francisco on April 28, 1888</li><li>Detained in quarantine for several days due to anti-Asian policies</li><li>Traveled across America by train over 2 weeks</li><li>Route: Oakland → Reno → Salt Lake City → Denver → Omaha → Chicago → New York</li><li>Observed the vast American landscape and diverse population</li><li>Noted the treatment of Chinese and Black Americans</li><li>Departed from New York to Liverpool on May 16, 1888</li></ul><strong>Observations on Democracy:</strong> Rizal noted both the achievements of American democracy and its contradictions. He observed racial discrimination against Chinese immigrants and African Americans, writing critically about the gap between American ideals of equality and the reality of racism. This experience gave him comparative insights into different models of governance.',
                image: 'sanfrancisco.jpg',
                color: '#3498DB'
            },
            { 
                id: 'japan', 
                name: 'Tokyo, Japan', 
                lat: 35.6762, 
                lng: 139.6503, 
                year: '1888', 
                summary: 'February-April 1888. Impressed by Japanese modernization under Meiji Restoration—proof that Asian nations could progress while preserving identity. Met Seiko Usui (O-Sei-San).',
                details: 'Rizal visited Japan from February to April 1888, spending time in Tokyo and Yokohama. He was deeply impressed by Japanese culture and the rapid modernization under the Meiji Restoration.<br><br><strong>Key Facts:</strong><ul><li>Arrived in Yokohama on February 28, 1888</li><li>Stayed in Japan for 45 days</li><li>Studied Japanese language and culture intensively</li><li>Met Seiko Usui (O-Sei-San), a Japanese woman he fell in love with</li><li>Considered staying in Japan permanently</li><li>Impressed by the Meiji Restoration\'s rapid modernization</li><li>Observed how Japan preserved its culture while adopting Western technology</li><li>Visited temples, gardens, and cultural sites</li></ul><strong>Inspiration for the Philippines:</strong> Japan proved that an Asian nation could modernize while preserving its cultural identity—a powerful example for the Philippines. Rizal saw hope that Asian nations could achieve progress and independence without losing their heritage. His brief romance with O-Sei-San remained a cherished memory.',
                image: 'tokyo.jpg',
                color: '#E91E63'
            },
            { 
                id: 'hongkong', 
                name: 'Hong Kong', 
                lat: 22.3193, 
                lng: 114.1694, 
                year: '1888, 1891-1892', 
                summary: 'Base in Asia on multiple visits. Practiced ophthalmology, treating his mother. Reunited with exiled family (1891-1892). Founded La Liga Filipina promoting unity and reform.',
                details: 'Hong Kong served as Rizal\'s base in Asia on multiple occasions. He practiced ophthalmology there and was reunited with his exiled family.<br><br><strong>Key Facts:</strong><ul><li>First visited Hong Kong in 1888</li><li>Returned in 1891-1892 for an extended stay</li><li>Opened an ophthalmology clinic at 5 D\'Aguilar Street</li><li>Successfully operated on his mother\'s cataracts, restoring her sight</li><li>Reunited with family exiled from Calamba by Dominican friars</li><li>Founded La Liga Filipina on July 3, 1892 in Manila</li><li>La Liga promoted unity, mutual aid, and reform</li><li>British Hong Kong offered safety from Spanish authorities</li></ul><strong>Family Tragedy:</strong> The Rizal family was forcibly evicted from Calamba in 1891 due to their land dispute with the Dominican friars. Rizal brought them to Hong Kong for safety. His successful treatment of his mother\'s blindness was a personal triumph, fulfilling his reason for studying ophthalmology.',
                image: 'hongkong.jpg',
                color: '#9C27B0'
            },
            { 
                id: 'dapitan', 
                name: 'Dapitan, Philippines', 
                lat: 8.6568, 
                lng: 123.4246, 
                year: '1892-1896', 
                summary: 'Exiled 1892-1896 but transformed the town. Built school and water system, practiced free medicine, conducted scientific research. Met Josephine Bracken, his common-law wife.',
                details: 'Rizal was exiled to Dapitan, Zamboanga del Norte, from 1892 to 1896. Despite his banishment, he transformed the town through his tireless work.<br><br><strong>Key Facts:</strong><ul><li>Exiled on July 17, 1892, just days after founding La Liga Filipina</li><li>Spent 4 years in Dapitan under the watch of Jesuit missionaries</li><li>Established a school for boys teaching practical skills and sciences</li><li>Built a water supply system for the town using bamboo pipes</li><li>Practiced medicine for free, treating hundreds of patients</li><li>Discovered new species of animals, including a frog named after him (Rhacophorus rizali)</li><li>Created sculptures, paintings, and a relief map of Mindanao</li><li>Met Josephine Bracken in 1895, who became his common-law wife</li></ul><strong>Legacy in Dapitan:</strong> Rizal\'s Dapitan years demonstrated that exile could not diminish his service to his people. He corresponded with scientists worldwide, including the Dresden Museum. His school, clinic, and community projects transformed the remote town. Today, Dapitan is a shrine to his memory, with his house, clinic, and the relief map preserved as national treasures.',
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

        // Monitor zoom level for image display
        this.setupZoomMonitor();

        // Handle window resize - update both width and height
        window.addEventListener('resize', () => {
            if (this.globe && container) {
                this.globe.width(container.offsetWidth);
                this.globe.height(container.offsetHeight);
            }
        });

        // Render journey timeline first
        this.renderJourneyTimeline();
        
        // Initialize to first location (Calamba) after globe loads
        setTimeout(() => {
            this.goToLocation(0);
        }, 500);
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
                    <p class="overlay-description">${location.summary}</p>
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
            <div class="location-description" style="text-align: left;">${location.details}</div>
        `;

        // Apply left alignment to all list items after rendering
        setTimeout(() => {
            const descEl = document.querySelector('#location-info .location-description');
            if (descEl) {
                const lists = descEl.querySelectorAll('ul');
                lists.forEach(ul => {
                    ul.style.textAlign = 'left';
                });
                const items = descEl.querySelectorAll('li');
                items.forEach(li => {
                    li.style.textAlign = 'left';
                });
            }
        }, 10);
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
