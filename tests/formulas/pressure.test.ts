import pressure from "../../src/formulas/pressure";
import temperature from "../../src/formulas/temperature"

describe('Pressure Tests', function() {
    describe('Pressure Altitude', function() {
        it('should calculate pressure altitude correctly', function() {
            const pressurePa = 90000; // Pa
            const expected = 988.0928355703854; // m
            const result = pressure.pressureAltitude(pressurePa);
            expect(result).toEqual(expected);
        });
    });

    describe('Density Altitude', function() {
        it('should calculate density altitude correctly', function() {
            const pressureAlt = 1112.87; // m
            const kelvin = 293.15; // K
            const expected = 1712.87; // m
            const result = pressure.densityAltitude(pressureAlt, kelvin);
            expect(result).toEqual(expected);
        });
    });

    describe('Adjust Pressure To Sea Level Simple', function() {
        it('should calculate pressure correctly', function() {
            const input = { pressure: 98000, altitude: 100 };
            const expected = 99167.73;
            const result = pressure.adjustPressureToSeaLevelSimple(input.pressure, input.altitude);
            expect(result).toEqual(expected);
        });
        it('should calculate pressure correctly with temperature', function() {
            const input = { pressure: 98000, altitude: 100, temperature: temperature.celciusToKelvin(30) };
            const expected = 99109.69;
            const result = pressure.adjustPressureToSeaLevelSimple(input.pressure, input.altitude, input.temperature);
            expect(result).toEqual(expected);
        });
        it('should calculate pressure correctly with only temperature', function() {
            const input = { pressure: 98000, altitude: 0, temperature: temperature.celciusToKelvin(30) };
            const expected = 98000;
            const result = pressure.adjustPressureToSeaLevelSimple(input.pressure, input.altitude, input.temperature);
            expect(result).toEqual(expected);
        });
    });

    describe('Adjust Pressure To Sea Level Advanced', function() {
        it('should calculate pressure correctly', function() {
            const input = { pressure: 98000, altitude: 100 };
            const expected = 96843.69;
            const result = pressure.adjustPressureToSeaLevelAdvanced(input.pressure, input.altitude);
            expect(result).toEqual(expected);
        });
        it('should calculate pressure correctly with temperature', function() {
            const input = { pressure: 98000, altitude: 100, temperature: temperature.celciusToKelvin(30) };
            const expected = 96900.65;
            const result = pressure.adjustPressureToSeaLevelAdvanced(input.pressure, input.altitude, input.temperature);
            expect(result).toEqual(expected);
        });
        it('should calculate pressure correctly with only temperature', function() {
            const input = { pressure: 98000, altitude: 0, temperature: temperature.celciusToKelvin(30) };
            const expected = 98000;
            const result = pressure.adjustPressureToSeaLevelAdvanced(input.pressure, input.altitude, input.temperature);
            expect(result).toEqual(expected);
        });
    });
});
