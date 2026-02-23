const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html at root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.post('/weather', (req, res) => {  
  const city = req.body.city
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6160f20febb47fb50bf134c7613cfbaa&units=metric`

  https.get(url, (response) => {
    let dataChunks = '';

    response.on('data', (chunk) => {
      dataChunks += chunk;
    });

    response.on('end', () => {
      try {
        const weatherData = JSON.parse(dataChunks);

        if (weatherData.cod !== 200) {
          return res.status(404).send(`<h1>City not found: ${city}</h1>`);
        }

        const temp = weatherData.main.temp;
        const weatherDes = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.send(`
          <h1>Temperature in ${city}: ${temp}°C</h1>
          <h2>Weather: ${weatherDes}</h2>
          <img src="${iconUrl}" alt="Weather Icon">
        `);
      } catch {
        res.status(500).send('<h1>Error parsing weather data</h1>');
      }
    });
  }).on('error', () => {
    res.status(500).send('<h1>Unable to fetch weather data</h1>');
  });
});

app.listen(3000, () => {
  console.log('Server is listening on PORT 3000');
});