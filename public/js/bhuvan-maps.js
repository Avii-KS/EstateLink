/**
 * BhuvanMaps polyfill using Leaflet.js
 *
 * This is a compatibility layer that implements the BhuvanMaps interface
 * using Leaflet.js as the underlying mapping library
 */

// Create the BhuvanMaps namespace
window.BhuvanMaps = (function () {
  // Ensure Leaflet is loaded
  if (typeof L === "undefined") {
    // Add Leaflet CSS
    const leafletCss = document.createElement("link");
    leafletCss.rel = "stylesheet";
    leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    leafletCss.integrity =
      "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    leafletCss.crossOrigin = "";
    document.head.appendChild(leafletCss);

    // Add Leaflet JS
    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    leafletScript.integrity =
      "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    leafletScript.crossOrigin = "";
    document.head.appendChild(leafletScript);

    console.log("Leaflet loaded as a fallback for BhuvanMaps");
  }

  // Wait for Leaflet to load
  function ensureLeaflet() {
    return new Promise((resolve) => {
      if (typeof L !== "undefined") {
        resolve();
      } else {
        const checkInterval = setInterval(() => {
          if (typeof L !== "undefined") {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      }
    });
  }

  // Map class - wrapper for Leaflet map
  class Map {
    constructor(containerId, options) {
      this._containerId = containerId;
      this._options = options;
      this._layers = [];
      this._baseLayer = null;

      // Initialize the map
      this._initMap();
    }

    async _initMap() {
      await ensureLeaflet();

      // Create the map
      this._map = L.map(this._containerId, {
        center: this._options.center || [20.5937, 78.9629],
        zoom: this._options.zoom || 5,
        maxZoom: this._options.maxZoom || 18,
        minZoom: this._options.minZoom || 4,
        attributionControl: this._options.attributionControl !== false,
      });

      // Add OpenStreetMap as the default layer
      this._baseLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(this._map);

      console.log("Map initialized with Leaflet as fallback for BhuvanMaps");
    }

    // Proxy methods to Leaflet
    addControl(control) {
      if (this._map) {
        this._map.addControl(control._control);
      }
      return this;
    }

    setView(center, zoom) {
      if (this._map) {
        this._map.setView(center, zoom);
      }
      return this;
    }

    addLayer(layer) {
      if (this._map && layer._layer) {
        this._map.addLayer(layer._layer);
        this._layers.push(layer);
      }
      return this;
    }

    removeLayer(layer) {
      if (this._map && layer._layer) {
        this._map.removeLayer(layer._layer);
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
        } else {
          this._map.fitBounds(bounds);
        }
      }
      return this;
    }

    invalidateSize() {
      if (this._map) {
        this._map.invalidateSize();
      }
      return this;
    }

    eachLayer(callback) {
      if (this._map) {
        this._map.eachLayer((layer) => {
          callback(layer);
        });
      }
      return this;
    }
  }

  // Layer classes
  class TileLayer {
    constructor(url, options) {
      this._url = url;
      this._options = options || {};

      ensureLeaflet().then(() => {
        this._layer = L.tileLayer(url, this._options);
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.addTo(map._map);
      } else {
        ensureLeaflet().then(() => {
          this._layer.addTo(map._map);
        });
      }
      return this;
    }
  }

  // GeoJSON layer
  class GeoJSON {
    constructor(data, options) {
      this._data = data;
      this._options = options || {};

      ensureLeaflet().then(() => {
        this._layer = L.geoJSON(data, this._options);
        this._bounds = this._layer.getBounds();
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.addTo(map._map);
      } else {
        ensureLeaflet().then(() => {
          if (map._map) {
            this._layer.addTo(map._map);
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
        this._layer.resetStyle(layer);
      }
      return this;
    }
  }

  // Marker class
  class Marker {
    constructor(latlng, options) {
      this._latlng = latlng;
      this._options = options || {};

      ensureLeaflet().then(() => {
        this._layer = L.marker(latlng, this._options);
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.addTo(map._map);
      } else {
        ensureLeaflet().then(() => {
          if (map._map) {
            this._layer.addTo(map._map);
          }
        });
      }
      return this;
    }

    bindPopup(content) {
      ensureLeaflet().then(() => {
        if (this._layer) {
          this._layer.bindPopup(content);
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

      ensureLeaflet().then(() => {
        this._layer = L.circle(latlng, radius, this._options);
        this._bounds = this._layer.getBounds();
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.addTo(map._map);
      } else {
        ensureLeaflet().then(() => {
          if (map._map) {
            this._layer.addTo(map._map);
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

      ensureLeaflet().then(() => {
        const leafletLayers = this._layers
          .map((layer) => layer._layer)
          .filter(Boolean);
        this._layer = L.featureGroup(leafletLayers);
        this._bounds = this._layer.getBounds();
      });
    }

    addTo(map) {
      if (map._map && this._layer) {
        this._layer.addTo(map._map);
      } else {
        ensureLeaflet().then(() => {
          if (map._map) {
            this._layer.addTo(map._map);
          }
        });
      }
      return this;
    }

    getBounds() {
      return this._bounds;
    }
  }

  // Controls
  class Control {
    static Scale(options) {
      return {
        _control: L.control.scale(options),
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
        _icon: L.icon(options),
      };
    },
    Control: Control,
    control: {
      layers: function (baseLayers, overlays) {
        const baseLayersObj = {};
        const overlaysObj = {};

        if (baseLayers) {
          Object.keys(baseLayers).forEach((key) => {
            baseLayersObj[key] = baseLayers[key]._layer;
          });
        }

        if (overlays) {
          Object.keys(overlays).forEach((key) => {
            overlaysObj[key] = overlays[key]._layer;
          });
        }

        return {
          _control: L.control.layers(baseLayersObj, overlaysObj),
          addTo: function (map) {
            if (map._map) {
              this._control.addTo(map._map);
            }
            return this;
          },
        };
      },
    },
  };
})();
