import * as airDensityFormulas from '../../src/formulas/airDensity';

describe('Air Density Calculation', () => {
    it('should calculate air density at sea level with standard conditions', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 288.15; // Standard temperature in Kelvin (15°C)
        const humidity = 50; // 50% relative humidity

        // Act
        const airDensity = airDensityFormulas.calculateAirDensity(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.2289, 3); // Standard air density at sea level
    });

    it('should calculate air density at high altitude with low pressure', () => {
        // Arrange
        const pressure = 80000; // Reduced pressure at high altitude in Pascals
        const temperature = 275.15; // Lower temperature in Kelvin (2°C)
        const humidity = 30; // 30% relative humidity

        // Act
        const airDensity = airDensityFormulas.calculateAirDensity(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.0139, 3); // Approximate air density at 2000m
    });

    it('should calculate air density with high humidity', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 298.15; // Higher temperature in Kelvin (25°C)
        const humidity = 90; // 90% relative humidity

        // Act
        const airDensity = airDensityFormulas.calculateAirDensity(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.1969, 3); // Approximate air density with high humidity
    });

    it('should calculate air density with very low temperature', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 253.15; // Very low temperature in Kelvin (-20°C)
        const humidity = 40; // 40% relative humidity

        // Act
        const airDensity = airDensityFormulas.calculateAirDensity(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.3946, 3); // Approximate air density at low temperature
    });

    it('should calculate air density with zero humidity', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 288.15; // Standard temperature in Kelvin (15°C)
        const humidity = 0; // 0% relative humidity

        // Act
        const airDensity = airDensityFormulas.calculateAirDensity(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.225, 3); // Air density should match dry air conditions
    });
});