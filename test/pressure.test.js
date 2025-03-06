const pressure = require('../pressure');
const assert = require('assert');

describe('Pressure Tests', function() {
    describe('Pressure Altitude', function() {
        it('should calculate pressure altitude correctly', function() {
            const pressurePa = 90000; // Pa
            const expectedAltitude = 988.0928355703854; // m
            const result = pressure.pressureAltitude(pressurePa);
            assert.strictEqual(result, expectedAltitude);
        });
    });

    describe('Density Altitude', function() {
        it('should calculate density altitude correctly', function() {
            const pressureAlt = 1112.87; // m
            const kelvin = 293.15; // K
            const expectedDensityAlt = 1712.87; // m
            const result = pressure.densityAltitude(pressureAlt, kelvin);
            assert.strictEqual(result, expectedDensityAlt);
        });
    });
});
