/**
 * Property Location Selector for EstateLink
 * This script handles the selection and management of property locations
 */

window.EstateLink = window.EstateLink || {};
window.EstateLink.PropertyLocation = {
  map: null,
  marker: null,
  locationInput: null,
  latInput: null,
  lngInput: null,
  geocoder: null,
  autocomplete: null,

  /**
   * Initialize property location selector
   * @param {string} mapContainerId - ID of the map container element
   * @param {string} locationInputId - ID of the address input field
   * @param {string} latInputId - ID of the latitude input field
   * @param {string} lngInputId - ID of the longitude input field
   */
  init: function (mapContainerId, locationInputId, latInputId, lngInputId) {
    // Store input field references
    this.locationInput = document.getElementById(locationInputId);
    this.latInput = document.getElementById(latInputId);
    this.lngInput = document.getElementById(lngInputId);

    if (!this.locationInput || !this.latInput || !this.lngInput) {
      console.error("Required input fields not found");
      return;
    }

    // Initialize the map when Google Maps is available
    document.addEventListener("google-maps-loaded", () => {
      this.initMap(mapContainerId);
      this.setupAutocomplete();
    });

    // If Google Maps is already loaded, initialize immediately
    if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
      this.initMap(mapContainerId);
      this.setupAutocomplete();
    }

    // Set up event listeners for input fields
    this.setupEventListeners();
  },

  /**
   * Initialize Google Map
   * @param {string} mapContainerId - ID of the map container element
   */
  initMap: function (mapContainerId) {
    const mapContainer = document.getElementById(mapContainerId);
    if (!mapContainer) {
      console.error(`Map container with ID ${mapContainerId} not found`);
      return;
    }

    // Create map
    this.map = new google.maps.Map(mapContainer, {
      center: { lat: 20.5937, lng: 78.9629 }, // Default center (India)
      zoom: 5,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
    });

    // Create geocoder
    this.geocoder = new google.maps.Geocoder();

    // Set up map click event
    this.map.addListener("click", (e) => {
      this.setLocation(e.latLng.lat(), e.latLng.lng());
    });

    // Check if we already have coordinates in the input fields
    if (this.latInput.value && this.lngInput.value) {
      const lat = parseFloat(this.latInput.value);
      const lng = parseFloat(this.lngInput.value);
      if (!isNaN(lat) && !isNaN(lng)) {
        this.setLocation(lat, lng);
      }
    }
  },

  /**
   * Set up Google Places Autocomplete
   */
  setupAutocomplete: function () {
    if (!this.locationInput || !google || !google.maps || !google.maps.places) {
      return;
    }

    // Create autocomplete
    this.autocomplete = new google.maps.places.Autocomplete(
      this.locationInput,
      {
        types: ["geocode", "establishment"],
      }
    );

    // Restrict to current map bounds
    this.autocomplete.bindTo("bounds", this.map);

    // Handle place selection
    this.autocomplete.addListener("place_changed", () => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.error("Place has no geometry");
        return;
      }

      // Update map and marker
      this.setLocation(
        place.geometry.location.lat(),
        place.geometry.location.lng(),
        place.formatted_address || this.locationInput.value
      );

      // Zoom in to selected place
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
    });
  },

  /**
   * Set up event listeners for input fields
   */
  setupEventListeners: function () {
    // Manual coordinate input
    if (this.latInput && this.lngInput) {
      const updateFromCoordinates = () => {
        const lat = parseFloat(this.latInput.value);
        const lng = parseFloat(this.lngInput.value);
        if (!isNaN(lat) && !isNaN(lng)) {
          this.setLocation(lat, lng);
        }
      };

      this.latInput.addEventListener("change", updateFromCoordinates);
      this.lngInput.addEventListener("change", updateFromCoordinates);
    }

    // Find location button
    const findLocationBtn = document.getElementById("find-location-btn");
    if (findLocationBtn) {
      findLocationBtn.addEventListener("click", () => {
        if (this.locationInput && this.locationInput.value) {
          this.geocodeAddress(this.locationInput.value);
        }
      });
    }

    // Use current location button
    const useCurrentLocationBtn = document.getElementById(
      "use-current-location"
    );
    if (useCurrentLocationBtn) {
      useCurrentLocationBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
          useCurrentLocationBtn.disabled = true;
          useCurrentLocationBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Getting Location...';

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              this.setLocation(lat, lng);
              this.reverseGeocode(lat, lng);

              // Reset button
              useCurrentLocationBtn.disabled = false;
              useCurrentLocationBtn.innerHTML =
                '<i class="fas fa-location-arrow"></i> Use My Location';
            },
            (error) => {
              console.error("Geolocation error:", error);
              alert(
                "Unable to get your location. Please check your browser permissions."
              );

              // Reset button
              useCurrentLocationBtn.disabled = false;
              useCurrentLocationBtn.innerHTML =
                '<i class="fas fa-location-arrow"></i> Use My Location';
            }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
      });
    }
  },

  /**
   * Set location by coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {string} address - Optional address to display
   */
  setLocation: function (lat, lng, address = null) {
    // Update input fields
    if (this.latInput && this.lngInput) {
      this.latInput.value = lat.toFixed(6);
      this.lngInput.value = lng.toFixed(6);
    }

    // Update map
    if (this.map) {
      const position = { lat: lat, lng: lng };
      this.map.setCenter(position);

      // Create marker if it doesn't exist
      if (!this.marker) {
        this.marker = new google.maps.Marker({
          position: position,
          map: this.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
        });

        // Add drag end event listener
        this.marker.addListener("dragend", () => {
          const pos = this.marker.getPosition();
          this.setLocation(pos.lat(), pos.lng());
          this.reverseGeocode(pos.lat(), pos.lng());
        });
      } else {
        // Update existing marker
        this.marker.setPosition(position);
      }

      // If no address was provided, try to get one
      if (!address && this.geocoder) {
        this.reverseGeocode(lat, lng);
      } else if (address && this.locationInput) {
        this.locationInput.value = address;
      }

      // Trigger change event on inputs
      if (this.latInput && this.lngInput) {
        this.latInput.dispatchEvent(new Event("change"));
        this.lngInput.dispatchEvent(new Event("change"));
      }
    }
  },

  /**
   * Geocode an address to coordinates
   * @param {string} address - Address to geocode
   */
  geocodeAddress: function (address) {
    if (!this.geocoder || !address) return;

    this.geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        this.setLocation(
          location.lat(),
          location.lng(),
          results[0].formatted_address
        );

        // Zoom to result
        this.map.setZoom(14);
      } else {
        console.error("Geocode was not successful:", status);
        alert("Could not find that location. Please try a different address.");
      }
    });
  },

  /**
   * Reverse geocode coordinates to an address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   */
  reverseGeocode: function (lat, lng) {
    if (!this.geocoder || !this.locationInput) return;

    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

    this.geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results[0]) {
        this.locationInput.value = results[0].formatted_address;
      } else {
        console.error("Reverse geocode was not successful:", status);
        this.locationInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    });
  },
};

// Auto-initialize when a property location form exists
document.addEventListener("DOMContentLoaded", function () {
  // Look for property form elements
  const mapContainer = document.getElementById("property-location-map");
  const locationInput = document.getElementById("property-location");
  const latInput = document.getElementById("property-latitude");
  const lngInput = document.getElementById("property-longitude");

  // Initialize if all elements exist
  if (mapContainer && locationInput && latInput && lngInput) {
    EstateLink.PropertyLocation.init(
      "property-location-map",
      "property-location",
      "property-latitude",
      "property-longitude"
    );
  }
});
