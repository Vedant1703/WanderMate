// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
//  require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🌍 WanderMate API is running');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

app.get('/weather', async (req, res) => {
  const { lat, lng, city } = req.query;

  let url;

  if (lat && lng) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}`;
  } else if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`;
  } else {
    return res.status(400).json({ error: 'City or coordinates required' });
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    const weather = {
      temp: Math.round(data.main.temp - 273.15),
      description: data.weather[0].description,
      city: data.name,
      country: data.sys.country
    };
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});



// const express = require('express');
// const axios = require('axios');




// app.use(require('cors')());
// app.use(express.json());

app.get('/places', async (req, res) => {
  const { lat, lng, type = 'restaurant' } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000, // in meters (2km)
          type, // place type: restaurant, lodging, atm, etc.
          key: apiKey,
        },
      }
    );
    console.log("Places response:", response.data);

    res.json(response.data.results);
  } catch (err) {
    console.error('Error fetching places:', err);
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
