require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    name: 'Israel Weather API',
    docs: `http://localhost:${PORT}/api-docs`,
    endpoints: [
      'GET /api/cities — list all supported cities',
      'GET /api/weather — current weather for all cities',
      'GET /api/weather/:city — current weather for a city',
      'GET /api/weather/:city/forecast — 3-day forecast for a city',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
