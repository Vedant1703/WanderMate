import React from 'react';
import WeatherForm from './WeatherForm';


function TravelSummaryCard({ travelInfo, lat, lng }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '400px',
      margin: '30px auto',
      textAlign: 'left',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2>📌 Trip Summary</h2>
      <p><strong>Distance:</strong> {travelInfo.distance}</p>
      <p><strong>Duration:</strong> {travelInfo.duration}</p>

      {/* Weather here */}
      <WeatherForm lat={lat} lng={lng} />
    </div>
  );
}

export default TravelSummaryCard;
