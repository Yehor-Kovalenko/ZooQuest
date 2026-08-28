import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import mapImage from '@/assets/map.png'
import 'leaflet/dist/leaflet.css';
import './MapPanel.css';

const MapPanel = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [gpsStatus, setGpsStatus] = useState('Acquiring GPS location...');

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const img = new Image();
    // dynamically load the image and know its resolution
    img.onload = () => {
      if (!mapRef.current || leafletMapRef.current) return;

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const map = L.map(mapRef.current, {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 5,
      });

      leafletMapRef.current = map;

      // Image coordinates:
      // top-left     = [0, 0]
      // bottom-right = [height, width]
      const bounds: L.LatLngBoundsExpression = [
        [0, 0],
        [height, width],
      ];

      // Keep the user inside the image
      map.setMaxBounds(bounds);
      map.options.maxBoundsViscosity = 1.0;

      // Add the PNG
      L.imageOverlay(mapImage, bounds, {
        opacity: 0.85,
        interactive: true,
      }).addTo(map);

      // Fit image to viewport
      map.fitBounds(bounds);

      // --------------------------------
      // GPS
      // --------------------------------

      let userMarker: L.Marker | null = null;
      let accuracyCircle: L.Circle | null = null;

      const onLocationFound = (e: L.LocationEvent) => {
        const radius = e.accuracy / 2;
        const latlng = e.latlng;

        if (!userMarker || !accuracyCircle) {
          userMarker = L.marker(latlng)
            .addTo(map)
            .bindPopup("You are here");

          accuracyCircle = L.circle(latlng, radius).addTo(map);
        } else {
          userMarker.setLatLng(latlng);
          accuracyCircle.setLatLng(latlng);
          accuracyCircle.setRadius(radius);
        }

        setGpsStatus(
          `Live GPS: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(
            5
          )} (±${Math.round(radius)}m)`
        );
      };

      const onLocationError = (e: L.ErrorEvent) => {
        setGpsStatus(`GPS Error: ${e.message}`);
      };

      map.on("locationfound", onLocationFound);
      map.on("locationerror", onLocationError);

      map.locate({
        watch: true,
        enableHighAccuracy: true,
      });
    };

    img.onerror = () => {
      setGpsStatus("Failed to load map image.");
    };

    img.src = mapImage;

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div id="map-panel">
      <div className="progress-row">
        <strong>Your route</strong>
        <span id="progress-text">0 / 0 stamped</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" id="progress-fill"></div>
      </div>

      {/* Map Container */}
      <div className='gpsStatus' style={{color: gpsStatus.includes('Error') ? 'red' : 'black'}}>
        {gpsStatus}
      </div>
      
      <div ref={mapRef} className='mapContainer' />
    </div>
  );
};

export default MapPanel;