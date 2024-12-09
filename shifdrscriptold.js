let map;
let marker;
let line;

function initMap() {
  // Define map with center and zoom level
  map = L.map('map').setView([37.7749, -122.4194], 13); // Centered at San Francisco

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Define the route with start and end coordinates
  const route = [
    [37.7749, -122.4194], // Start point
    [37.7849, -122.4094], // End point
  ];

  // Create a polyline representing the route
  line = L.polyline(route, { color: 'red' }).addTo(map);

  // Create a marker at the starting point
  marker = L.marker(route[0]).addTo(map).bindPopup('Starting Point').openPopup();

  // Start animation
  animateMarker(route);
}

function animateMarker(route) {
  let index = 0;
  const interval = 20; // Time interval between steps in milliseconds
  const stepSize = 0.005; // Smaller value makes animation smoother

  function step() {
    if (index < route.length - 1) {
      const start = route[index];
      const end = route[index + 1];
      const latDiff = end[0] - start[0];
      const lngDiff = end[1] - start[1];
      
      let fraction = 0;

      function moveMarker() {
        fraction += stepSize;
        if (fraction <= 1) {
          const lat = start[0] + fraction * latDiff;
          const lng = start[1] + fraction * lngDiff;
          marker.setLatLng([lat, lng]);
          requestAnimationFrame(moveMarker);
        } else {
          index++;
          if (index < route.length - 1) {
            step();
          } else {
            marker.bindPopup('Ending Point').openPopup();
          }
        }
      }
      moveMarker();
    }
  }
  step();
}

// Load Leaflet map on window load
window.onload = initMap;
