import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WeatherForm({ lat, lng }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (lat && lng) {
      axios
        .get(`http://localhost:5050/weather?lat=${lat}&lng=${lng}`)
        .then((res) => setWeather(res.data))
        .catch((err) => console.error('Weather error:', err));
    }
  }, [lat, lng]);

  if (!lat || !lng) return null;
  if (!weather) return <p style={{ textAlign: 'center' }}>Loading weather...</p>;

  return (
    <div style={{ marginTop: '10px' }}>
      <p><strong>🌡 Temp:</strong> {weather.temp}°C</p>
      <p><strong>Condition:</strong> {weather.description}</p>
      <p><strong>📍 Location:</strong> {weather.city}, {weather.country}</p>
    </div>
  );
}

export default WeatherForm;
