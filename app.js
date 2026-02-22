const express = require('express');
const https = require('https');
const app = express();

app.get('/', (req, res) => {
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=6160f20febb47fb50bf134c7613cfbaa&units=metric';
  
  https.get(url, (response) => {
    let dataChunks = '';

    response.on('data', (chunk) => {
      dataChunks += chunk;
    });

    response.on('end', () => {
      const weatherData = JSON.parse(dataChunks);
      const temp = weatherData.main.temp;
      const weatherDes = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.send(`
        <h1>Temperature in Lahore: ${temp}°C</h1>
        <h2>Weather: ${weatherDes}</h2>
        <img src="${iconUrl}" alt="Weather Icon">
      `);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is listening on PORT 3000')
})