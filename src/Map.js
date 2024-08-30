import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

function Map({ onLocationSelect }) {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    fetch('/api/locations')
      .then(response => response.json())
      .then(data => {
        setLocations(data);
        data.forEach(location => {
          L.marker([location.latitude, location.longitude])
            .addTo(mapRef.current)
            .bindPopup(location.location)
            .on('click', () => onLocationSelect(location.latitude, location.longitude));
        });
        
        // Fit the map to show all markers
        const bounds = L.latLngBounds(data.map(loc => [loc.latitude, loc.longitude]));
        mapRef.current.fitBounds(bounds);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, [onLocationSelect]);

  return <div id="map" style={{ width: '70%', height: '100%' }}></div>;
}

export default Map;