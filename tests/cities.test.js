const ISRAELI_CITIES = require('../src/cities');

test('exports an array', () => {
  expect(Array.isArray(ISRAELI_CITIES)).toBe(true);
});

test('contains at least one city', () => {
  expect(ISRAELI_CITIES.length).toBeGreaterThan(0);
});

test('all entries are non-empty strings', () => {
  ISRAELI_CITIES.forEach((city) => {
    expect(typeof city).toBe('string');
    expect(city.trim()).not.toBe('');
  });
});

test('includes key cities', () => {
  expect(ISRAELI_CITIES).toContain('Jerusalem');
  expect(ISRAELI_CITIES).toContain('Tel Aviv');
  expect(ISRAELI_CITIES).toContain('Eilat');
});
