import { freezingLevelAltitude, cloudBaseHeight } from '../../src/formulas/altitude';

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
        // Spread: 10 K, Expected: 10 / 8 * 1000 = 1250 m
        const result = cloudBaseHeight(293.15, 283.15);
        expect(result).toBeCloseTo(1250, 2);
    });

    it('should calculate cloud base height above a given altitude', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 283.15 K (10°C), Surface: 500 m
        // Spread: 10 K, Height above surface: 10 / 8 * 1000 = 1250 m
        // Total: 500 + 1250 = 1750 m
        const result = cloudBaseHeight(293.15, 283.15, 500);
        expect(result).toBeCloseTo(1750, 2);
    });

    it('should handle small temperature-dewpoint spread', () => {
        // Temperature: 288.15 K (15°C), Dew Point: 286.15 K (13°C)
        // Spread: 2 K, Expected: 2 / 8 * 1000 = 250 m
        const result = cloudBaseHeight(288.15, 286.15);
        expect(result).toBeCloseTo(250, 2);
    });

    it('should handle large temperature-dewpoint spread', () => {
        // Temperature: 303.15 K (30°C), Dew Point: 283.15 K (10°C)
        // Spread: 20 K, Expected: 20 / 8 * 1000 = 2500 m
        const result = cloudBaseHeight(303.15, 283.15);
        expect(result).toBeCloseTo(2500, 2);
    });

    it('should handle zero spread (saturated air)', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 293.15 K (20°C)
        // Spread: 0 K, Expected: 0 m (cloud at surface, fog)
        const result = cloudBaseHeight(293.15, 293.15);
        expect(result).toBeCloseTo(0, 2);
    });

    it('should work with typical aviation scenario', () => {
        // Temperature: 298.15 K (25°C), Dew Point: 291.15 K (18°C), Airport at 100m
        // Spread: 7 K, Height above surface: 7 / 8 * 1000 = 875 m
        // Total: 100 + 875 = 975 m
        const result = cloudBaseHeight(298.15, 291.15, 100);
        expect(result).toBeCloseTo(975, 2);
    });

    it('should throw error when dew point is greater than temperature', () => {
        // Dew Point: 293.15 K (20°C), Temperature: 288.15 K (15°C)
        // This is physically impossible
        expect(() => cloudBaseHeight(288.15, 293.15)).toThrow("Dew point cannot be greater than temperature.");
    });

    it('should match Wikipedia formula example', () => {
        // Temperature: 283.15 K (10°C), Dew Point: 281.15 K (8°C), Altitude: 1000m
        // Spread: 2 K, Height above surface: 2 / 8 * 1000 = 250 m
        // Total: 1000 + 250 = 1250 m
        const result = cloudBaseHeight(283.15, 281.15, 1000);
        expect(result).toBeCloseTo(1250, 2);
    });
});