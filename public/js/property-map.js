// Initialize EstateLink Maps namespace if it doesn't exist
window.EstateLink = window.EstateLink || {};
window.EstateLink.Maps = {
  searchMap: null,
  resultsMap: null,
  currentMarkers: [],
  heatmapLayer: null,
  markerCluster: null,
  currentCircle: null,
  currentPolygon: null,

  // Initialize maps when DOM is ready
  init: function () {
    document.addEventListener("DOMContentLoaded", () => {
      this.initSearchMap();
      this.initResultsMap();
      this.setupMapControls();
    });
  },

  // Initialize the search map
  initSearchMap: function () {
    const mapContainer = document.getElementById("map-search-container");
    if (!mapContainer) return;

    // Wait for Google Maps to be available
    if (typeof BhuvanMaps === "undefined") {
      setTimeout(() => this.initSearchMap(), 100);
      return;
    }

    // Create a new map in the search container
    this.searchMap = new BhuvanMaps.Map("map-search-container", {
      center: [20.5937, 78.9629], // Default center (India)
      zoom: 5,
    });

    // Set global reference for the search map
    window.searchMap = this.searchMap;

    // Add event listener for map click to get coordinates
    this.searchMap._map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      console.log(`Clicked at location: [${lat}, ${lng}]`);

      // Get radius and property type for search
      const radius =
        parseFloat(document.getElementById("search-radius").value) || 1;
      const propertyType =
        document.getElementById("property-type-map").value || "all";

      // Perform search based on clicked location
      this.searchPropertiesByLocation(lat, lng, radius, propertyType);
    });
  },

  // Initialize the results map
  initResultsMap: function () {
    const mapContainer = document.getElementById("results-map-container");
    if (!mapContainer) return;

    // Wait for Google Maps to be available
    if (typeof BhuvanMaps === "undefined") {
      setTimeout(() => this.initResultsMap(), 100);
      return;
    }

    // Create a new map in the results container
    this.resultsMap = new BhuvanMaps.Map("results-map-container", {
      center: [20.5937, 78.9629], // Default center (India)
      zoom: 5,
    });
  },

  // Setup map control buttons
  setupMapControls: function () {
    // Use my location button
    const useMyLocationBtn = document.getElementById("use-my-location");
    if (useMyLocationBtn) {
      useMyLocationBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
          useMyLocationBtn.disabled = true;
          useMyLocationBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Getting Location...';

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              // Center map on user's location
              this.searchMap.setView([lat, lng], 14);

              // Get radius and property type for search
              const radius =
                parseFloat(document.getElementById("search-radius").value) || 1;
              const propertyType =
                document.getElementById("property-type-map").value || "all";

              // Search for properties
              this.searchPropertiesByLocation(lat, lng, radius, propertyType);

              // Reset button
              useMyLocationBtn.disabled = false;
              useMyLocationBtn.innerHTML =
                '<i class="fas fa-location-arrow"></i> Use My Location';
            },
            (error) => {
              console.error("Error getting location:", error);
              alert(
                "Unable to get your location. Please check your browser permissions."
              );

              // Reset button
              useMyLocationBtn.disabled = false;
              useMyLocationBtn.innerHTML =
                '<i class="fas fa-location-arrow"></i> Use My Location';
            }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
      });
    }

    // Draw circle button
    const drawCircleBtn = document.getElementById("draw-search-area");
    if (drawCircleBtn) {
      drawCircleBtn.addEventListener("click", () => {
        // Toggle drawing mode
        if (drawCircleBtn.classList.contains("active")) {
          // Disable drawing mode
          drawCircleBtn.classList.remove("active");
          this.searchMap.disableDrawing();
        } else {
          // Enable drawing mode (circle)
          drawCircleBtn.classList.add("active");
          this.searchMap.enableDrawing("circle");

          // Make sure other drawing buttons are inactive
          document.getElementById("draw-polygon")?.classList.remove("active");
        }
      });
    }

    // Draw polygon button
    const drawPolygonBtn = document.getElementById("draw-polygon");
    if (drawPolygonBtn) {
      drawPolygonBtn.addEventListener("click", () => {
        // Toggle drawing mode
        if (drawPolygonBtn.classList.contains("active")) {
          // Disable drawing mode
          drawPolygonBtn.classList.remove("active");
          this.searchMap.disableDrawing();
        } else {
          // Enable drawing mode (polygon)
          drawPolygonBtn.classList.add("active");
          this.searchMap.enableDrawing("polygon");

          // Make sure other drawing buttons are inactive
          document
            .getElementById("draw-search-area")
            ?.classList.remove("active");
        }
      });
    }

    // Toggle heatmap button
    const toggleHeatmapBtn = document.getElementById("toggle-heatmap");
    if (toggleHeatmapBtn) {
      toggleHeatmapBtn.addEventListener("click", () => {
        this.toggleHeatmap();
      });
    }

    // Toggle clusters button
    const toggleClustersBtn = document.getElementById("toggle-clusters");
    if (toggleClustersBtn) {
      toggleClustersBtn.addEventListener("click", () => {
        this.toggleClusters();
      });
    }

    // Clear map button
    const clearMapBtn = document.getElementById("clear-map");
    if (clearMapBtn) {
      clearMapBtn.addEventListener("click", () => {
        this.clearMap();
      });
    }

    // Listen for map area selection event
    document.addEventListener("map-area-selected", (e) => {
      const shape = e.detail.shape;

      if (shape.getRadius) {
        // Circle
        const center = shape.getCenter();
        const radius = shape.getRadius() / 1000; // Convert to km
        this.searchPropertiesByLocation(center.lat(), center.lng(), radius);
      } else {
        // Polygon - to be implemented
        console.log("Polygon search not yet implemented");
      }
    });

    // Setup result view tabs
    const resultTabs = document.querySelectorAll(".results-tab");
    resultTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Update active tab
        resultTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Show corresponding view
        const view = tab.getAttribute("data-view");
        const views = document.querySelectorAll(".results-view");
        views.forEach((v) => {
          v.classList.remove("active");
          if (v.id === view) {
            v.classList.add("active");
          }
        });

        // Resize map if necessary
        if (view === "map-view" && this.resultsMap) {
          this.resultsMap.invalidateSize();
        }
      });
    });
  },

  // Search properties by location
  searchPropertiesByLocation: function (
    lat,
    lng,
    radius,
    propertyType = "all"
  ) {
    console.log(
      `Searching for ${propertyType} properties within ${radius}km of [${lat}, ${lng}]`
    );

    // Clear previous search visuals
    this.clearSearchVisuals();

    // Add circle to visualize search area
    this.currentCircle = BhuvanMaps.circle([lat, lng], radius * 1000, {
      color: "#4285F4",
      fillColor: "#4285F4",
      fillOpacity: 0.2,
    }).addTo(this.searchMap);

    // Center map on search location
    this.searchMap.setView([lat, lng], 14);

    // In a real app, this would make an API call
    // For demo purposes, we're using the filter in property-search.js
  },

  // Add property markers to map
  addPropertyMarkers: function (properties) {
    // Clear existing markers
    this.clearMarkers();

    if (!properties || !properties.length) return;

    // Prepare data for heatmap
    const heatmapData = [];
    const markers = [];

    properties.forEach((property) => {
      // Create marker
      const marker = new google.maps.Marker({
        position: { lat: property.latitude, lng: property.longitude },
        map: this.resultsMap._map,
        title: property.address,
        animation: google.maps.Animation.DROP,
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="map-info-window">
            <h3>${property.address}</h3>
            <div class="property-details">
              <p>${property.propertyType} | ${property.area}</p>
              <p>${property.price}</p>
            </div>
            <div class="property-actions">
              <button class="map-btn view-property" data-id="${property.id}">View Details</button>
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(this.resultsMap._map, marker);
      });

      // Store marker
      markers.push(marker);
      this.currentMarkers.push(marker);

      // Add to heatmap data
      heatmapData.push({
        location: new google.maps.LatLng(property.latitude, property.longitude),
        weight: 1,
      });

      // Add property boundary if available
      if (property.propertyBoundary && property.propertyBoundary.length > 0) {
        const boundaryPath = property.propertyBoundary.map((point) => ({
          lat: point[0],
          lng: point[1],
        }));

        const polygon = new google.maps.Polygon({
          paths: boundaryPath,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });

        polygon.setMap(this.resultsMap._map);
      }
    });

    // Create heatmap layer (hidden by default)
    this.heatmapData = heatmapData;
    this.heatmapLayer = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: null, // Don't show initially
    });

    // Create marker cluster (hidden by default)
    this.markerCluster = new MarkerClusterer(this.resultsMap._map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      gridSize: 50,
      minimumClusterSize: 2,
    });

    // Hide clusters initially
    this.markerCluster.clearMarkers();

    // Fit map to include all markers
    const bounds = new google.maps.LatLngBounds();
    properties.forEach((property) => {
      bounds.extend({ lat: property.latitude, lng: property.longitude });
    });
    this.resultsMap._map.fitBounds(bounds);
  },

  // Toggle heatmap visualization
  toggleHeatmap: function () {
    const btn = document.getElementById("toggle-heatmap");

    if (
      !this.heatmapLayer ||
      !this.heatmapData ||
      this.heatmapData.length === 0
    ) {
      alert("No property data available for heatmap visualization.");
      return;
    }

    if (btn.classList.contains("active")) {
      // Turn off heatmap
      btn.classList.remove("active");
      this.heatmapLayer.setMap(null);
    } else {
      // Turn on heatmap
      btn.classList.add("active");

      // Hide clusters if they're visible
      document.getElementById("toggle-clusters")?.classList.remove("active");
      if (this.markerCluster) {
        this.markerCluster.clearMarkers();
      }

      // Show individual markers
      this.currentMarkers.forEach((marker) =>
        marker.setMap(this.resultsMap._map)
      );

      // Show heatmap
      this.heatmapLayer.setMap(this.resultsMap._map);
    }
  },

  // Toggle marker clusters
  toggleClusters: function () {
    const btn = document.getElementById("toggle-clusters");

    if (!this.markerCluster || this.currentMarkers.length === 0) {
      alert("No property data available for cluster visualization.");
      return;
    }

    if (btn.classList.contains("active")) {
      // Turn off clusters
      btn.classList.remove("active");
      this.markerCluster.clearMarkers();

      // Show individual markers
      this.currentMarkers.forEach((marker) =>
        marker.setMap(this.resultsMap._map)
      );
    } else {
      // Turn on clusters
      btn.classList.add("active");

      // Hide heatmap if it's visible
      document.getElementById("toggle-heatmap")?.classList.remove("active");
      if (this.heatmapLayer) {
        this.heatmapLayer.setMap(null);
      }

      // Use clusterer
      this.markerCluster.addMarkers(this.currentMarkers);
    }
  },

  // Clear all markers from the map
  clearMarkers: function () {
    // Clear existing markers
    this.currentMarkers.forEach((marker) => marker.setMap(null));
    this.currentMarkers = [];

    // Clear heatmap
    if (this.heatmapLayer) {
      this.heatmapLayer.setMap(null);
    }

    // Clear marker clusters
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }
  },

  // Clear search visuals (circles, polygons)
  clearSearchVisuals: function () {
    if (this.currentCircle) {
      this.currentCircle.setMap(null);
      this.currentCircle = null;
    }

    if (this.currentPolygon) {
      this.currentPolygon.setMap(null);
      this.currentPolygon = null;
    }
  },

  // Clear everything from the map
  clearMap: function () {
    this.clearMarkers();
    this.clearSearchVisuals();

    // Reset buttons
    document.getElementById("toggle-heatmap")?.classList.remove("active");
    document.getElementById("toggle-clusters")?.classList.remove("active");
    document.getElementById("draw-search-area")?.classList.remove("active");
    document.getElementById("draw-polygon")?.classList.remove("active");

    // Disable drawing mode
    if (this.searchMap) {
      this.searchMap.disableDrawing();
    }
  },
};

// Initialize the maps when the script loads
EstateLink.Maps.init();
