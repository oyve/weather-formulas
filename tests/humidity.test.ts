import humidity from '../src/humidity';

describe("Humidity Tests", function () {
    describe('Relative Humidity', function() {
        it('should calculate relative humidity correctly', function() {
            const temperature = 293.15; // K
            const dewPoint = 283.15; // K
            const expectedRH = 52.54; // %
            const result = humidity.relativeHumidity(temperature, dewPoint);
            const actual = Math.round(result * 100) / 100;
            expect(actual).toEqual(expectedRH);
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
            const temperature = 293.15; // K
            const expectedVaporPressure = 2336.95; // Pa
            const result = humidity.vaporPressure(temperature);
            const actual = Math.round(result * 100) / 100;
            expect(actual).toEqual(expectedVaporPressure);
        });
    });

    describe('Saturation Vapor Pressure', function() {
        it('should calculate saturation vapor pressure correctly', function() {
            const kelvin = 293.15; // K
            const expectedVaporPressure = 2332.5960220978072; // Pa
            const actual = humidity.saturationVaporPressure(kelvin);
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