const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function getWeatherByCity(city) {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: `${city},IL`,
      appid: process.env.OPENWEATHER_API_KEY,
      units: 'metric',
    },
  });

  return formatWeather(data);
}

async function getForecastByCity(city) {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: `${city},IL`,
      appid: process.env.OPENWEATHER_API_KEY,
      units: 'metric',
      cnt: 24, // 3-day forecast (8 entries per day)
    },
  });

  return {
    city: data.city.name,
    country: data.city.country,
    forecast: data.list.map((entry) => ({
      datetime: entry.dt_txt,
      temperature: entry.main.temp,
      feels_like: entry.main.feels_like,
      humidity: entry.main.humidity,
      description: entry.weather[0].description,
      wind_speed: entry.wind.speed,
    })),
  };
}

function formatWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feels_like: data.main.feels_like,
    min_temp: data.main.temp_min,
    max_temp: data.main.temp_max,
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    wind_speed: data.wind.speed,
    wind_direction: data.wind.deg,
    visibility: data.visibility,
    sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(data.sys.sunset * 1000).toISOString(),
  };
}

module.exports = { getWeatherByCity, getForecastByCity };
