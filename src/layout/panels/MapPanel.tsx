import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import mapImage from '@/assets/map.png'
import 'leaflet/dist/leaflet.css';
import './MapPanel.css'; // Add any additional styling here

const MapPanel = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [gpsStatus, setGpsStatus] = useState('Acquiring GPS location...');

  useEffect(() => {
    if (!mapRef.current) return;

    // 1. Map Initialization
    const map = L.map(mapRef.current, {
      minZoom: 15,
      maxZoom: 19,
    });

    // 2. Bounds Setup
    const southWest = L.latLng(51.7565, 19.4050);
    const northEast = L.latLng(51.7645, 19.4180);
    const bounds = L.latLngBounds(southWest, northEast);
    
    map.setMaxBounds(bounds);
    map.options.maxBoundsViscosity = 1.0;
    map.fitBounds(bounds);

    // 3. Image Overlay (ensure map.jpg is in your public folder)
    L.imageOverlay(mapImage, bounds, {
      opacity: 0.85,
      interactive: true,
    }).addTo(map);

    // 4. GPS Tracking Logic
    let userMarker: L.Marker | null = null;
    let accuracyCircle: L.Circle | null = null;

    const onLocationFound = (e: L.LocationEvent) => {
      const radius = e.accuracy / 2;
      const latlng = e.latlng;

      if (!userMarker || !accuracyCircle) {
        userMarker = L.marker(latlng).addTo(map).bindPopup('You are here');
        accuracyCircle = L.circle(latlng, radius).addTo(map);
      } else {
        userMarker.setLatLng(latlng);
        accuracyCircle.setLatLng(latlng);
        accuracyCircle.setRadius(radius);
      }

      setGpsStatus(
        `Live GPS: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)} (±${Math.round(radius)}m)`
      );
    };

    const onLocationError = (e: L.ErrorEvent) => {
      setGpsStatus(`GPS Error: ${e.message}`);
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({ watch: true, enableHighAccuracy: true });

    // Cleanup function to destroy map instance when component unmounts
    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
      map.remove();
    };
  }, []);

  return (
    <div id="map-panel">

      {/* Existing UI */}
      <div className="progress-row">
        <strong>Your route</strong>
        <span id="progress-text">0 / 0 stamped</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" id="progress-fill"></div>
      </div>

      <div className="trail-wrap">
        {/* Map Container */}
      <div style={{ position: 'relative', height: '400px', width: '100%', marginBottom: '20px' }}>
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            fontSize: '14px',
            color: gpsStatus.includes('Error') ? 'red' : 'black'
          }}
        >
          {gpsStatus}
        </div>
        <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: '8px' }} />
      </div>
      </div>

      <div id="zone-list"></div>

      
    </div>
  );
};

export default MapPanel;