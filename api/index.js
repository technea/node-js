require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();

app.use(cors());
app.use(express.json());

const path = require('path');

// Serve static files (HTML, CSS, JS) from the root directory
app.use(express.static(path.join(__dirname, '../')));

// API Route
app.get('/api/weather', (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  https.get(url, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        const weather = JSON.parse(data);
        if (weather.cod !== 200) {
          return res.status(weather.cod).json({ error: weather.message });
        }
        res.json({
          city: weather.name,
          temp: Math.round(weather.main.temp),
          description: weather.weather[0].description,
          icon: weather.weather[0].icon,
          humidity: weather.main.humidity,
          windSpeed: weather.wind.speed,
          feelsLike: Math.round(weather.main.feels_like),
          country: weather.sys.country
        });
      } catch {
        res.status(500).json({ error: 'Parsing error' });
      }
    });
  }).on('error', () => {
    res.status(500).json({ error: 'Fetch failed' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;