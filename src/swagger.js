const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Israel Weather API',
      version: '1.0.0',
      description: 'REST API for current weather and forecasts in Israeli cities',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
      schemas: {
        Weather: {
          type: 'object',
          properties: {
            city: { type: 'string', example: 'Tel Aviv' },
            country: { type: 'string', example: 'IL' },
            temperature: { type: 'number', example: 28.5 },
            feels_like: { type: 'number', example: 30.1 },
            min_temp: { type: 'number', example: 24.0 },
            max_temp: { type: 'number', example: 31.0 },
            humidity: { type: 'integer', example: 65 },
            description: { type: 'string', example: 'clear sky' },
            icon: { type: 'string', example: 'https://openweathermap.org/img/wn/01d@2x.png' },
            wind_speed: { type: 'number', example: 4.5 },
            wind_direction: { type: 'integer', example: 220 },
            visibility: { type: 'integer', example: 10000 },
            sunrise: { type: 'string', format: 'date-time' },
            sunset: { type: 'string', format: 'date-time' },
          },
        },
        ForecastEntry: {
          type: 'object',
          properties: {
            datetime: { type: 'string', example: '2024-06-01 12:00:00' },
            temperature: { type: 'number', example: 28.5 },
            feels_like: { type: 'number', example: 30.1 },
            humidity: { type: 'integer', example: 65 },
            description: { type: 'string', example: 'clear sky' },
            wind_speed: { type: 'number', example: 4.5 },
          },
        },
        Forecast: {
          type: 'object',
          properties: {
            city: { type: 'string', example: 'Tel Aviv' },
            country: { type: 'string', example: 'IL' },
            forecast: {
              type: 'array',
              items: { $ref: '#/components/schemas/ForecastEntry' },
            },
          },
        },
        AllCitiesWeather: {
          type: 'object',
          properties: {
            count: { type: 'integer', example: 15 },
            cities: {
              type: 'array',
              items: { $ref: '#/components/schemas/Weather' },
            },
          },
        },
        CitiesList: {
          type: 'object',
          properties: {
            cities: {
              type: 'array',
              items: { type: 'string' },
              example: ['Jerusalem', 'Tel Aviv', 'Haifa'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'City "Unknown" not found' },
          },
        },
      },
    },
  },
  apis: ['./src/routes.js'],
};

module.exports = swaggerJsdoc(options);
