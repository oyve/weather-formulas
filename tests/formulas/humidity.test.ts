import * as humidity from '../../src/formulas/humidity';
import * as temperature from '../../src/formulas/temperature';

describe("Humidity Tests", function () {
    describe('Relative Humidity', function () {
        it('should calculate relative humidity correctly', function () {
            // Arrange
            const T = temperature.celciusToKelvin(20);
            const dewPoint = 283.15; // K
            const expectedRH = 52.54; // %

            // Act
            const result = humidity.relativeHumidity(T, dewPoint);
            const actual = Math.round(result * 100) / 100;

            // Assert
            expect(actual).toEqual(expectedRH);
        });
    });

    describe('Absolute Humidity', function () {
        it('should calculate absolute humidity correctly', function () {
            // Arrange
            const T = temperature.celciusToKelvin(20);
            const dewPoint = 283.15; // K
            const expectedRH = 58.63; // %

            // Act
            const actual = humidity.absoluteHumidity(T, 5);

            // Assert
            expect(actual).toBeCloseTo(expectedRH, 2);
        });
    });

    describe('Absolute Humidity by Relative Humidity', function () {
        it('should calculate absolute humidity by relative humidity correctly', function () {
            // Arrange
            const RH = 50; // Relative Humidity in %
            const T = temperature.celciusToKelvin(25); // Temperature in Kelvin
            const expectedAH = 11.48; // g/m³

            // Act
            const result = humidity.absoluteHumidityByRelativeHumidity(RH, T);
            const actual = Math.round(result * 100) / 100;

            // Assert
            expect(actual).toEqual(expectedAH);
        });
    });

    describe('Mixing Ratio', function () {
        it('should calculate mixing ratio correctly', function () {
            // Arrange
            const vaporPressure = 2339.21; // Pa
            const pressure = 101325; // Pa
            const expectedMixingRatio = 14.6989645685507; // g/kg

            // Act
            const actual = humidity.mixingRatio(vaporPressure, pressure);

            // Assert
            expect(actual).toEqual(expectedMixingRatio);
        });
    });

    describe('Vapor Pressure', function () {
        it('should calculate vapor pressure correctly', function () {
            // Arrange
            const T = temperature.celciusToKelvin(20);
            const expectedVaporPressure = 2336.95; // Pa

            // Act
            const result = humidity.vaporPressure(T);
            const actual = Math.round(result * 100) / 100;

            // Assert
            expect(actual).toEqual(expectedVaporPressure);
        });
    });

    describe('Saturation Vapor Pressure', function () {
        it('should calculate saturation vapor pressure correctly', function () {
            // Arrange
            const T = temperature.celciusToKelvin(20);
            const expectedVaporPressure = 2332.60; // Pa

            // Act
            const actual = humidity.saturationVaporPressure(T);

            // Assert
            expect(actual).toBeCloseTo(expectedVaporPressure, 2);
        });
    });

    describe('Specific Humidity', function () {
        it('should calculate specific humidity correctly', function () {
            // Arrange
            const mixingRatio = 14.84; // g/kg
            const expectedSpecificHumidity = 0.9369; // kg/kg

            // Act
            const result = humidity.specificHumidity(mixingRatio);
            const actual = Math.round(result * 10000) / 10000;

            // Assert
            expect(actual).toEqual(expectedSpecificHumidity);
        });
    });

    describe('Actual Vapor Pressure', function () {
        it('should calculate actual vapor pressure correctly', function () {
            // Arrange
            const saturationVaporPressure = 2338; // Pa
            const relativeHumidity = 50; // %
            const expectedActualVaporPressure = 1169; // Pa

            // Act
            const actual = humidity.actualVaporPressure(saturationVaporPressure, relativeHumidity);

            // Assert
            expect(actual).toEqual(expectedActualVaporPressure);
        });
    });

    describe('Specific Gas Constant for Moist Air', function () {
        it('should calculate specific gas constant for moist air correctly', function () {
            // Arrange
            const mixingRatio = 0.01; // kg/kg
            const expectedSpecificGasConstant = 285.32; // J/(kg·K)

            // Act
            const actual = humidity.specificGasConstantForMoistAir(mixingRatio);

            // Assert
            expect(actual).toBeCloseTo(expectedSpecificGasConstant, 2);
        });

        it('should calculate specific gas constant for dry air correctly (mixing ratio = 0)', function () {
            // Arrange
            const mixingRatio = 0; // kg/kg
            const expectedSpecificGasConstant = 287.06; // J/(kg·K)

            // Act
            const actual = humidity.specificGasConstantForMoistAir(mixingRatio);

            // Assert
            expect(actual).toBeCloseTo(expectedSpecificGasConstant, 2);
        });
    });

    describe('Lifting Condensation Level', function () {
        it('should calculate lifting condensation level correctly', function () {
            // Arrange
            const temperature = 293.15; // K (20°C)
            const dewPoint = 283.15; // K (10°C)
            const expectedLCL = 1247; // meters (10 K * 124.7)

            // Act
            const actual = humidity.liftingCondensationLevel(temperature, dewPoint);

            // Assert
            expect(actual).toBeCloseTo(expectedLCL, 2);
        });

        it('should handle small temperature-dewpoint spread', function () {
            // Arrange
            const temperature = 288.15; // K (15°C)
            const dewPoint = 286.15; // K (13°C)
            const expectedLCL = 249.4; // meters (2 K * 124.7)

            // Act
            const actual = humidity.liftingCondensationLevel(temperature, dewPoint);

            // Assert
            expect(actual).toBeCloseTo(expectedLCL, 2);
        });

        it('should handle zero spread (saturated air)', function () {
            // Arrange
            const temperature = 293.15; // K (20°C)
            const dewPoint = 293.15; // K (20°C)
            const expectedLCL = 0; // meters (0 K * 124.7)

            // Act
            const actual = humidity.liftingCondensationLevel(temperature, dewPoint);

            // Assert
            expect(actual).toBeCloseTo(expectedLCL, 2);
        });

        it('should throw error when dew point is greater than temperature', function () {
            // Arrange
            const temperature = 288.15; // K (15°C)
            const dewPoint = 293.15; // K (20°C)

            // Act & Assert
            expect(() => humidity.liftingCondensationLevel(temperature, dewPoint))
                .toThrow("Dew point cannot be greater than temperature.");
        });
    });
});