const request = require('supertest');
const express = require('express');

jest.mock('../src/weatherService');
const { getWeatherByCity, getForecastByCity } = require('../src/weatherService');
const routes = require('../src/routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

const mockWeather = {
  city: 'Jerusalem',
  country: 'IL',
  temperature: 22,
  feels_like: 21,
  min_temp: 18,
  max_temp: 26,
  humidity: 50,
  description: 'clear sky',
  icon: 'https://openweathermap.org/img/wn/01d@2x.png',
  wind_speed: 3.5,
  wind_direction: 180,
  visibility: 10000,
  sunrise: '2024-01-01T05:00:00.000Z',
  sunset: '2024-01-01T17:00:00.000Z',
};

const mockForecast = {
  city: 'Jerusalem',
  country: 'IL',
  forecast: [
    {
      datetime: '2024-01-01 12:00:00',
      temperature: 20,
      feels_like: 19,
      humidity: 55,
      description: 'partly cloudy',
      wind_speed: 2.5,
    },
  ],
};

describe('GET /api/cities', () => {
  it('returns 200 with a cities array', async () => {
    const res = await request(app).get('/api/cities');
    expect(res.status).toBe(200);
    expect(res.body.cities).toBeInstanceOf(Array);
    expect(res.body.cities.length).toBeGreaterThan(0);
  });

  it('includes expected cities', async () => {
    const res = await request(app).get('/api/cities');
    expect(res.body.cities).toContain('Jerusalem');
    expect(res.body.cities).toContain('Tel Aviv');
  });
});

describe('GET /api/weather', () => {
  it('returns weather for all cities', async () => {
    getWeatherByCity.mockResolvedValue(mockWeather);
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('count');
    expect(res.body).toHaveProperty('cities');
    expect(res.body.cities).toBeInstanceOf(Array);
    expect(res.body.count).toBe(res.body.cities.length);
  });

  it('skips failed cities and still returns 200', async () => {
    getWeatherByCity
      .mockResolvedValueOnce(mockWeather)
      .mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(200);
    expect(res.body.cities.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /api/weather/:city', () => {
  it('returns weather for a valid city', async () => {
    getWeatherByCity.mockResolvedValue(mockWeather);
    const res = await request(app).get('/api/weather/Jerusalem');
    expect(res.status).toBe(200);
    expect(res.body.city).toBe('Jerusalem');
    expect(res.body.temperature).toBe(22);
  });

  it('returns 404 for an unknown city', async () => {
    getWeatherByCity.mockRejectedValue({ response: { status: 404 } });
    const res = await request(app).get('/api/weather/Nowhere');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Nowhere/);
  });

  it('returns 401 for an invalid API key', async () => {
    getWeatherByCity.mockRejectedValue({ response: { status: 401 } });
    const res = await request(app).get('/api/weather/Jerusalem');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Invalid API key/);
  });

  it('returns 500 for unexpected errors', async () => {
    getWeatherByCity.mockRejectedValue(new Error('unexpected'));
    const res = await request(app).get('/api/weather/Jerusalem');
    expect(res.status).toBe(500);
  });
});

describe('GET /api/weather/:city/forecast', () => {
  it('returns forecast for a valid city', async () => {
    getForecastByCity.mockResolvedValue(mockForecast);
    const res = await request(app).get('/api/weather/Jerusalem/forecast');
    expect(res.status).toBe(200);
    expect(res.body.city).toBe('Jerusalem');
    expect(res.body.forecast).toHaveLength(1);
  });

  it('returns 404 for an unknown city', async () => {
    getForecastByCity.mockRejectedValue({ response: { status: 404 } });
    const res = await request(app).get('/api/weather/Nowhere/forecast');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Nowhere/);
  });

  it('returns 500 for unexpected errors', async () => {
    getForecastByCity.mockRejectedValue(new Error('unexpected'));
    const res = await request(app).get('/api/weather/Jerusalem/forecast');
    expect(res.status).toBe(500);
  });
});
