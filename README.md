# Israel Weather API

REST API for current weather and 3-day forecasts for major Israeli cities, powered by [OpenWeatherMap](https://openweathermap.org/).

## Requirements

- Node.js 18+
- OpenWeatherMap API key ([free tier](https://openweathermap.org/api))

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
OPENWEATHER_API_KEY=your_api_key_here
PORT=3000
```

## Running

```bash
npm start
```

Server starts at `http://localhost:3000`. Interactive API docs available at `http://localhost:3000/api-docs`.

## Docker

```bash
docker build -t israel-weather-api .
docker run -p 3000:3000 -e OPENWEATHER_API_KEY=your_key israel-weather-api
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cities` | List all supported cities |
| GET | `/api/weather` | Current weather for all cities |
| GET | `/api/weather/:city` | Current weather for a specific city |
| GET | `/api/weather/:city/forecast` | 3-day forecast for a specific city |

### Example

```bash
curl http://localhost:3000/api/weather/Jerusalem
```

```json
{
  "city": "Jerusalem",
  "country": "IL",
  "temperature": 22.5,
  "feels_like": 21.3,
  "min_temp": 18.0,
  "max_temp": 26.0,
  "humidity": 50,
  "description": "clear sky",
  "icon": "https://openweathermap.org/img/wn/01d@2x.png",
  "wind_speed": 3.5,
  "wind_direction": 180,
  "visibility": 10000,
  "sunrise": "2024-06-01T03:45:00.000Z",
  "sunset": "2024-06-01T17:30:00.000Z"
}
```

## Testing

```bash
npm test
```

Runs 21 tests across 3 suites covering cities, weather service, and all API routes.

## Supported Cities

Jerusalem, Tel Aviv, Haifa, Rishon LeZion, Petah Tikva, Ashdod, Netanya, Beer Sheva, Bnei Brak, Holon, Ramat Gan, Rehovot, Herzliya, Kfar Saba, Eilat
