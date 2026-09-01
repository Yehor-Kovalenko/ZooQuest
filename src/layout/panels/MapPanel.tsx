import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import mapImage from '@/assets/map.png'
import 'leaflet/dist/leaflet.css';
import './MapPanel.css';
import { computeAffineTransform, gpsToPixel, metersPerDegreeLng, type ControlPoint } from '@/service/geoTransformation';

const MapPanel = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [gps, setGps] = useState({ status: 'acquiring', text: 'Acquiring GPS...' });
  // transformation
  const CONTROL_POINTS: [ControlPoint, ControlPoint, ControlPoint] = [
    { geo: { lat: 51.75116105683058, lng: 19.436786676250716 }, pixel: { x: 0, y: 0 } },
    { geo: { lat: 51.744968125338296, lng: 19.461429908793267 }, pixel: { x: 1802, y: 882 } },
    { geo: { lat: 51.7483180437013, lng: 19.45106338292666 }, pixel: { x: 901, y: 441 } },
  ];

  const affineTransform = computeAffineTransform(CONTROL_POINTS);

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
        minZoom: -3,
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
        opacity: 1.0,
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
        const { lat, lng } = e.latlng;
        const { x, y } = gpsToPixel(affineTransform, lat, lng);
        const imgLatLng = L.latLng(y, x); // remember: latlng = [pixelY, pixelX]

        // scale accuracy circle radius from meters to pixels
        const pixelsPerMeterX = Math.hypot(affineTransform.a, affineTransform.d) / metersPerDegreeLng(lat);
        const radiusPx = (e.accuracy / 2) * pixelsPerMeterX; // rough approximation, see note below

        if (!userMarker || !accuracyCircle) {
          userMarker = L.marker(imgLatLng).addTo(map).bindPopup("You are here");
          accuracyCircle = L.circle(imgLatLng, radiusPx).addTo(map);
        } else {
          userMarker.setLatLng(imgLatLng);
          accuracyCircle.setLatLng(imgLatLng);
          accuracyCircle.setRadius(radiusPx);
        }
        setGps({ status: 'active', text: `GPS Active (±${Math.round(e.accuracy)}m)` });
        //setGpsStatus(`Live GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} (±${Math.round(e.accuracy)}m)`);
      };

      const onLocationError = (e: L.ErrorEvent) => {
       setGps({ status: 'error', text: `GPS Error: ${e.message}` });
      };

      map.on("locationfound", onLocationFound);
      map.on("locationerror", onLocationError);

      map.locate({
        watch: true,
        enableHighAccuracy: true,
      });
    };

    img.onerror = () => {
      setGps({ status: 'error', text: "Failed to load map image." });
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
      <div className={`gps-indicator gps-${gps.status}`}>
  <div className="gps-dot"></div>
  <span className="gps-text">{gps.text}</span>
</div>
      
      <div ref={mapRef} className='mapContainer' />
    </div>
  );
};

export default MapPanel;