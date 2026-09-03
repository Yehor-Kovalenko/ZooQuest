import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import mapImage from '@/assets/map.png'
import 'leaflet/dist/leaflet.css';
import './MapPanel.css';
import { createGeoTransformer, type ControlPoint } from '@/service/geoTransformation';
import { ANIMALS_LIST } from '@/service/animals';

const MapPanel = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [gps, setGps] = useState({ status: 'acquiring', text: 'Acquiring GPS...' });
  // transformation
  const CONTROL_POINTS: ControlPoint[] = [
    { geo: { lat: 51.76386584534988, lng: 19.4121958155657 }, pixel: { x: 1760, y: 844 } },
    { geo: { lat: 51.75806095862723, lng: 19.414548850264428 }, pixel: { x: 0, y: 240 } },
    { geo: { lat: 51.7627856307115, lng: 19.411977556925986 }, pixel: { x: 1490, y: 590 } },
    { geo: { lat: 51.76206546134231, lng: 19.41036415746298 }, pixel: { x: 1470, y: 230 } },
  ];

  const geoTransformer = createGeoTransformer(CONTROL_POINTS);

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
      // ANIMALS LAYER
      // --------------------------------
      const animalLayer = L.featureGroup().addTo(map);

      ANIMALS_LIST.forEach((animalInfo) => {
        // 1. Transform real-world GPS to pixel coordinates
        const { x, y } = geoTransformer.gpsToPixel({ 
          lat: animalInfo.lat, 
          lng: animalInfo.lng 
        });
        
        // 2. Flip the Y axis against the image height (just like your GPS)
        const imgLatLng = L.latLng(height - y, x);

        // 3. Create the marker on the map and add a popup
        L.marker(imgLatLng)
          .addTo(animalLayer)
          .bindPopup(`<strong style="text-transform: capitalize;">${animalInfo.animal}</strong>`);
      });
      // --------------------------------
      // GPS
      // --------------------------------

      let userMarker: L.Marker | null = null;
      let accuracyCircle: L.Circle | null = null;

      const onLocationFound = (e: L.LocationEvent) => {
        const { lat, lng } = e.latlng;
        const { x, y } = geoTransformer.gpsToPixel({lat, lng});
        const imgLatLng = L.latLng(height - y, x); // flip y against image height

        // scale accuracy circle radius from meters to pixels
        const radiusPx = geoTransformer.accuracyRadiusPx(e.accuracy);
        console.log(geoTransformer._getControlPointErrors(CONTROL_POINTS), geoTransformer._getRmsError(CONTROL_POINTS));

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