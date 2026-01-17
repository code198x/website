// Load Leaflet CSS
const leafletCss = document.createElement('link');
leafletCss.rel = 'stylesheet';
leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(leafletCss);

// Load MarkerCluster CSS
const clusterCss = document.createElement('link');
clusterCss.rel = 'stylesheet';
clusterCss.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
document.head.appendChild(clusterCss);

const clusterDefaultCss = document.createElement('link');
clusterDefaultCss.rel = 'stylesheet';
clusterDefaultCss.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
document.head.appendChild(clusterDefaultCss);

// Load Leaflet JS
const leafletScript = document.createElement('script');
leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
leafletScript.onload = () => {
  // Load MarkerCluster plugin after Leaflet
  const clusterScript = document.createElement('script');
  clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
  clusterScript.onload = () => {
    initMap();
  };
  document.head.appendChild(clusterScript);
};
document.head.appendChild(leafletScript);

function initMap() {
  const L = window.L;
  const dataEl = document.getElementById('manufacturer-data');
  if (!dataEl) return; // Data element not found
  const manufacturerData = JSON.parse(dataEl.dataset.manufacturers);

  // Detect dark mode
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Tile layers - dark and light versions
  const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
  const lightTiles = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

  const map = L.map('manufacturer-map', {
    center: [30, 0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 8,
    scrollWheelZoom: true,
    attributionControl: false
  });

  let tileLayer = L.tileLayer(isDark ? darkTiles : lightTiles, {
    maxZoom: 19
  }).addTo(map);

  // Listen for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        const newIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
        tileLayer.setUrl(newIsDark ? darkTiles : lightTiles);
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });

  // Create marker cluster group
  const markers = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      const size = Math.min(50, 30 + count * 2);
      return L.divIcon({
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(135deg, #4a9eff 0%, #7b68ee 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size > 40 ? '14px' : '12px'};
          font-family: system-ui, sans-serif;
        ">${count}</div>`,
        className: 'manufacturer-cluster',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });
    }
  });

  // Add markers for each manufacturer
  manufacturerData.forEach(m => {
    const size = Math.min(20, 10 + m.platformCount * 2);

    const icon = L.divIcon({
      className: 'manufacturer-marker',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background: ${m.color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        pointer-events: none;
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });

    const platformLinks = m.platforms.map(p =>
      p.url
        ? `<a href="${p.url}" style="color: ${p.color}; text-decoration: none; font-weight: 500;">${p.name}</a>`
        : `<span style="color: #888;">${p.name}</span>`
    ).join(' · ');

    const popup = `
      <div style="font-family: system-ui, sans-serif; min-width: 150px;">
        <strong style="font-size: 1.1em; color: ${m.color};">${m.shortName}</strong>
        <div style="color: #666; font-size: 0.85em; margin: 4px 0;">${m.city}, ${m.country}</div>
        <div style="margin-top: 8px; font-size: 0.9em;">${platformLinks}</div>
        ${m.platformCount > 6 ? `<div style="color: #888; font-size: 0.8em; margin-top: 4px;">+${m.platformCount - 6} more</div>` : ''}
      </div>
    `;

    const marker = L.marker([m.lat, m.lng], { icon }).bindPopup(popup);
    markers.addLayer(marker);
  });

  map.addLayer(markers);

  // Store map reference for external access (e.g., tab switching)
  document.getElementById('manufacturer-map')._leafletMap = map;
}
