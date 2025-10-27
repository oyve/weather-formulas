import { cloudBaseHeight, cloudTemperature } from '../../src/phenomena/cloud';

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

describe('cloudTemperature', () => {
    it('should calculate cloud base temperature at sea level with standard lapse rate', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 283.15 K (10°C)
        // Spread: 10 K, Cloud base height above surface: 10 * 124.7 = 1247 m
        // Temperature decrease: 0.0065 K/m * 1247 m = 8.1055 K
        // Cloud temperature: 293.15 - 8.1055 = 285.0445 K
        const result = cloudTemperature(293.15, 283.15);
        expect(result).toBeCloseTo(285.04, 2);
    });

    it('should calculate cloud base temperature with custom lapse rate', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 283.15 K (10°C)
        // Spread: 10 K, Cloud base height above surface: 10 * 124.7 = 1247 m
        // Custom lapse rate: 0.008 K/m
        // Temperature decrease: 0.008 K/m * 1247 m = 9.976 K
        // Cloud temperature: 293.15 - 9.976 = 283.174 K
        const result = cloudTemperature(293.15, 283.15, 0.008);
        expect(result).toBeCloseTo(283.17, 2);
    });

    it('should handle small temperature-dewpoint spread', () => {
        // Temperature: 288.15 K (15°C), Dew Point: 286.15 K (13°C)
        // Spread: 2 K, Cloud base height above surface: 2 * 124.7 = 249.4 m
        // Temperature decrease: 0.0065 K/m * 249.4 m = 1.6211 K
        // Cloud temperature: 288.15 - 1.6211 = 286.5289 K
        const result = cloudTemperature(288.15, 286.15);
        expect(result).toBeCloseTo(286.53, 2);
    });

    it('should handle large temperature-dewpoint spread', () => {
        // Temperature: 303.15 K (30°C), Dew Point: 283.15 K (10°C)
        // Spread: 20 K, Cloud base height above surface: 20 * 124.7 = 2494 m
        // Temperature decrease: 0.0065 K/m * 2494 m = 16.211 K
        // Cloud temperature: 303.15 - 16.211 = 286.939 K
        const result = cloudTemperature(303.15, 283.15);
        expect(result).toBeCloseTo(286.94, 2);
    });

    it('should handle zero spread (saturated air, fog)', () => {
        // Temperature: 293.15 K (20°C), Dew Point: 293.15 K (20°C)
        // Spread: 0 K, Cloud base at surface (0 m)
        // Temperature decrease: 0.0065 K/m * 0 m = 0 K
        // Cloud temperature equals surface temperature: 293.15 K
        const result = cloudTemperature(293.15, 293.15);
        expect(result).toBeCloseTo(293.15, 2);
    });

    it('should work with typical aviation scenario', () => {
        // Temperature: 298.15 K (25°C), Dew Point: 291.15 K (18°C)
        // Spread: 7 K, Height above surface: 7 * 124.7 = 872.9 m
        // Temperature decrease: 0.0065 K/m * 872.9 m = 5.674 K
        // Cloud temperature: 298.15 - 5.674 = 292.476 K
        const result = cloudTemperature(298.15, 291.15);
        expect(result).toBeCloseTo(292.48, 2);
    });

    it('should calculate correctly with dry adiabatic lapse rate', () => {
        // Temperature: 283.15 K (10°C), Dew Point: 281.15 K (8°C)
        // Spread: 2 K, Height above surface: 2 * 124.7 = 249.4 m
        // Using dry adiabatic lapse rate: 0.0098 K/m
        // Temperature decrease: 0.0098 K/m * 249.4 m = 2.444 K
        // Cloud temperature: 283.15 - 2.444 = 280.706 K
        const result = cloudTemperature(283.15, 281.15, 0.0098);
        expect(result).toBeCloseTo(280.71, 2);
    });

    it('should throw error when dew point is greater than temperature', () => {
        // Dew Point: 293.15 K (20°C), Temperature: 288.15 K (15°C)
        // This is physically impossible
        expect(() => cloudTemperature(288.15, 293.15)).toThrow("Dew point cannot be greater than temperature.");
    });

    it('should match expected values for cold weather conditions', () => {
        // Temperature: 273.15 K (0°C), Dew Point: 268.15 K (-5°C)
        // Spread: 5 K, Cloud base height above surface: 5 * 124.7 = 623.5 m
        // Temperature decrease: 0.0065 K/m * 623.5 m = 4.053 K
        // Cloud temperature: 273.15 - 4.053 = 269.097 K
        const result = cloudTemperature(273.15, 268.15);
        expect(result).toBeCloseTo(269.10, 2);
    });

    it('should handle warm tropical conditions', () => {
        // Temperature: 308.15 K (35°C), Dew Point: 298.15 K (25°C)
        // Spread: 10 K, Cloud base height above surface: 10 * 124.7 = 1247 m
        // Temperature decrease: 0.0065 K/m * 1247 m = 8.1055 K
        // Cloud temperature: 308.15 - 8.1055 = 300.0445 K
        const result = cloudTemperature(308.15, 298.15);
        expect(result).toBeCloseTo(300.04, 2);
    });
});
