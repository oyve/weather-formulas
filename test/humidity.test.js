const humidity = require('../humidity');
const assert = require('assert');

describe("Humidity Tests", function () {
    describe('Relative Humidity', function() {
        it('should calculate relative humidity correctly', function() {
            const temperature = 293.15; // K
            const dewPoint = 283.15; // K
            const expectedRH = 52.54; // %
            const result = humidity.relativeHumidity(temperature, dewPoint);
            assert.strictEqual(Math.round(result * 100) / 100, expectedRH);
        });
    });

    describe('Mixing Ratio', function() {
        it('should calculate mixing ratio correctly', function() {
            const vaporPressure = 2339.21; // Pa
            const pressure = 101325; // Pa
            const expectedMixingRatio = 14.6989645685507; // g/kg
            const result = humidity.mixingRatio(vaporPressure, pressure);
            assert.strictEqual(result, expectedMixingRatio);
        });
    });

    describe('Vapor Pressure', function() {
        it('should calculate vapor pressure correctly', function() {
            const temperature = 293.15; // K
            const expectedVaporPressure = 2336.95; // Pa
            const result = humidity.vaporPressure(temperature);
            assert.strictEqual(Math.round(result * 100) / 100, expectedVaporPressure);
        });
    });

    describe('Saturation Vapor Pressure', function() {
        it('should calculate saturation vapor pressure correctly', function() {
            const kelvin = 293.15; // K
            const expectedVaporPressure = 2332.5960220978072; // Pa
            const result = humidity.saturationVaporPressure(kelvin);
            assert.strictEqual(result, expectedVaporPressure);
        });
    });

    describe('Specific Humidity', function() {
        it('should calculate specific humidity correctly', function() {
            const mixingRatio = 14.84; // g/kg
            const expectedSpecificHumidity = 0.9369; // kg/kg
            const result = humidity.specificHumidity(mixingRatio);
            assert.strictEqual(Math.round(result * 10000) / 10000, expectedSpecificHumidity);
        });
    });
});