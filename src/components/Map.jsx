// src/components/Map.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import AutocompleteInput from './AutocompleteInput';

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
});

export default function Map({ onDestinationChange, onRouteInfo }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);

  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  // Load map once
  useEffect(() => {
    loader.load().then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.01295648456926, lng: 76.04075221010982 },
        zoom: 10,
      });
      mapInstanceRef.current = map;
    });
  }, []);

  // Place or move source marker
  useEffect(() => {
    if (source && mapInstanceRef.current) {
      const pos = { lat: Number(source.lat), lng: Number(source.lng) };
      if (!sourceMarkerRef.current) {
        sourceMarkerRef.current = new window.google.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
          title: source.name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          animation: window.google.maps.Animation.DROP,
        });
      } else {
        sourceMarkerRef.current.setPosition(pos);
      }
    }
  }, [source]);

  // Place or move destination marker
  useEffect(() => {
    if (destination && mapInstanceRef.current) {
      const pos = { lat: Number(destination.lat), lng: Number(destination.lng) };
      if (!destMarkerRef.current) {
        destMarkerRef.current = new window.google.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
          title: destination.name,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          animation: window.google.maps.Animation.DROP,
        });
      } else {
        destMarkerRef.current.setPosition(pos);
      }
    }
  }, [destination]);

  // Compute & render route
  const handleRoute = () => {
    if (!source || !destination) return alert('Please select both source & destination');

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: Number(source.lat), lng: Number(source.lng) },
        destination: { lat: Number(destination.lat), lng: Number(destination.lng) },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (res, status) => {
        if (status === 'OK' && mapInstanceRef.current) {
          if (!directionsRendererRef.current) {
            directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
              map: mapInstanceRef.current,
              preserveViewport: true,
            });
          }
          directionsRendererRef.current.setDirections(res);

          const leg = res.routes[0].legs[0];
          onRouteInfo({ distance: leg.distance.text, duration: leg.duration.text });
          onDestinationChange({ lat: leg.end_location.lat(), lng: leg.end_location.lng() });

          const bounds = new window.google.maps.LatLngBounds();
          res.routes[0].overview_path.forEach(pt => bounds.extend(pt));
          mapInstanceRef.current.fitBounds(bounds);
        } else {
          alert('Could not find route');
        }
      }
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Plan Your Route</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <AutocompleteInput placeholder="Enter Source" onPlaceSelected={setSource} />
        <AutocompleteInput placeholder="Enter Destination" onPlaceSelected={setDestination} />
        <button onClick={handleRoute} style={{ padding: '8px 16px' }}>Show Route</button>
      </div>

      <div ref={mapRef} style={{ width: '100%', height: '500px', margin: '0 auto', borderRadius: '8px' }} />
    </div>
  );
}
