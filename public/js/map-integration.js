/**
 * EstateLink - Google Maps Integration
 * This file handles the integration with Google Maps API for property visualization
 */

// Map initialization
let map;
let propertyBoundaries = [];
let currentMarkers = [];
let infoWindows = [];
let currentShapes = [];
let heatmap = null;
let clusterMarkers = [];
let markerCluster = null;

// Initialize the map with Google Maps API
function initBhuvanMap(mapContainerId) {
  // Check if container exists
  const mapContainer = document.getElementById(mapContainerId);
  if (!mapContainer) {
    console.error(`Map container with ID ${mapContainerId} not found`);
    return;
  }

  // Initialize Google Map
  map = new BhuvanMaps.Map(mapContainerId, {
    center: [20.5937, 78.9629], // Default center (India)
    zoom: 5, // Default zoom level for whole country view
    maxZoom: 18,
    minZoom: 4,
    attributionControl: true,
  });

  // Add event listeners for the map
  setupMapEventListeners(map, mapContainerId);

  // Return map instance
  return map;
}

// Setup map event listeners
function setupMapEventListeners(map, mapContainerId) {
  // Listen for map area selection events
  document.addEventListener("map-area-selected", (event) => {
    // Get the shape from the event
    const shape = event.detail.shape;

    // Clear previous search markers
    clearMarkers();

    // Get properties in the area
    if (shape) {
      const center = shape.getCenter
        ? shape.getCenter()
        : shape.getBounds().getCenter();
      const radius = shape.getRadius ? shape.getRadius() / 1000 : 1; // Convert to km

      // Search for properties in this area
      searchPropertiesByLocation(center.lat(), center.lng(), radius);
    }
  });

  // Add draw search button event
  const drawSearchBtn = document.getElementById("draw-search-area");
  if (drawSearchBtn) {
    drawSearchBtn.addEventListener("click", () => {
      if (map) {
        // Enable drawing mode for circles
        map.enableDrawing("circle");
      }
    });
  }

  // Draw polygon button
  const drawPolygonBtn = document.getElementById("draw-polygon");
  if (drawPolygonBtn) {
    drawPolygonBtn.addEventListener("click", () => {
      if (map) {
        // Enable drawing mode for polygons
        map.enableDrawing("polygon");
      }
    });
  }

  // Toggle heatmap button
  const toggleHeatmapBtn = document.getElementById("toggle-heatmap");
  if (toggleHeatmapBtn) {
    toggleHeatmapBtn.addEventListener("click", () => {
      toggleHeatmap();
    });
  }

  // Toggle clusters button
  const toggleClustersBtn = document.getElementById("toggle-clusters");
  if (toggleClustersBtn) {
    toggleClustersBtn.addEventListener("click", () => {
      toggleMarkerClusters();
    });
  }
}

// Load property boundaries from GeoJSON
function loadPropertyBoundaries(geoJsonData) {
  // Clear any existing boundaries
  if (propertyBoundaries.length > 0) {
    propertyBoundaries.forEach((boundary) => map.removeLayer(boundary));
    propertyBoundaries = [];
  }

  // Add new boundaries
  const boundariesLayer = BhuvanMaps.geoJSON(geoJsonData, {
    style: {
      color: "#ff7800",
      weight: 2,
      opacity: 0.65,
      fillOpacity: 0.4,
    },
    onEachFeature: function (feature, layer) {
      // Bind popup with property information
      if (feature.properties) {
        layer.bindPopup(`
          <strong>${
            feature.properties.propertyId || "Unknown Property"
          }</strong><br>
          ${feature.properties.address || ""}<br>
          ${
            feature.properties.ownerName
              ? "Owner: " + feature.properties.ownerName
              : ""
          }
        `);
      }
    },
  }).addTo(map);

  propertyBoundaries.push(boundariesLayer);

  // Zoom to show all boundaries
  map.fitBounds(boundariesLayer.getBounds());

  return boundariesLayer;
}

// Add property markers to the map
function addPropertyMarkers(properties) {
  // Clear existing markers
  clearMarkers();

  // Points for heatmap and clusters
  const heatmapPoints = [];
  clusterMarkers = [];

  // Add new markers
  properties.forEach((property) => {
    if (property.latitude && property.longitude) {
      const marker = BhuvanMaps.marker([
        property.latitude,
        property.longitude,
      ]).addTo(map);

      // Create info window content
      const infoContent = `
        <div class="map-info-window">
          <h3>${property.id || "Property"}</h3>
          <p>${property.address || ""}</p>
          <div class="property-details">
            <p><strong>Type:</strong> ${property.type || "Not specified"}</p>
            <p><strong>Price:</strong> ₹${
              property.price ? property.price.toLocaleString() : "Not available"
            }</p>
            <p><strong>Area:</strong> ${
              property.area ? property.area + " sq ft" : "Not specified"
            }</p>
          </div>
          <div class="property-actions">
            <button class="btn btn-primary view-property-btn" data-id="${
              property.id
            }">View Details</button>
          </div>
        </div>
      `;

      // Bind popup
      marker.bindPopup(infoContent);

      // Store marker
      currentMarkers.push(marker);

      // Add to heatmap points
      heatmapPoints.push({
        location: new google.maps.LatLng(property.latitude, property.longitude),
        weight: calculatePropertyWeight(property),
      });

      // Add to cluster markers for later use
      clusterMarkers.push({
        position: new google.maps.LatLng(property.latitude, property.longitude),
        title: property.id || "Property",
        property: property,
      });

      // Add click event listeners for "View Details" buttons in info windows
      google.maps.event.addListener(marker._popup, "domready", () => {
        const viewButtons = document.querySelectorAll(".view-property-btn");
        viewButtons.forEach((button) => {
          const propertyId = button.getAttribute("data-id");
          button.addEventListener("click", () => {
            viewPropertyDetails(propertyId);
          });
        });
      });
    }
  });

  // If we have markers, fit the map to show all of them
  if (currentMarkers.length > 0) {
    const group = new BhuvanMaps.featureGroup(currentMarkers);
    map.fitBounds(group.getBounds());
  }

  // Initialize heatmap data if we have points
  if (heatmapPoints.length > 0) {
    initializeHeatmap(heatmapPoints);
  }
}

// Calculate property weight for heatmap based on price or other factors
function calculatePropertyWeight(property) {
  // Use price as a factor, or default to 1
  let weight = 1;
  if (property.price) {
    // Normalize weight: higher price = higher weight (adjust as needed)
    weight = Math.min(Math.max(property.price / 1000000, 1), 10);
  }
  return weight;
}

// Initialize heatmap with property data
function initializeHeatmap(points) {
  if (heatmap) {
    heatmap.setMap(null);
  }

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: points,
    radius: 30,
    opacity: 0.7,
  });

  // Initially hide the heatmap
  heatmap.setMap(null);
}

// Toggle heatmap visibility
function toggleHeatmap() {
  if (!heatmap) return;

  heatmap.setMap(heatmap.getMap() ? null : map._map);

  // Update button state
  const toggleHeatmapBtn = document.getElementById("toggle-heatmap");
  if (toggleHeatmapBtn) {
    if (heatmap.getMap()) {
      toggleHeatmapBtn.textContent = "Hide Heatmap";
      toggleHeatmapBtn.classList.add("active");
    } else {
      toggleHeatmapBtn.textContent = "Show Heatmap";
      toggleHeatmapBtn.classList.remove("active");
    }
  }
}

// Initialize marker clusters
function initializeMarkerClusters() {
  if (markerCluster) {
    markerCluster.clearMarkers();
  }

  // Skip if no markers
  if (clusterMarkers.length === 0) return;

  // Create array of Google Maps markers
  const markers = clusterMarkers.map((markerData) => {
    const marker = new google.maps.Marker({
      position: markerData.position,
      title: markerData.title,
    });

    // Add info window to each marker
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="map-info-window">
          <h3>${markerData.property.id || "Property"}</h3>
          <p>${markerData.property.address || ""}</p>
          <div class="property-actions">
            <button class="btn btn-primary view-property-btn" data-id="${
              markerData.property.id
            }">View Details</button>
          </div>
        </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map._map, marker);
    });

    return marker;
  });

  // Create MarkerClusterer
  markerCluster = new MarkerClusterer(map._map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    maxZoom: 15,
    gridSize: 50,
  });

  // Initially hide clusters
  markerCluster.clearMarkers();
}

// Toggle marker clusters
function toggleMarkerClusters() {
  if (!markerCluster) {
    initializeMarkerClusters();
  }

  // Toggle visibility
  if (markerCluster.getTotalMarkers() > 0) {
    markerCluster.clearMarkers();
    showIndividualMarkers();
  } else {
    hideIndividualMarkers();
    markerCluster.addMarkers(markerCluster.getMarkers());
  }

  // Update button state
  const toggleClustersBtn = document.getElementById("toggle-clusters");
  if (toggleClustersBtn) {
    if (markerCluster.getTotalMarkers() > 0) {
      toggleClustersBtn.textContent = "Show Individual Markers";
      toggleClustersBtn.classList.add("active");
    } else {
      toggleClustersBtn.textContent = "Show Clusters";
      toggleClustersBtn.classList.remove("active");
    }
  }
}

// Hide individual markers when showing clusters
function hideIndividualMarkers() {
  currentMarkers.forEach((marker) => {
    marker._layer.setMap(null);
  });
}

// Show individual markers when hiding clusters
function showIndividualMarkers() {
  currentMarkers.forEach((marker) => {
    marker._layer.setMap(map._map);
  });
}

// Clear all markers from the map
function clearMarkers() {
  if (currentMarkers.length > 0) {
    currentMarkers.forEach((marker) => map.removeLayer(marker));
    currentMarkers = [];
  }

  // Clear heatmap if present
  if (heatmap) {
    heatmap.setMap(null);
  }

  // Clear marker clusters if present
  if (markerCluster) {
    markerCluster.clearMarkers();
  }

  clusterMarkers = [];
}

// Search properties by location (coordinates)
function searchPropertiesByLocation(lat, lng, radiusKm = 1) {
  const searchCircle = BhuvanMaps.circle([lat, lng], radiusKm * 1000, {
    color: "blue",
    fillColor: "#30f",
    fillOpacity: 0.2,
  }).addTo(map);

  // Store the shape for later reference
  currentShapes.push(searchCircle);

  // Zoom to the search area
  map.fitBounds(searchCircle.getBounds());

  // This would typically make an API call to get properties within this circle
  // For demo purposes, we'll simulate a response
  fetchPropertiesInArea(lat, lng, radiusKm)
    .then((properties) => {
      addPropertyMarkers(properties);

      // Show search results
      const searchResults = document.getElementById("search-results");
      if (searchResults) {
        searchResults.classList.remove("hidden");
      }

      // Update results count
      const resultsNumber = document.getElementById("results-number");
      if (resultsNumber) {
        resultsNumber.textContent = `${properties.length} properties found`;
      }

      // Update results list
      updateResultsList(properties);
    })
    .catch((error) => {
      console.error("Error fetching properties by location:", error);
    });

  return searchCircle;
}

// Update the HTML list view with property results
function updateResultsList(properties) {
  const resultsList = document.getElementById("results-list");
  if (!resultsList) return;

  // Clear existing results
  resultsList.innerHTML = "";

  // Add new property items
  properties.forEach((property) => {
    const listItem = document.createElement("li");
    listItem.className = "property-item";

    // Create HTML for property item
    listItem.innerHTML = `
      <div class="property-image">
        <img src="${
          property.imageUrl || "./images/property-placeholder.jpg"
        }" alt="${property.id}">
        ${
          property.featured
            ? '<span class="property-featured">Featured</span>'
            : ""
        }
      </div>
      <div class="property-content">
        <h3 class="property-title">${property.id || "Property"}</h3>
        <div class="property-address">${
          property.address || "Address not available"
        }</div>
        <div class="property-price">₹${
          property.price
            ? property.price.toLocaleString()
            : "Price not available"
        }</div>
        <div class="property-details">
          <span><i class="fas fa-ruler-combined"></i> ${
            property.area || "N/A"
          } sq ft</span>
          <span><i class="fas fa-building"></i> ${property.type || "N/A"}</span>
          <span><i class="fas fa-calendar-alt"></i> ${formatDate(
            property.listingDate
          )}</span>
        </div>
        <div class="property-actions">
          <button class="btn btn-primary view-details" data-id="${
            property.id
          }">View Details</button>
          <button class="btn btn-outline add-to-compare" data-id="${
            property.id
          }">Compare</button>
        </div>
      </div>
    `;

    // Add to results list
    resultsList.appendChild(listItem);

    // Add event listeners for buttons
    const viewDetailsBtn = listItem.querySelector(".view-details");
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener("click", () => {
        viewPropertyDetails(property.id);
      });
    }

    const compareBtn = listItem.querySelector(".add-to-compare");
    if (compareBtn) {
      compareBtn.addEventListener("click", () => {
        addPropertyToCompare(property.id);
      });
    }
  });
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// View property details
function viewPropertyDetails(propertyId) {
  console.log(`Viewing property ${propertyId}`);

  // In a real application, fetch the property details from the server
  // For demo, we'll open the property details modal with mock data
  const modal = document.getElementById("property-details-modal");
  const modalContent = document.getElementById("property-details-content");

  if (modal && modalContent) {
    // Fetch property details (mocked for demo)
    fetchPropertyDetails(propertyId).then((property) => {
      // Populate modal with property details
      modalContent.innerHTML = `
        <div class="property-details-container">
          <div class="property-details-header">
            <h2>${property.title || property.id}</h2>
            <span class="property-price">₹${
              property.price
                ? property.price.toLocaleString()
                : "Price not available"
            }</span>
          </div>
          
          <div class="property-details-gallery">
            <img src="${
              property.imageUrl || "./images/property-placeholder.jpg"
            }" alt="${
        property.title || property.id
      }" class="property-main-image">
          </div>
          
          <div class="property-details-info">
            <div class="property-address">
              <i class="fas fa-map-marker-alt"></i> ${
                property.address || "Address not available"
              }
            </div>
            
            <div class="property-specs">
              <div class="property-spec-item">
                <span class="spec-label">Area</span>
                <span class="spec-value">${property.area || "N/A"} sq ft</span>
              </div>
              <div class="property-spec-item">
                <span class="spec-label">Type</span>
                <span class="spec-value">${property.type || "N/A"}</span>
              </div>
              <div class="property-spec-item">
                <span class="spec-label">Status</span>
                <span class="spec-value">${property.status || "N/A"}</span>
              </div>
              <div class="property-spec-item">
                <span class="spec-label">Listed On</span>
                <span class="spec-value">${formatDate(
                  property.listingDate
                )}</span>
              </div>
            </div>
            
            <div class="property-description">
              <h3>Description</h3>
              <p>${property.description || "No description available"}</p>
            </div>
            
            <div class="property-owner-details">
              <h3>Owner Information</h3>
              <p><strong>Name:</strong> ${
                property.ownerName || "Not available"
              }</p>
              <p><strong>Contact:</strong> ${
                property.ownerContact || "Not available"
              }</p>
            </div>
          </div>
        </div>
      `;

      // Show the modal
      modal.classList.remove("hidden");
    });
  }
}

// Add property to compare list
function addPropertyToCompare(propertyId) {
  console.log(`Adding property ${propertyId} to compare list`);

  // In a real application, you would store this property in a compare list
  // For demo, just show an alert
  alert(`Property ${propertyId} added to comparison list`);
}

// Use browser geolocation to center the map
function centerMapOnUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 14);

        // Add a marker at user's position
        const userMarker = BhuvanMaps.marker([lat, lng], {
          icon: BhuvanMaps.icon({
            iconUrl: "../images/user-location.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        })
          .addTo(map)
          .bindPopup("Your location");

        currentMarkers.push(userMarker);
      },
      function (error) {
        console.error("Error getting user location:", error);
        alert(
          "Unable to access your location. Please check your browser permissions."
        );
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Mock function to fetch properties in an area
// In production, this would be an API call to your backend
async function fetchPropertiesInArea(lat, lng, radiusKm) {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate random properties around the specified coordinates
      const numProperties = Math.floor(Math.random() * 10) + 5; // 5-15 properties
      const properties = [];

      for (let i = 0; i < numProperties; i++) {
        // Random offset within the radius (in degrees)
        const randomAngle = Math.random() * 2 * Math.PI;
        const randomDistance = Math.random() * radiusKm * 0.009; // Convert km to rough degree equivalent

        const propertyLat = lat + randomDistance * Math.cos(randomAngle);
        const propertyLng = lng + randomDistance * Math.sin(randomAngle);

        // Property types
        const propertyTypes = [
          "Residential",
          "Commercial",
          "Agricultural",
          "Industrial",
        ];

        properties.push({
          id: `PROP-${Math.floor(Math.random() * 1000000)}`,
          latitude: propertyLat,
          longitude: propertyLng,
          address: generateRandomAddress(),
          price: Math.floor(Math.random() * 9000000) + 1000000, // Random price between 1M and 10M
          area: Math.floor(Math.random() * 2000) + 500, // Random area between 500 and 2500 sq ft
          type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          listingDate: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(), // Random date within last 30 days
          featured: Math.random() > 0.8, // 20% chance of being featured
          imageUrl: `./images/property-placeholder.jpg`, // Placeholder image for all properties
        });
      }

      resolve(properties);
    }, 500);
  });
}

// Mock function to fetch property details
async function fetchPropertyDetails(propertyId) {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: propertyId,
        title: `Property ${propertyId}`,
        price: Math.floor(Math.random() * 9000000) + 1000000,
        address: generateRandomAddress(),
        area: Math.floor(Math.random() * 2000) + 500,
        type: ["Residential", "Commercial", "Agricultural", "Industrial"][
          Math.floor(Math.random() * 4)
        ],
        status: ["Available", "Under Contract", "Sold"][
          Math.floor(Math.random() * 3)
        ],
        listingDate: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
        description:
          "This is a beautiful property located in a prime area with excellent connectivity to major roads and public transportation. The property offers spacious rooms with plenty of natural light, modern amenities, and well-maintained surroundings.",
        ownerName: "John Doe",
        ownerContact: "+91 98765 43210",
        imageUrl: `./images/property-placeholder.jpg`,
      });
    }, 300);
  });
}

// Generate a random address for demo purposes
function generateRandomAddress() {
  const streets = [
    "Main Street",
    "Park Avenue",
    "Gandhi Road",
    "Nehru Marg",
    "MG Road",
    "Lake View Lane",
    "Station Road",
    "Temple Street",
  ];
  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
  ];
  const states = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "West Bengal",
    "Telangana",
    "Maharashtra",
    "Gujarat",
  ];

  const streetNum = Math.floor(Math.random() * 100) + 1;
  const streetIndex = Math.floor(Math.random() * streets.length);

  return `${streetNum} ${streets[streetIndex]}, ${cities[streetIndex]}, ${states[streetIndex]}`;
}

// Export functions
window.EstateLink = window.EstateLink || {};
window.EstateLink.Maps = {
  initBhuvanMap,
  loadPropertyBoundaries,
  addPropertyMarkers,
  searchPropertiesByLocation,
  centerMapOnUserLocation,
  clearMarkers,
  toggleHeatmap,
  toggleMarkerClusters,
};
