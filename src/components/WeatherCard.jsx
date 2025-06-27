import React from 'react';

function WeatherCard({ weather }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <h2>{weather.location}</h2>
      <img src={weather.icon} alt={weather.description} />
      <p style={{ fontSize: '20px' }}>{weather.temperature}°C</p>
      <p>{weather.description}</p>
    </div>
  );
}

export default WeatherCard;
