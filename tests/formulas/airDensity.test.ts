import * as airDensityFormulas from '../../src/formulas/airDensity';

describe('Air Density Dry Air Calculation', () => {
    it('should calculate air density with very low temperature', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 253.15; // Very low temperature in Kelvin (-20°C)

        // Act
        const airDensity = airDensityFormulas.airDensityDryAir(pressure, temperature);

        // Assert
        expect(airDensity).toBeCloseTo(1.3946, 3); // Approximate air density at low temperature
    });
});

describe('Air Density Moist Air Calculation', () => {
    it('should calculate air density at sea level with standard conditions', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 288.15; // Standard temperature in Kelvin (15°C)
        const humidity = 50; // 50% relative humidity

        // Act
        const airDensity = airDensityFormulas.airDensityMoistAir(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.2289, 3); // Standard air density at sea level
    });

    it('should calculate air density at high altitude with low pressure', () => {
        // Arrange
        const pressure = 80000; // Reduced pressure at high altitude in Pascals
        const temperature = 275.15; // Lower temperature in Kelvin (2°C)
        const humidity = 30; // 30% relative humidity

        // Act
        const airDensity = airDensityFormulas.airDensityMoistAir(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.0139, 3); // Approximate air density at 2000m
    });

    it('should calculate air density with high humidity', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 298.15; // Higher temperature in Kelvin (25°C)
        const humidity = 90; // 90% relative humidity

        // Act
        const airDensity = airDensityFormulas.airDensityMoistAir(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.1969, 3); // Approximate air density with high humidity
    });
    it('should calculate air density with zero humidity', () => {
        // Arrange
        const pressure = 101325; // Standard atmospheric pressure in Pascals
        const temperature = 288.15; // Standard temperature in Kelvin (15°C)
        const humidity = 0; // 0% relative humidity

        // Act
        const airDensity = airDensityFormulas.airDensityMoistAir(pressure, temperature, humidity);

        // Assert
        expect(airDensity).toBeCloseTo(1.225, 3); // Air density should match dry air conditions
    });
});

describe('Air Density At Altitude Calculation', () => {
    it('should calculate air density at 1000 m altitude from sea level', () => {
        // Arrange
        const referenceDensity = 1.225; // Standard air density at sea level in kg/m³
        const altitudeDifference = 1000; // Altitude difference in meters (1 km)

        // Act
        const actual = airDensityFormulas.airDensityAtAltitude(referenceDensity, altitudeDifference);

        // Assert
        expect(actual).toBeCloseTo(1.379, 3);
    });

    it('should calculate air density at sea level from 1000 m altitude', () => {
        // Arrange
        const referenceDensity = 1.379; // Air density at 1000 m in kg/m³
        const altitudeDifference = -1000; // Altitude difference in meters (-1 km)

        // Act
        const actual = airDensityFormulas.airDensityAtAltitude(referenceDensity, altitudeDifference);

        // Assert
        expect(actual).toBeCloseTo(1.225, 3);
    });

    it('should calculate air density with custom constant', () => {
        // Arrange
        
        const referenceDensity = 1.379; // Air density at 1000 m in kg/m³
        const altitudeDifference = -1000; // Altitude difference in meters (-1 km)
        
        const decayConstant = airDensityFormulas.decayConstant(284.74);

        // Act
        const actual = airDensityFormulas.airDensityAtAltitude(referenceDensity, altitudeDifference, decayConstant);

        // Assert
        expect(actual).toBeCloseTo(1.555, 3);
    });
});

describe('Decay Constant calculations', () => {
    it('should calculate decay constant at sea level', () => {
        const actual = airDensityFormulas.decayConstant(288.15);

        expect(actual).toBeCloseTo(0.00011856, 8);
    });
});
