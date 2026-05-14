const axios = require('axios');
const { getWeatherByCity, getForecastByCity } = require('../src/weatherService');

jest.mock('axios');

const mockWeatherResponse = {
  data: {
    name: 'Jerusalem',
    sys: { country: 'IL', sunrise: 1700000000, sunset: 1700040000 },
    main: { temp: 22, feels_like: 21, temp_min: 18, temp_max: 26, humidity: 50 },
    weather: [{ description: 'clear sky', icon: '01d' }],
    wind: { speed: 3.5, deg: 180 },
    visibility: 10000,
  },
};

const mockForecastResponse = {
  data: {
    city: { name: 'Jerusalem', country: 'IL' },
    list: [
      {
        dt_txt: '2024-01-01 12:00:00',
        main: { temp: 20, feels_like: 19, humidity: 55 },
        weather: [{ description: 'partly cloudy' }],
        wind: { speed: 2.5 },
      },
    ],
  },
};

describe('getWeatherByCity', () => {
  it('returns formatted weather data', async () => {
    axios.get.mockResolvedValue(mockWeatherResponse);
    const result = await getWeatherByCity('Jerusalem');
    expect(result.city).toBe('Jerusalem');
    expect(result.country).toBe('IL');
    expect(result.temperature).toBe(22);
    expect(result.humidity).toBe(50);
    expect(result.icon).toContain('01d');
    expect(result.sunrise).toBeDefined();
    expect(result.sunset).toBeDefined();
  });

  it('requests the correct endpoint and params', async () => {
    axios.get.mockResolvedValue(mockWeatherResponse);
    await getWeatherByCity('Tel Aviv');
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/weather'),
      expect.objectContaining({
        params: expect.objectContaining({ q: 'Tel Aviv,IL', units: 'metric' }),
      })
    );
  });

  it('propagates axios errors', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    await expect(getWeatherByCity('Jerusalem')).rejects.toThrow('Network error');
  });
});

describe('getForecastByCity', () => {
  it('returns structured forecast data', async () => {
    axios.get.mockResolvedValue(mockForecastResponse);
    const result = await getForecastByCity('Jerusalem');
    expect(result.city).toBe('Jerusalem');
    expect(result.country).toBe('IL');
    expect(result.forecast).toHaveLength(1);
    expect(result.forecast[0]).toMatchObject({
      datetime: '2024-01-01 12:00:00',
      temperature: 20,
      feels_like: 19,
      humidity: 55,
      description: 'partly cloudy',
      wind_speed: 2.5,
    });
  });

  it('requests the correct endpoint and params', async () => {
    axios.get.mockResolvedValue(mockForecastResponse);
    await getForecastByCity('Haifa');
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/forecast'),
      expect.objectContaining({
        params: expect.objectContaining({ q: 'Haifa,IL', units: 'metric' }),
      })
    );
  });

  it('propagates axios errors', async () => {
    axios.get.mockRejectedValue(new Error('timeout'));
    await expect(getForecastByCity('Haifa')).rejects.toThrow('timeout');
  });
});
