/**
 * Google Maps integration for EstateLink
 * This file replaces the BhuvanMaps implementation with Google Maps
 */

// Create a namespace to maintain compatibility with existing code
window.BhuvanMaps = (function () {
  // Ensure Google Maps is loaded
  function loadGoogleMaps() {
    if (typeof google === "undefined" || typeof google.maps === "undefined") {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places,drawing,visualization&callback=googleMapsLoaded`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      // Global callback function that Google Maps will call when loaded
      window.googleMapsLoaded = function () {
        console.log("Google Maps loaded successfully");
        document.dispatchEvent(new Event("google-maps-loaded"));
      };
    } else {
      console.log("Google Maps already loaded");
      document.dispatchEvent(new Event("google-maps-loaded"));
    }
  }

  // Load Google Maps
  loadGoogleMaps();

  // Wait for Google Maps to load
  function ensureGoogleMaps() {
    return new Promise((resolve) => {
      if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
        resolve();
      } else {
        document.addEventListener(
          "google-maps-loaded",
          () => {
            resolve();
          },
          { once: true }
        );
      }
    });
  }

  // Map class - wrapper for Google Maps
  class Map {
    constructor(containerId, options) {
      this._containerId = containerId;
      this._options = options || {};
      this._layers = [];
      this._markers = [];
      this._controls = [];
      this._baseLayer = null;
      this._mapLoaded = false;

      // Initialize the map
      this._initMap();
    }

    async _initMap() {
      await ensureGoogleMaps();

      const container = document.getElementById(this._containerId);
      if (!container) {
        console.error(
          `Container element with ID ${this._containerId} not found`
        );
        return;
      }

      // Set default values if not provided
      const center = this._options.center || [20.5937, 78.9629]; // Default center (India)
      const zoom = this._options.zoom || 5;

      // Create the map
      this._map = new google.maps.Map(container, {
        center: { lat: center[0], lng: center[1] },
        zoom: zoom,
        maxZoom: this._options.maxZoom || 20,
        minZoom: this._options.minZoom || 3,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
      });

      // Add drawing manager for polygon search
      this._drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
          ],
        },
        circleOptions: {
          fillColor: "#4285F4",
          fillOpacity: 0.2,
          strokeWeight: 2,
          strokeColor: "#4285F4",
          clickable: true,
          editable: true,
          zIndex: 1,
        },
        polygonOptions: {
          fillColor: "#4285F4",
          fillOpacity: 0.2,
          strokeWeight: 2,
          strokeColor: "#4285F4",
          clickable: true,
          editable: true,
          zIndex: 1,
        },
      });

      this._drawingManager.setMap(this._map);

      // Add places autocomplete search box
      const input = document.createElement("input");
      input.placeholder = "Search for locations";
      input.className = "map-search-box";
      input.type = "text";

      const searchBox = new google.maps.places.SearchBox(input);
      this._map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport
      this._map.addListener("bounds_changed", () => {
        searchBox.setBounds(this._map.getBounds());
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        // Clear old markers
        this._markers.forEach((marker) => marker.setMap(null));

        // Create bounds object for all places
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;

          // Create marker for place
          const marker = new google.maps.Marker({
            map: this._map,
            title: place.name,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
          });

          this._markers.push(marker);

          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${place.name || "Location"}</strong><br>${
              place.formatted_address || ""
            }</div>`,
          });

          marker.addListener("click", () => {
            infoWindow.open(this._map, marker);
          });

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        this._map.fitBounds(bounds);
      });

      // Setup drawing event
      google.maps.event.addListener(
        this._drawingManager,
        "overlaycomplete",
        (event) => {
          // Store the drawn shape
          const shape = event.overlay;
          this._currentShape = shape;

          // Add an info window to the shape
          const center = shape.getCenter
            ? shape.getCenter()
            : shape.getBounds().getCenter();
          const radius = shape.getRadius
            ? Math.round(shape.getRadius()) + " meters"
            : "";

          const infoWindow = new google.maps.InfoWindow({
            content: `<div>Search Area ${
              radius ? "(radius: " + radius + ")" : ""
            }</div>
                   <div><button id="search-in-area" class="map-btn">Search in this area</button></div>`,
          });

          infoWindow.setPosition(center);
          infoWindow.open(this._map);

          // Add click event for the search button in info window
          google.maps.event.addListener(infoWindow, "domready", () => {
            document
              .getElementById("search-in-area")
              .addEventListener("click", () => {
                // This would trigger a search within the area
                console.log("Searching in drawn area");
                const searchRadius = document.getElementById("search-radius");
                if (searchRadius && shape.getRadius) {
                  searchRadius.value = (shape.getRadius() / 1000).toFixed(1); // Convert to km
                }

                // Here we would trigger the actual search functionality
                const customEvent = new CustomEvent("map-area-selected", {
                  detail: { shape: shape },
                });
                document.dispatchEvent(customEvent);

                infoWindow.close();
              });
          });

          // Turn off drawing mode after shape is drawn
          this._drawingManager.setDrawingMode(null);
        }
      );

      this._mapLoaded = true;
      console.log("Google Maps initialized successfully");
    }

    // Proxy methods
    addControl(control) {
      if (this._map && control._control) {
        this._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          control._control
        );
        this._controls.push(control);
      }
      return this;
    }

    setView(center, zoom) {
      if (this._map) {
        this._map.setCenter({ lat: center[0], lng: center[1] });
        this._map.setZoom(zoom);
      }
      return this;
    }

    addLayer(layer) {
      if (this._map && layer._layer) {
        layer._layer.setMap(this._map);
        this._layers.push(layer);
      }
      return this;
    }

    removeLayer(layer) {
      if (this._map && layer._layer) {
        layer._layer.setMap(null);
        const index = this._layers.indexOf(layer);
        if (index > -1) {
          this._layers.splice(index, 1);
        }
      }
      return this;
    }

    fitBounds(bounds) {
      if (this._map) {
        if (bounds._bounds) {
          this._map.fitBounds(bounds._bounds);
        } else if (bounds instanceof google.maps.LatLngBounds) {
          this._map.fitBounds(bounds);
        } else if (Array.isArray(bounds) && bounds.length === 2) {
          // Convert array format [[lat1, lng1], [lat2, lng2]] to Google bounds
          const googleBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(bounds[0][0], bounds[0][1]),
            new google.maps.LatLng(bounds[1][0], bounds[1][1])
          );
          this._map.fitBounds(googleBounds);
        }
      }
      return this;
    }

    invalidateSize() {
      if (this._map) {
        google.maps.event.trigger(this._map, "resize");
      }
      return this;
    }

    eachLayer(callback) {
      if (this._map) {
        this._layers.forEach((layer) => {
          callback(layer);
        });
      }
      return this;
    }

    enableDrawing(type = "circle") {
      if (this._map && this._drawingManager) {
        const drawingMode =
          type === "circle"
            ? google.maps.drawing.OverlayType.CIRCLE
            : google.maps.drawing.OverlayType.POLYGON;
        this._drawingManager.setDrawingMode(drawingMode);
      }
      return this;
    }

    disableDrawing() {
      if (this._map && this._drawingManager) {
        this._drawingManager.setDrawingMode(null);
      }
      return this;
    }

    clearShapes() {
      if (this._currentShape) {
        this._currentShape.setMap(null);
        this._currentShape = null;
      }
      return this;
    }
  }

  // Layer classes
  class TileLayer {
    constructor(url, options) {
      this._url = url;
      this._options = options || {};

      ensureGoogleMaps().then(() => {
        // Google Maps doesn't directly support arbitrary tile layers like Leaflet
        // This is a simplified implementation
        this._layer = { type: "tile", url: url };
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        // In a real implementation, you would add the tile layer to the map
        map._baseLayer = this._layer;
      }
      return this;
    }
  }

  // GeoJSON layer
  class GeoJSON {
    constructor(data, options) {
      this._data = data;
      this._options = options || {};
      this._bounds = null;

      ensureGoogleMaps().then(() => {
        this._layer = new google.maps.Data();

        // Load GeoJSON data
        this._layer.addGeoJson(data);

        // Apply styles
        const style = this._options.style || {};
        this._layer.setStyle({
          fillColor: style.fillColor || "#4285F4",
          fillOpacity: style.fillOpacity || 0.2,
          strokeColor: style.color || "#4285F4",
          strokeWeight: style.weight || 2,
          strokeOpacity: style.opacity || 1.0,
        });

        // Add event listeners
        if (this._options.onEachFeature) {
          this._layer.addListener("click", (event) => {
            const feature = event.feature;
            this._options.onEachFeature(
              feature.getProperty("properties"),
              feature
            );
          });
        }

        // Calculate bounds
        const bounds = new google.maps.LatLngBounds();
        this._layer.forEach((feature) => {
          const geometry = feature.getGeometry();
          if (geometry) {
            geometry.forEachLatLng((latLng) => {
              bounds.extend(latLng);
            });
          }
        });
        this._bounds = bounds;
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.setMap(map._map);
      } else {
        ensureGoogleMaps().then(() => {
          if (map._map) {
            this._layer.setMap(map._map);
          }
        });
      }
      return this;
    }

    getBounds() {
      return this._bounds;
    }

    resetStyle(layer) {
      if (this._layer) {
        // Reset style would need more complex implementation for Google Maps
        console.log("resetStyle is not fully implemented for Google Maps");
      }
      return this;
    }
  }

  // Marker class
  class Marker {
    constructor(latlng, options) {
      this._latlng = latlng;
      this._options = options || {};
      this._popup = null;

      ensureGoogleMaps().then(() => {
        this._layer = new google.maps.Marker({
          position: { lat: latlng[0], lng: latlng[1] },
          title: this._options.title || "",
          icon: this._options.icon ? this._options.icon._icon : null,
          animation: google.maps.Animation.DROP,
        });
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.setMap(map._map);
        map._markers.push(this._layer);
      } else {
        ensureGoogleMaps().then(() => {
          if (map._map) {
            this._layer.setMap(map._map);
            map._markers.push(this._layer);
          }
        });
      }
      return this;
    }

    bindPopup(content) {
      ensureGoogleMaps().then(() => {
        if (this._layer) {
          this._popup = new google.maps.InfoWindow({
            content: content,
          });

          this._layer.addListener("click", () => {
            this._popup.open(this._layer.getMap(), this._layer);
          });
        }
      });
      return this;
    }
  }

  // Circle class
  class Circle {
    constructor(latlng, radius, options) {
      this._latlng = latlng;
      this._radius = radius;
      this._options = options || {};

      ensureGoogleMaps().then(() => {
        this._layer = new google.maps.Circle({
          center: { lat: latlng[0], lng: latlng[1] },
          radius: radius,
          fillColor: this._options.fillColor || "#4285F4",
          fillOpacity: this._options.fillOpacity || 0.2,
          strokeColor: this._options.color || "#4285F4",
          strokeWeight: this._options.weight || 2,
          strokeOpacity: this._options.opacity || 1.0,
          editable: this._options.editable || false,
        });

        this._bounds = this._layer.getBounds();
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.setMap(map._map);
      } else {
        ensureGoogleMaps().then(() => {
          if (map._map) {
            this._layer.setMap(map._map);
          }
        });
      }
      return this;
    }

    getBounds() {
      return this._bounds;
    }
  }

  // Feature Group
  class FeatureGroup {
    constructor(layers) {
      this._layers = layers || [];
      this._bounds = null;

      ensureGoogleMaps().then(() => {
        // Create a bounds object from all layers
        const bounds = new google.maps.LatLngBounds();

        this._layers.forEach((layer) => {
          if (layer._bounds) {
            bounds.union(layer._bounds);
          }
        });

        this._bounds = bounds;
      });
    }

    addTo(map) {
      this._layers.forEach((layer) => {
        layer.addTo(map);
      });
      return this;
    }

    getBounds() {
      return this._bounds;
    }
  }

  // Controls
  class Control {
    static Scale(options) {
      // Create a custom scale control div
      const controlDiv = document.createElement("div");
      controlDiv.className = "map-scale-control";
      controlDiv.innerHTML =
        '<div class="map-scale-line"></div><div class="map-scale-text">100m</div>';

      return {
        _control: controlDiv,
      };
    }
  }

  // Factory functions
  return {
    Map: Map,
    tileLayer: function (url, options) {
      return new TileLayer(url, options);
    },
    marker: function (latlng, options) {
      return new Marker(latlng, options);
    },
    circle: function (latlng, radius, options) {
      return new Circle(latlng, radius, options);
    },
    geoJSON: function (data, options) {
      return new GeoJSON(data, options);
    },
    featureGroup: function (layers) {
      return new FeatureGroup(layers);
    },
    icon: function (options) {
      return {
        _icon: {
          url: options.iconUrl,
          size: new google.maps.Size(options.iconSize[0], options.iconSize[1]),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(
            options.iconAnchor[0],
            options.iconAnchor[1]
          ),
        },
      };
    },
    Control: Control,
    control: {
      layers: function (baseLayers, overlays) {
        // Create a custom layers control div
        const controlDiv = document.createElement("div");
        controlDiv.className = "map-layers-control";

        // Google Maps has built-in layers control, so this is simplified
        return {
          _control: controlDiv,
          addTo: function (map) {
            if (map._map) {
              map._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
                controlDiv
              );
            }
            return this;
          },
        };
      },
    },
  };
})();
