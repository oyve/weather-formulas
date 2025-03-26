import humidity from '../../src/formulas/humidity';
import temperature from '../../src/formulas/temperature';

describe("Humidity Tests", function () {
    describe('Relative Humidity', function() {
        it('should calculate relative humidity correctly', function() {
            const T = temperature.celciusToKelvin(20);
            const dewPoint = 283.15; // K
            const expectedRH = 52.54; // %
            const result = humidity.relativeHumidity(T, dewPoint);
            const actual = Math.round(result * 100) / 100;
            expect(actual).toEqual(expectedRH);
        });
    });

    describe('Absolute Humidity', function() {
        it('should calculate absolute humidity correctly', function() {
            const T = temperature.celciusToKelvin(20);
            const dewPoint = 283.15; // K
            const expectedRH = 58.629999999999995; // %
            const actual = humidity.absoluteHumidity(T, 5);
            expect(actual).toEqual(expectedRH);
        });
    });

    describe('Absolute Humidity by Relative Humidity', function() {
        it('should calculate absolute humidity by relative humidity correctly', function() {
            const RH = 50; // Relative Humidity in %
            const T = temperature.celciusToKelvin(25); // Temperature in Kelvin
            const expectedAH = 11.48; // Example expected value (g/m³) based on the corrected formula
            const result = humidity.absoluteHumidityByRelativeHumidity(RH, T);
            const actual = Math.round(result * 100) / 100;
            expect(actual).toEqual(expectedAH);
        });
    });

    describe('Mixing Ratio', function() {
        it('should calculate mixing ratio correctly', function() {
            const vaporPressure = 2339.21; // Pa
            const pressure = 101325; // Pa
            const expectedMixingRatio = 14.6989645685507; // g/kg
            const actual = humidity.mixingRatio(vaporPressure, pressure);
            expect(actual).toEqual(expectedMixingRatio);
        });
    });

    describe('Vapor Pressure', function() {
        it('should calculate vapor pressure correctly', function() {
            const T = temperature.celciusToKelvin(20);
            const expectedVaporPressure = 2336.95; // Pa
            const result = humidity.vaporPressure(T);
            const actual = Math.round(result * 100) / 100;
            expect(actual).toEqual(expectedVaporPressure);
        });
    });

    describe('Saturation Vapor Pressure', function() {
        it('should calculate saturation vapor pressure correctly', function() {
            const T = temperature.celciusToKelvin(20);
            const expectedVaporPressure = 2332.5960220978072; // Pa
            const actual = humidity.saturationVaporPressure(T);
            expect(actual).toEqual(expectedVaporPressure);
        });
    });

    describe('Specific Humidity', function() {
        it('should calculate specific humidity correctly', function() {
            const mixingRatio = 14.84; // g/kg
            const expectedSpecificHumidity = 0.9369; // kg/kg
            const result = humidity.specificHumidity(mixingRatio);
            const actual = Math.round(result * 10000) / 10000;
            expect(actual).toEqual(expectedSpecificHumidity);
        });
    });
});