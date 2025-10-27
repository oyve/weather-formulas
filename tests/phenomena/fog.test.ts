import { fogVisibility, fogPointTemperature, fogProbability, fogTrendProbability } from '../../src/phenomena/fog';

describe('fogVisibility', () => {
    it('calculates visibility using Koschmieder’s Law', () => {
        // Given
        const extinction1 = 0.1;
        const extinction2 = 0.5;
        const extinction3 = 1;
        // When
        const vis1 = fogVisibility(extinction1);
        const vis2 = fogVisibility(extinction2);
        const vis3 = fogVisibility(extinction3);
        // Then
        expect(vis1).toBeCloseTo(39.12, 2);
        expect(vis2).toBeCloseTo(7.824, 3);
        expect(vis3).toBeCloseTo(3.912, 3);
    });

    it('returns Infinity for zero extinction coefficient', () => {
        // Given
        const extinction = 0;
        // When
        const vis = fogVisibility(extinction);
        // Then
        expect(vis).toBe(Infinity);
    });

    it('returns negative visibility for negative extinction coefficient', () => {
        // Given
        const extinction = -0.1;
        // When
        const vis = fogVisibility(extinction);
        // Then
        expect(vis).toBeCloseTo(-39.12, 2);
    });
});

describe('fogPointTemperature', () => {
    it('returns a value close to temperature when RH is 100%', () => {
        // Given
        const temp1 = 280, rh1 = 100;
        const temp2 = 300, rh2 = 100;
        // When
        const dew1 = fogPointTemperature(temp1, rh1);
        const dew2 = fogPointTemperature(temp2, rh2);
        // Then
        expect(dew1).toBeCloseTo(temp1, 1);
        expect(dew2).toBeCloseTo(temp2, 1);
    });

    it('returns a value less than temperature when RH is below 100%', () => {
        // Given
        const temp1 = 280, rh1 = 90;
        const temp2 = 300, rh2 = 80;
        // When
        const dew1 = fogPointTemperature(temp1, rh1);
        const dew2 = fogPointTemperature(temp2, rh2);
        // Then
        expect(dew1).toBeLessThan(temp1);
        expect(dew2).toBeLessThan(temp2);
    });
});

describe('fogProbability', () => {
    it('returns 0 for less than 2 readings', () => {
        // Given
        const readingsEmpty: any[] = [];
        const readingsOne = [{ temperature: 280, relativeHumidity: 95, pressure: 1010, altitude: 0, timestamp: Date.now() }];
        // When
        const resultEmpty = fogProbability(readingsEmpty);
        const resultOne = fogProbability(readingsOne);
        // Then
        expect(resultEmpty).toBe(0);
        expect(resultOne).toBe(0);
    });

    it('returns a value between 0 and 1', () => {
        // Given
        const readings = [
            { temperature: 280, relativeHumidity: 95, pressure: 1012, windSpeed: 1, altitude: 0, timestamp: Date.now() },
            { temperature: 279.7, relativeHumidity: 97, pressure: 1010, windSpeed: 1, altitude: 0, timestamp: Date.now() }
        ];
        // When
        const result = fogProbability(readings);
        // Then
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
    });

    it('returns higher probability when fog factors are met', () => {
        // Given
        const readingsHigh = [
            { temperature: 280, relativeHumidity: 99, pressure: 1012, windSpeed: 1, altitude: 0, timestamp: Date.now() },
            { temperature: 279.7, relativeHumidity: 99, pressure: 1010, windSpeed: 1, altitude: 0, timestamp: Date.now() }
        ];
        const readingsLow = [
            { temperature: 290, relativeHumidity: 50, pressure: 1015, windSpeed: 5, altitude: 0, timestamp: Date.now() },
            { temperature: 289, relativeHumidity: 60, pressure: 1016, windSpeed: 4, altitude: 0, timestamp: Date.now() }
        ];
        // When
        const high = fogProbability(readingsHigh);
        const low = fogProbability(readingsLow);
        // Then
        expect(high).toBeGreaterThan(low);
    });

    it('handles missing windSpeed property', () => {
        // Given
        const readings = [
            { temperature: 280, relativeHumidity: 95, pressure: 1012, altitude: 0, timestamp: Date.now() },
            { temperature: 279.7, relativeHumidity: 97, pressure: 1010, altitude: 0, timestamp: Date.now() }
        ];
        // When
        const result = fogProbability(readings);
        // Then
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
    });

    it('works with all required parameters present', () => {
        // Given
        const readings = [
            { temperature: 285, relativeHumidity: 93, pressure: 1015, windSpeed: 2, altitude: 0, timestamp: Date.now() },
            { temperature: 284, relativeHumidity: 96, pressure: 1012, windSpeed: 1, altitude: 0, timestamp: Date.now() }
        ];
        // When
        const result = fogProbability(readings);
        // Then
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
    });

    it('returns 0 probability for clearly non-foggy conditions', () => {
        // Given: warm, dry, windy
        const readings = [
            { temperature: 295, relativeHumidity: 30, pressure: 1015, windSpeed: 6, altitude: 0, timestamp: Date.now() },
            { temperature: 294, relativeHumidity: 32, pressure: 1016, windSpeed: 7, altitude: 0, timestamp: Date.now() }
        ];
        // When
        const result = fogProbability(readings);
        // Then
        expect(result).toBeCloseTo(0, 2);
    });

    it('returns 1 probability for ideal fog conditions', () => {
        // Given: cold, saturated, calm
        const readings = [
            { temperature: 278, relativeHumidity: 100, pressure: 1012, windSpeed: 0, altitude: 0, timestamp: Date.now() },
            { temperature: 278, relativeHumidity: 100, pressure: 1012, windSpeed: 0, altitude: 0, timestamp: Date.now() }
        ];
        // When
        const result = fogProbability(readings);
        // Then
        expect(result).toBeCloseTo(1, 2);
    });

    it('returns about 0.5 probability for borderline fog conditions', () => {
        // Given: moderate temp, high RH, light wind
        const readings = [
            { temperature: 283, relativeHumidity: 93, pressure: 1013, windSpeed: 2, altitude: 0, timestamp: Date.now() },
            { temperature: 282.5, relativeHumidity: 94, pressure: 1012, windSpeed: 2, altitude: 0, timestamp: Date.now() }
        ];
        // When
        const result = fogProbability(readings);
        // Then
        expect(result).toBeGreaterThanOrEqual(0.45);
        expect(result).toBeLessThanOrEqual(0.55);
    });
});

describe('fogTrendProbability', () => {
    it('returns an array of length hoursAhead', () => {
        const readings = [
            { temperature: 280, relativeHumidity: 95, pressure: 1012, windSpeed: 1, altitude: 0, timestamp: Date.now() },
            { temperature: 279.7, relativeHumidity: 97, pressure: 1010, windSpeed: 1, altitude: 0, timestamp: Date.now() }
        ];
        const result = fogTrendProbability(readings, 4, 1);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(4);
    });

    it('returns all probabilities between 0 and 1', () => {
        const readings = [
            { temperature: 280, relativeHumidity: 95, pressure: 1012, windSpeed: 1, altitude: 0, timestamp: Date.now() },
            { temperature: 279.7, relativeHumidity: 97, pressure: 1010, windSpeed: 1, altitude: 0, timestamp: Date.now() }
        ];
        const result = fogTrendProbability(readings, 3, 1);
        for (const prob of result) {
            expect(prob).toBeGreaterThanOrEqual(0);
            expect(prob).toBeLessThanOrEqual(1);
        }
    });

    it('returns zeros if not enough readings', () => {
        const readings: any[] = [];
        const result = fogTrendProbability(readings, 2, 1);
        expect(result).toEqual([0, 0]);
    });

    it('returns higher probabilities for foggy trends', () => {
        const readings = [
            { temperature: 278, relativeHumidity: 100, pressure: 1012, windSpeed: 0, altitude: 0, timestamp: Date.now() },
            { temperature: 278, relativeHumidity: 100, pressure: 1012, windSpeed: 0, altitude: 0, timestamp: Date.now() }
        ];
        const result = fogTrendProbability(readings, 2, 1);
        expect(result[0]).toBeGreaterThanOrEqual(0.9);
        expect(result[1]).toBeGreaterThanOrEqual(0.9);
    });

    it('works with missing windSpeed', () => {
        const readings = [
            { temperature: 280, relativeHumidity: 95, pressure: 1012, altitude: 0, timestamp: Date.now() },
            { temperature: 279.7, relativeHumidity: 97, pressure: 1010, altitude: 0, timestamp: Date.now() }
        ];
        const result = fogTrendProbability(readings, 2, 1);
        expect(result.length).toBe(2);
        for (const prob of result) {
            expect(prob).toBeGreaterThanOrEqual(0);
            expect(prob).toBeLessThanOrEqual(1);
        }
    });

    it('adjusts for solar elevation if lat/lon provided (probability decreases after sunrise)', () => {
        // Use a fixed timestamp before sunrise at a known location
        const midnight = new Date(Date.UTC(2023, 0, 1, 0, 0, 0)).getTime();
        const readings = [
            { temperature: 278, relativeHumidity: 100, pressure: 1012, windSpeed: 0, altitude: 0, timestamp: midnight },
            { temperature: 278, relativeHumidity: 100, pressure: 1012, windSpeed: 0, altitude: 0, timestamp: midnight }
        ];
        // Location: London
        const lat = 51.5, lon = 0;
        // Predict for 10 hours to ensure we cross sunrise
        const result = fogTrendProbability(readings, 10, 1, lat, lon);
        // Find the first index where probability drops below 1 (after sunrise)
        const firstDropIdx = result.findIndex(p => p < 1);
        // There should be a drop after sunrise
        expect(firstDropIdx).toBeGreaterThan(0);
        expect(result[firstDropIdx]).toBeLessThan(result[0]);
    });
});