const express = require('express');
const { getWeatherByCity, getForecastByCity } = require('./weatherService');
const ISRAELI_CITIES = require('./cities');

const router = express.Router();

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: List all supported Israeli cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: Array of city names
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CitiesList'
 */
router.get('/cities', (req, res) => {
  res.json({ cities: ISRAELI_CITIES });
});

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Current weather for all major Israeli cities
 *     tags: [Weather]
 *     responses:
 *       200:
 *         description: Weather data for all cities
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllCitiesWeather'
 *       500:
 *         description: Failed to fetch weather data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/weather', async (req, res) => {
  try {
    const results = await Promise.allSettled(
      ISRAELI_CITIES.map((city) => getWeatherByCity(city))
    );

    const weather = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    res.json({ count: weather.length, cities: weather });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

/**
 * @swagger
 * /weather/{city}:
 *   get:
 *     summary: Current weather for a specific city
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name (e.g. Jerusalem, Tel Aviv, Haifa)
 *         example: Jerusalem
 *     responses:
 *       200:
 *         description: Current weather data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       404:
 *         description: City not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch weather data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/weather/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const weather = await getWeatherByCity(city);
    res.json(weather);
  } catch (err) {
    handleError(err, res, city);
  }
});

/**
 * @swagger
 * /weather/{city}/forecast:
 *   get:
 *     summary: 3-day forecast for a specific city
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name (e.g. Jerusalem, Tel Aviv, Haifa)
 *         example: Tel Aviv
 *     responses:
 *       200:
 *         description: 3-day forecast data (8 entries per day, every 3 hours)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forecast'
 *       404:
 *         description: City not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch forecast data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/weather/:city/forecast', async (req, res) => {
  const { city } = req.params;
  try {
    const forecast = await getForecastByCity(city);
    res.json(forecast);
  } catch (err) {
    handleError(err, res, city);
  }
});

function handleError(err, res, city) {
  if (err.response?.status === 404) {
    return res.status(404).json({ error: `City "${city}" not found` });
  }
  if (err.response?.status === 401) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  res.status(500).json({ error: 'Failed to fetch weather data' });
}

module.exports = router;
