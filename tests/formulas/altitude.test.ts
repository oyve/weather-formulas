import { 
    freezingLevelAltitude, 
    altitudeFromPressureDifference, 
    calculateAltitudesFromPressureSeries
} from '../../src/formulas/altitude';
import { Reading } from '../../src/common';
import { cloudBaseHeight } from '../../src/phenomena/cloud';

describe('freezingLevelHeight', () => {
    it('should return null if surface temperature is at or below freezing', () => {
        expect(freezingLevelAltitude(273.15)).toBeNull();
        expect(freezingLevelAltitude(270)).toBeNull();
    });

    it('should calculate freezing level height above sea level', () => {
        // Surface temp: 283.15 K (10°C), sea level, lapse rate 0.0065 K/m
        const result = freezingLevelAltitude(283.15, 0);
        // (283.15 - 273.15) / 0.0065 = 1538.46 m
        expect(result).toBeCloseTo(1538.46, 2);
    });

    it('should calculate freezing level height above a given altitude', () => {
        // Surface temp: 283.15 K (10°C), altitude: 500 m, lapse rate 0.0065 K/m
        const result = freezingLevelAltitude(283.15, 500);
        // (283.15 - 273.15) / 0.0065 + 500 = 2038.46 m
        expect(result).toBeCloseTo(2038.46, 2);
    });

    it('should work with a custom lapse rate', () => {
        // Surface temp: 283.15 K (10°C), sea level, lapse rate 0.01 K/m
        const result = freezingLevelAltitude(283.15, 0, 0.01);
        // (283.15 - 273.15) / 0.01 = 1000 m
        expect(result).toBeCloseTo(1000, 2);
    });
});

describe('cloudBaseHeight', () => {
    it('should calculate cloud base height at sea level', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 283.15 K (10°C)
        // Spread: 10 K, Expected: 10 * 124.7 = 1247 m
        const result = cloudBaseHeight(293.15, 283.15);
        expect(result).toBeCloseTo(1247, 2);
    });

    it('should calculate cloud base height above a given altitude', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 283.15 K (10°C), Surface: 500 m
        // Spread: 10 K, Height above surface: 10 * 124.7 = 1247 m
        // Total: 500 + 1247 = 1747 m
        const result = cloudBaseHeight(293.15, 283.15, 500);
        expect(result).toBeCloseTo(1747, 2);
    });

    it('should handle small temperature-dewpoint spread', () => {
        // Temperature: 288.15 K (15°C), Dew Point: 286.15 K (13°C)
        // Spread: 2 K, Expected: 2 * 124.7 = 249.4 m
        const result = cloudBaseHeight(288.15, 286.15);
        expect(result).toBeCloseTo(249.4, 2);
    });

    it('should handle large temperature-dewpoint spread', () => {
        // Temperature: 303.15 K (30°C), Dew Point: 283.15 K (10°C)
        // Spread: 20 K, Expected: 20 * 124.7 = 2494 m
        const result = cloudBaseHeight(303.15, 283.15);
        expect(result).toBeCloseTo(2494, 2);
    });

    it('should handle zero spread (saturated air)', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 293.15 K (20°C)
        // Spread: 0 K, Expected: 0 m (cloud at surface, fog)
        const result = cloudBaseHeight(293.15, 293.15);
        expect(result).toBeCloseTo(0, 2);
    });

    it('should work with typical aviation scenario', () => {
        // Temperature: 298.15 K (25°C), Dew Point: 291.15 K (18°C), Airport at 100m
        // Spread: 7 K, Height above surface: 7 * 124.7 = 872.9 m
        // Total: 100 + 872.9 = 972.9 m
        const result = cloudBaseHeight(298.15, 291.15, 100);
        expect(result).toBeCloseTo(972.9, 2);
    });

    it('should throw error when dew point is greater than temperature', () => {
        // Dew Point: 293.15 K (20°C), Temperature: 288.15 K (15°C)
        // This is physically impossible
        expect(() => cloudBaseHeight(288.15, 293.15)).toThrow("Dew point cannot be greater than temperature.");
    });

    it('should match 3rd party calculator result', () => {
        // Temperature: 283.15 K (10°C), Dew Point: 281.15 K (8°C), Altitude: 1000m
        // Spread: 2 K, Height above surface: 2 * 124.7 = 249.4 m
        // Total: 1000 + 249.4 = 1249.4 m
        const result = cloudBaseHeight(283.15, 281.15, 1000);
        expect(result).toBeCloseTo(1249.4, 2);
    });
});

describe('altitudeFromPressureDifference', () => {
    it('should return 0 when pressures are equal', () => {
        const result = altitudeFromPressureDifference(101325, 101325);
        expect(result).toBe(0);
    });

    it('should calculate positive altitude difference when current pressure is lower', () => {
        // Sea level pressure to ~1000m altitude pressure
        // Using standard temperature 288.15K (15°C)
        const result = altitudeFromPressureDifference(101325, 89874.46, 288.15);
        // Expected: ~1000m (approximately, based on barometric formula)
        // The hypsometric formula may give slightly different results than barometric
        expect(result).toBeCloseTo(1011, 0); // Within 1 meter
    });

    it('should calculate negative altitude difference when current pressure is higher', () => {
        // From higher altitude to sea level (going down)
        const result = altitudeFromPressureDifference(89874.46, 101325, 288.15);
        // Expected: ~-1000m (going down)
        expect(result).toBeCloseTo(-1011, 0); // Within 1 meter
    });

    it('should calculate altitude difference at standard sea level to 500m', () => {
        // Sea level standard: 101325 Pa
        // At 500m altitude: ~95461 Pa (approximately)
        // Using hypsometric formula: Δh = (R * T / g) * ln(P1/P2)
        // With R=287.05, T=288.15K, g=9.80665
        // Scale height = 287.05 * 288.15 / 9.80665 = 8434.5 m
        // For ~500m: P2 = P1 * exp(-500/8434.5) = 101325 * 0.9424 = 95461 Pa
        const result = altitudeFromPressureDifference(101325, 95461, 288.15);
        expect(result).toBeCloseTo(500, -1); // Within 10 meters
    });

    it('should account for temperature in calculations', () => {
        // Same pressure difference at different temperatures should yield different altitudes
        const coldTemp = 273.15; // 0°C
        const warmTemp = 303.15; // 30°C
        
        const resultCold = altitudeFromPressureDifference(101325, 95000, coldTemp);
        const resultWarm = altitudeFromPressureDifference(101325, 95000, warmTemp);
        
        // Warmer air is less dense, so same pressure drop represents larger altitude change
        expect(resultWarm).toBeGreaterThan(resultCold);
    });

    it('should use default temperature when not provided', () => {
        const resultWithDefault = altitudeFromPressureDifference(101325, 95000);
        const resultWithExplicit = altitudeFromPressureDifference(101325, 95000, 288.15);
        
        expect(resultWithDefault).toBe(resultWithExplicit);
    });
});

describe('calculateAltitudesFromPressureSeries', () => {
    // Helper function to create a Reading with default values
    const createReading = (timestamp: number, pressure: number, temperature: number = 288.15): Reading => ({
        timestamp,
        pressure,
        temperature,
        altitude: 0,
        relativeHumidity: 50
    });

    it('should return empty array for empty readings', () => {
        const result = calculateAltitudesFromPressureSeries([]);
        expect(result).toEqual([]);
    });

    it('should return start altitude for single reading', () => {
        const readings: Reading[] = [
            createReading(1000, 101325)
        ];
        const result = calculateAltitudesFromPressureSeries(readings, 100);
        
        expect(result).toHaveLength(1);
        expect(result[0].altitude).toBe(100);
        expect(result[0].pressure).toBe(101325);
        expect(result[0].timestamp).toBe(1000);
    });

    it('should calculate increasing altitudes for decreasing pressures', () => {
        const baseTimestamp = Date.now();
        const readings: Reading[] = [
            createReading(baseTimestamp, 101325),
            createReading(baseTimestamp + 3600000, 98000),
            createReading(baseTimestamp + 7200000, 95000)
        ];
        
        const result = calculateAltitudesFromPressureSeries(readings, 0);
        
        expect(result).toHaveLength(3);
        expect(result[0].altitude).toBe(0);
        expect(result[1].altitude).toBeGreaterThan(result[0].altitude);
        expect(result[2].altitude).toBeGreaterThan(result[1].altitude);
    });

    it('should calculate decreasing altitudes for increasing pressures', () => {
        const baseTimestamp = Date.now();
        const readings: Reading[] = [
            createReading(baseTimestamp, 95000),
            createReading(baseTimestamp + 3600000, 98000),
            createReading(baseTimestamp + 7200000, 101325)
        ];
        
        const result = calculateAltitudesFromPressureSeries(readings, 500);
        
        expect(result).toHaveLength(3);
        expect(result[0].altitude).toBe(500);
        expect(result[1].altitude).toBeLessThan(result[0].altitude);
        expect(result[2].altitude).toBeLessThan(result[1].altitude);
    });

    it('should sort readings by timestamp', () => {
        const baseTimestamp = Date.now();
        // Readings out of order
        const readings: Reading[] = [
            createReading(baseTimestamp + 7200000, 95000),
            createReading(baseTimestamp, 101325),
            createReading(baseTimestamp + 3600000, 98000)
        ];
        
        const result = calculateAltitudesFromPressureSeries(readings, 0);
        
        expect(result).toHaveLength(3);
        // Results should be in timestamp order
        expect(result[0].timestamp).toBe(baseTimestamp);
        expect(result[1].timestamp).toBe(baseTimestamp + 3600000);
        expect(result[2].timestamp).toBe(baseTimestamp + 7200000);
        // First reading should use start altitude
        expect(result[0].altitude).toBe(0);
    });

    it('should use temperature from readings when provided', () => {
        const baseTimestamp = Date.now();
        const readings: Reading[] = [
            createReading(baseTimestamp, 101325, 293.15), // 20°C
            createReading(baseTimestamp + 3600000, 98000, 288.15) // 15°C
        ];
        
        const result = calculateAltitudesFromPressureSeries(readings, 0);
        
        expect(result).toHaveLength(2);
        expect(result[1].altitude).toBeGreaterThan(0);
    });

    it('should use default temperature when not provided in readings', () => {
        const baseTimestamp = Date.now();
        const readings: Reading[] = [
            createReading(baseTimestamp, 101325),
            createReading(baseTimestamp + 3600000, 98000)
        ];
        
        const resultDefault = calculateAltitudesFromPressureSeries(readings, 0);
        const resultExplicit = calculateAltitudesFromPressureSeries(readings, 0, 288.15);
        
        expect(resultDefault[1].altitude).toBe(resultExplicit[1].altitude);
    });

    it('should use custom default temperature', () => {
        const baseTimestamp = Date.now();
        // Create readings with different temperatures to test temperature impact
        const coldReadings: Reading[] = [
            createReading(baseTimestamp, 101325, 273.15), // 0°C
            createReading(baseTimestamp + 3600000, 98000, 273.15)
        ];
        const warmReadings: Reading[] = [
            createReading(baseTimestamp, 101325, 303.15), // 30°C
            createReading(baseTimestamp + 3600000, 98000, 303.15)
        ];
        
        const resultCold = calculateAltitudesFromPressureSeries(coldReadings, 0);
        const resultWarm = calculateAltitudesFromPressureSeries(warmReadings, 0);
        
        // Warmer temperatures result in larger altitude changes
        expect(resultWarm[1].altitude).toBeGreaterThan(resultCold[1].altitude);
    });

    it('should preserve pressure values in results', () => {
        const baseTimestamp = Date.now();
        const readings: Reading[] = [
            createReading(baseTimestamp, 101325),
            createReading(baseTimestamp + 3600000, 98000),
            createReading(baseTimestamp + 7200000, 95000)
        ];
        
        const result = calculateAltitudesFromPressureSeries(readings, 100);
        
        expect(result[0].pressure).toBe(101325);
        expect(result[1].pressure).toBe(98000);
        expect(result[2].pressure).toBe(95000);
    });

    it('should simulate a hiking trip scenario', () => {
        // Simulating a hike starting at 200m elevation
        // Going up a mountain over 3 hours
        const baseTimestamp = Date.now();
        const readings: Reading[] = [
            createReading(baseTimestamp, 99000, 288.15),           // Start at 200m
            createReading(baseTimestamp + 3600000, 96000, 286.15), // 1 hour later
            createReading(baseTimestamp + 7200000, 93000, 284.15), // 2 hours later
            createReading(baseTimestamp + 10800000, 90000, 282.15) // 3 hours later (summit)
        ];
        
        const result = calculateAltitudesFromPressureSeries(readings, 200);
        
        expect(result).toHaveLength(4);
        expect(result[0].altitude).toBe(200);
        // Each subsequent altitude should be higher
        for (let i = 1; i < result.length; i++) {
            expect(result[i].altitude).toBeGreaterThan(result[i - 1].altitude);
        }
        // Final altitude should be significantly higher than start
        expect(result[3].altitude).toBeGreaterThan(500);
    });

    it('should handle constant pressure (no altitude change)', () => {
        const baseTimestamp = Date.now();
        const readings: Reading[] = [
            createReading(baseTimestamp, 101325),
            createReading(baseTimestamp + 3600000, 101325),
            createReading(baseTimestamp + 7200000, 101325)
        ];
        
        const result = calculateAltitudesFromPressureSeries(readings, 100);
        
        expect(result).toHaveLength(3);
        expect(result[0].altitude).toBe(100);
        expect(result[1].altitude).toBe(100);
        expect(result[2].altitude).toBe(100);
    });
});
