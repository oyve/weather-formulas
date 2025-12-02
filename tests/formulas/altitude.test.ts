import { freezingLevelAltitude, altitudeFromPressureDifference } from '../../src/formulas/altitude';
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

describe('altitudeFromPressureDifference', () => {
    it('should calculate altitude from sea level pressure', () => {
        // Sea level pressure: 101325 Pa, pressure at ~1000m: ~89874 Pa
        // Using hypsometric formula: h = (R * T / g) * ln(P1 / P2)
        // With R = 287.05 J/(kg·K), T = 288.15 K, g = 9.80665 m/s²
        const result = altitudeFromPressureDifference(101325, 89874, 0, 288.15);
        // Calculated: (287.05 * 288.15 / 9.80665) * ln(101325 / 89874) ≈ 1011.49 m
        expect(result).toBeCloseTo(1011.49, 0);
    });

    it('should return the final altitude, not just the difference', () => {
        // If reference altitude is 500 m, the result should be 500 + altitude difference
        const result = altitudeFromPressureDifference(101325, 89874, 500, 288.15);
        // Should be approximately 500 + 1011.49 = 1511.49 m
        expect(result).toBeCloseTo(1511.49, 0);
    });

    it('should return reference altitude when pressures are equal', () => {
        // If pressures are equal, altitude difference is 0
        const result = altitudeFromPressureDifference(101325, 101325, 100, 288.15);
        expect(result).toBeCloseTo(100, 2);
    });

    it('should calculate lower altitude when observed pressure is higher', () => {
        // Higher pressure means lower altitude
        const result = altitudeFromPressureDifference(89874, 101325, 1000, 288.15);
        // Should be approximately 1000 - 1011.49 ≈ -11.49 m
        expect(result).toBeCloseTo(-11.49, 0);
    });

    it('should calculate altitude at high elevation from sea level', () => {
        // Sea level pressure: 101325 Pa, pressure at ~5000m: ~54020 Pa
        const result = altitudeFromPressureDifference(101325, 54020, 0, 288.15);
        // Calculated value using hypsometric formula
        expect(result).toBeCloseTo(5305.07, 0);
    });

    it('should work with default parameters', () => {
        // Uses default referenceAltitude = 0 and temperature = 288.15 K
        const result = altitudeFromPressureDifference(101325, 89874);
        expect(result).toBeCloseTo(1011.49, 0);
    });

    it('should account for different temperatures', () => {
        // Colder temperature should result in slightly different altitude calculation
        const coldResult = altitudeFromPressureDifference(101325, 89874, 0, 273.15); // 0°C
        const warmResult = altitudeFromPressureDifference(101325, 89874, 0, 303.15); // 30°C
        
        // Warmer air is less dense, so same pressure difference = larger altitude change
        expect(warmResult).toBeGreaterThan(coldResult);
    });

    // New tests for moist air (relative humidity) support
    it('should calculate higher altitude for moist air than dry air', () => {
        // Moist air is less dense than dry air at the same temperature and pressure
        // so the same pressure difference corresponds to a greater altitude change
        const dryResult = altitudeFromPressureDifference(101325, 89874, 0, 288.15);
        const moistResult = altitudeFromPressureDifference(101325, 89874, 0, 288.15, 60);
        
        // Moist air result should be higher than dry air result
        expect(moistResult).toBeGreaterThan(dryResult);
    });

    it('should show increasing altitude difference with increasing humidity', () => {
        // Higher humidity means more water vapor, which is lighter than dry air
        const result0 = altitudeFromPressureDifference(101325, 89874, 0, 288.15, 0);   // 0% RH
        const result50 = altitudeFromPressureDifference(101325, 89874, 0, 288.15, 50); // 50% RH
        const result100 = altitudeFromPressureDifference(101325, 89874, 0, 288.15, 100); // 100% RH
        
        expect(result50).toBeGreaterThan(result0);
        expect(result100).toBeGreaterThan(result50);
    });

    it('should have minimal humidity effect at low temperatures', () => {
        // At low temperatures, saturation vapor pressure is low, so humidity effect is minimal
        const dryResult = altitudeFromPressureDifference(101325, 89874, 0, 263.15); // -10°C dry
        const moistResult = altitudeFromPressureDifference(101325, 89874, 0, 263.15, 100); // -10°C, 100% RH
        
        // The difference should be small (less than 1% of altitude)
        const percentDiff = ((moistResult - dryResult) / dryResult) * 100;
        expect(percentDiff).toBeLessThan(1);
    });

    it('should have larger humidity effect at high temperatures', () => {
        // At high temperatures, saturation vapor pressure is high, so humidity effect is larger
        const dryResult = altitudeFromPressureDifference(101325, 89874, 0, 303.15); // 30°C dry
        const moistResult = altitudeFromPressureDifference(101325, 89874, 0, 303.15, 100); // 30°C, 100% RH
        
        // The difference should be noticeable (more than 1% of altitude)
        const percentDiff = ((moistResult - dryResult) / dryResult) * 100;
        expect(percentDiff).toBeGreaterThan(1);
    });

    it('should return same result with 0% humidity as with no humidity parameter', () => {
        // At 0% relative humidity, no water vapor is present, so result should match dry air
        const dryResult = altitudeFromPressureDifference(101325, 89874, 0, 288.15);
        const zeroHumidityResult = altitudeFromPressureDifference(101325, 89874, 0, 288.15, 0);
        
        // Results should be very close (within 0.01%)
        expect(zeroHumidityResult).toBeCloseTo(dryResult, 1);
    });

    it('should handle high altitude pressure differences with humidity', () => {
        // Sea level pressure: 101325 Pa, pressure at ~5000m: ~54020 Pa
        const dryResult = altitudeFromPressureDifference(101325, 54020, 0, 288.15);
        const moistResult = altitudeFromPressureDifference(101325, 54020, 0, 288.15, 60);
        
        // Moist air should give higher altitude
        expect(moistResult).toBeGreaterThan(dryResult);
        // The humidity effect at 60% RH at 15°C should add approximately 0.5% to altitude
        // Dry result is ~5305 m, moist result should be ~5333 m
        expect(moistResult).toBeCloseTo(5333, 0);
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

