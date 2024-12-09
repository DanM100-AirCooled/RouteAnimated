let map;
let marker;

function initMap() {
  // Define map with center and zoom level
  map = L.map('map').setView([29.75, -96.15], 10); // Centered around Sealy, TX

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Define the waypoints: Sealy, Cat Spring, New Ulm, Industry, Bellville, and back to Sealy
  const waypoints = [
    L.latLng(29.7805, -96.157),  // Sealy, TX
    L.latLng(29.8525, -96.3169), // Cat Spring, TX
    L.latLng(29.8941, -96.5072), // New Ulm, TX
    L.latLng(29.97, -96.5047),   // Industry, TX
    L.latLng(29.9507, -96.2578), // Bellville, TX
    L.latLng(29.7805, -96.157)   // Return to Sealy, TX
  ];

  // Use Leaflet Routing Machine to create a road-following route
  const control = L.Routing.control({
    waypoints: waypoints,
    routeWhileDragging: false,
    createMarker: function() { return null; }, // Remove default markers if you only want your own marker
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      unit: 'imperial' // Set to use miles instead of kilometers
    }),
    show: false // Remove on-screen turn by turn directions
  }).addTo(map);

  // Create a marker at the starting point
  marker = L.marker(waypoints[0]).addTo(map).bindPopup('Starting Point').openPopup();

  // Wait for the route to be calculated, then animate the marker along the route
  control.on('routesfound', function(e) {
    const route = e.routes[0];
    const routeCoordinates = route.coordinates;
    animateMarkerAlongRoute(routeCoordinates);
  });

  // Add a timeline for the route
  addRouteTimeline();
}

function animateMarkerAlongRoute(waypoints) {
  let index = 0;
  const updateInterval = 50; // Speed up the animation

  function moveMarker() {
    if (index < waypoints.length) {
      const newLatLng = waypoints[index];
      marker.setLatLng(newLatLng);
      index++;
      setTimeout(moveMarker, updateInterval);
    } else {
      marker.bindPopup("Arrived back at Sealy, TX").openPopup();
    }
  }

  moveMarker();
}

function addRouteTimeline() {
  const timeline = document.createElement('div');
  timeline.id = 'timeline';
  timeline.style.position = 'absolute';
  timeline.style.bottom = '20px';
  timeline.style.left = '20px';
  timeline.style.padding = '10px';
  timeline.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  timeline.style.borderRadius = '5px';

  const departureTime = new Date();
  departureTime.setHours(8, 0, 0); // Set departure time to 8:00 AM

  const estimatedTravelTimeMinutes = 120; // Example travel time of 120 minutes
  const arrivalTime = new Date(departureTime.getTime() + estimatedTravelTimeMinutes * 60000);

  timeline.innerHTML = `<strong>Route Timeline:</strong><br>
    Departure: 8:00 AM<br>
    Estimated Arrival: ${arrivalTime.getHours() % 12 || 12}:${arrivalTime.getMinutes().toString().padStart(2, '0')} ${arrivalTime.getHours() >= 12 ? 'PM' : 'AM'}<br>
    Travel Time: ${estimatedTravelTimeMinutes} minutes`;
  document.body.appendChild(timeline);
}

// Load Leaflet map on window load
window.onload = initMap;
