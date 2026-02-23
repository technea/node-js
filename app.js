require('dotenv').config();
const express = require('express');
const https = require('https');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' folder

// API Route for weather
app.get('/api/weather', (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  https.get(url, (response) => {
    let dataChunks = '';

    response.on('data', (chunk) => {
      dataChunks += chunk;
    });

    response.on('end', () => {
      try {
        const weatherData = JSON.parse(dataChunks);

        if (weatherData.cod !== 200) {
          return res.status(weatherData.cod).json({
            error: weatherData.message || 'City not found'
          });
        }

        // Return structured JSON
        res.json({
          city: weatherData.name,
          temp: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind.speed,
          feelsLike: Math.round(weatherData.main.feels_like),
          country: weatherData.sys.country
        });
      } catch (error) {
        res.status(500).json({ error: 'Error parsing weather data' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Unable to fetch weather data' });
  });
});

// Static file serving is handled by middleware above

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});