import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NearbyPlaces({ lat, lng, type }) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!lat || !lng) return;

    axios
      .get(`http://localhost:5050/places?lat=${lat}&lng=${lng}&type=${type}`)
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error('Error fetching places:', err));
  }, [lat, lng, type]);

  return (
    <div style={{ marginTop: '40px', textAlign: 'center' }}>
      <h2>Nearby {type.charAt(0).toUpperCase() + type.slice(1)}s</h2>
      {places.length === 0 && <p>No places found nearby.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {places.map((place, idx) => (
          <li key={idx} style={{ margin: '10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <strong>{place.name}</strong> <br />
            Rating: {place.rating || 'N/A'} ⭐ <br />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#007BFF', textDecoration: 'none' }}
            >
              View on Map 📍
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NearbyPlaces;
