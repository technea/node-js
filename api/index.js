import express from 'express'
import https from 'https'

const app = express()

app.get('/api/weather', (req, res) => {  // <-- /api/weather
  const city = req.query.city
  if (!city) return res.status(400).json({ error: 'City is required' })

  const apiKey = process.env.OPENWEATHER_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

  https.get(url, (response) => {
    let data = ''
    response.on('data', chunk => data += chunk)
    response.on('end', () => {
      const weather = JSON.parse(data)

      if (weather.cod !== 200) return res.status(404).json({ error: weather.message })

      res.json({
        city: weather.name,
        temp: Math.round(weather.main.temp),
        description: weather.weather[0].description,
        icon: weather.weather[0].icon,
        humidity: weather.main.humidity,
        windSpeed: weather.wind.speed,
        feelsLike: Math.round(weather.main.feels_like),
        country: weather.sys.country
      })
    })
  }).on('error', () => res.status(500).json({ error: 'Unable to fetch weather data' }))
})

export default app