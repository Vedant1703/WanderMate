// src/components/AutocompleteInput.jsx
import React, { useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
});

export default function AutocompleteInput({ placeholder, onPlaceSelected }) {
  const inputRef = useRef();

  useEffect(() => {
    let autocomplete;
    loader.load().then(() => {
      if (!inputRef.current) return;
      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'formatted_address', 'name'],
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          onPlaceSelected({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.formatted_address || place.name,
          });
        }
      });
    });
    return () => {
      if (autocomplete) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      style={{
        width: '250px',
        height: '38px',
        padding: '0 8px',
        fontSize: '16px',
        borderRadius: '6px',
        border: '1px solid #ccc',
      }}
    />
  );
}
