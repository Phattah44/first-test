const express = require('express');
const requestIp = require('request-ip');
const axios = require('axios');

const app = express();
const PORT = 5000;
const ip = require('ip');

const GEO_API_KEY = 'a29bf3ce9963438ea4ee5f6ed925feec';
const WEATHER_API_KEY = 'c0767b72705744eccca01cd952b87d61';

app.use(requestIp.mw());

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Anonymous';
  const clientIP = req.clientIp;

  let location = 'Unknown';
  let temperature = 'NA';

  try {
    const locationResponse = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_API_KEY}&ip=${clientIP}`
    );
    location = locationResponse.data?.city || 'NA';
  } catch (error) {
    console.error('Error fetching location: ', error);
  }

  if (location !== 'Unknown' && location !== 'NA') {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}`
      );
      temperature = weatherResponse.data?.main?.temp - 273.15;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  const response = {
    client_ip: clientIP,
    location: location,
    greetings: `Hello ${visitorName}! Welcome, the temperature is ${temperature} degree Celsius in your city ${location}.`,
  };
  res.json(response);
});
