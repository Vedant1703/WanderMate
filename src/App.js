import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherForm from './components/WeatherForm';
import WeatherCard from './components/WeatherCard';
import Map from './components/Map';
import NearbyPlaces from './components/NearbyPlaces';
import TravelSummaryCard from './components/TravelSummaryCard';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const [destination, setDestination] = useState({ lat: null, lng: null });
const [travelInfo, setTravelInfo] = useState({ distance: '', duration: '' });
const [placeType, setPlaceType] = useState('lodging');
  const placeOptions = [
    { label: 'Hotels', value: 'lodging' },
    { label: 'Restaurants', value: 'restaurant' },
    { label: 'ATMs', value: 'atm' },
    { label: 'Cafes', value: 'cafe' },
    { label: 'Hospitals', value: 'hospital' },
    { label: 'Tourist Attractions', value: 'tourist_attraction' },
    { label: 'Train Stations', value: 'train_station' },
  ];
  const [source, setSource] = useState(null);




  // 🔐 Replace this with your actual Maps key
  const getWeather = async () => {
    if (!city) {
      setError('Please enter a city');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5050/weather?city=${city}`);
      setWeather(res.data);
      setError('');
    } catch (err) {
      setWeather(null);
      setError('City not found or API failed');
    }
  };
useEffect(() => {
  if (source && destination) {
    // draw route on map
    axios.get(`http://localhost:5050/route?srcLat=${source.lat}&srcLng=${source.lng}&dstLat=${destination.lat}&dstLng=${destination.lng}`)
      .then(res => setTravelInfo(res.data))
      .catch(err => console.error(err));

    // fetch weather for destination
    axios.get(`http://localhost:5050/weather?lat=${destination.lat}&lng=${destination.lng}`)
      .then(res => setWeather(res.data))
      .catch(err => console.error('Weather error:', err));
  }
}, [source, destination]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
     <h1>🌍 WanderMate</h1>



      {/* Map */}
<Map
  apiKey={apiKey}
  onDestinationChange={setDestination}
  onRouteInfo={setTravelInfo}
/>

<TravelSummaryCard
  travelInfo={travelInfo}
  lat={destination.lat}
  lng={destination.lng}
/>

 
      // Dropdown for selecting place type 
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="place-type">Find Nearby: </label>
        <select
          id="place-type"
          value={placeType}
          onChange={(e) => setPlaceType(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          {placeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div> 
{destination.lat && destination.lng && (
  <NearbyPlaces lat={destination.lat} lng={destination.lng} type={placeType} />
)}
      {/* Nearby Places
      {destination.lat && destination.lng && (
  <NearbyPlaces lat={destination.lat} lng={destination.lng} type={placeType} />
)} */}

    </div>
    
  );
}

export default App;
