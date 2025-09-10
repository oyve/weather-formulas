import { Reading } from "../../src/common";
import * as pressure from "../../src/formulas/pressure";
import * as temperature from "../../src/formulas/temperature"

describe('Pressure Tests', function() {
    describe('Pressure Altitude', function() {
        it('should calculate pressure altitude correctly', function() {
            //arrange
            const pressurePa = 90000; // Pa
            const expected = 988.0928355703854; // m
            //act
            const result = pressure.pressureAltitude(pressurePa);
            //assert
            expect(result).toEqual(expected);
        });
    });

    describe('Density Altitude', function() {
        it('should calculate density altitude correctly', function() {
            //arrange
            const pressureAlt = 1112.87; // m
            const kelvin = 293.15; // K
            const expected = 1712.87; // m
            //act
            const result = pressure.densityAltitude(pressureAlt, kelvin);
            //assert
            expect(result).toEqual(expected);
        });
    });

    describe('Barometric Formula', function() {
        it('should calculate Standard Sea Level Conditions', function() {
            //arrange
            const expected = 101325; // m
            //act
            const result = pressure.barometricFormula(0, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate 1000 m altitude', function() {
            //arrange
            const expected = 89874.46; // m
            //act
            const result = pressure.barometricFormula(1000, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate 5000 m altitude', function() {
            //arrange
            const expected = 54019.55; // m
            //act
            const result = pressure.barometricFormula(5000, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate 10000 m altitude', function() {
            //arrange
            const expected = 26435.89; // m
            //act
            const result = pressure.barometricFormula(10000, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate custom reference pressure (90000 at 1000m)', function() {
            //arrange
            const expected = 79722.31; // m
            //act
            const result = pressure.barometricFormula(2000, 90000, 1000, 285);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate custom negative pressure (below sea level)', function() {
            //arrange
            const expected = 107477.57; // m
            //act
            const result = pressure.barometricFormula(-500, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        // it('should calculate Isothermal Atmosphere (zero lapse rate)', function() {
        //     //arrange
        //     const c = { ...constants.DEFAULT_ATMOSPHERIC_CONSTANTS }; //make a copy do not alter existing
        //     c.lapseRate = 0;
        //     const expected = 107398.5; // m
        //     //act
        //     const result = pressure.barometricFormula(5000, 101325, 0, 288.15, c);
        //     //assert
        //     expect(result).toEqual(expected);
        // });
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
            //arrange
            const input = { pressure: 98000, altitude: 0, temperature: temperature.celciusToKelvin(30) };
            const expected = 98000;
            //act
            const result = pressure.adjustPressureToSeaLevelSimple(input.pressure, input.altitude, input.temperature);
            //assert
            expect(result).toEqual(expected);
        });
    });


    describe('Adjust Pressure To Sea Level Advanced', function() {
        it('should calculate pressure correctly', function() {
            //arrange
            const input = { pressure: 98000, altitude: 100 };
            const expected = 99167.5;
            //act
            const result = pressure.adjustPressureToSeaLevelAdvanced(input.pressure, input.altitude);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate pressure correctly with temperature', function() {
            //arrange
            const input = { pressure: 98000, altitude: 100, temperature: temperature.celciusToKelvin(30) };
            const expected = 99109.46;
            //act
            const result = pressure.adjustPressureToSeaLevelAdvanced(input.pressure, input.altitude, input.temperature);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate pressure correctly with only temperature', function() {
            //arrange
            const input = { pressure: 98000, altitude: 0, temperature: temperature.celciusToKelvin(30) };
            const expected = 98000;
            //act
            const result = pressure.adjustPressureToSeaLevelAdvanced(input.pressure, input.altitude, input.temperature);
            //assert
            expect(result).toEqual(expected);
        });
    });

    describe('Adjust Pressure To Sea Level With Historical Data', function() {
        it('should calculate correctly', function() {
            //arrange
            const readings: Reading[] = [
                { datetime: getTimeFromMinutes(-60*5), altitude: 0, temperature: 288.15 },
                { datetime: getTimeFromMinutes(-60*4), altitude: 200, temperature: 281.65 },
                { datetime: getTimeFromMinutes(-60*3), altitude: 600, temperature: 275.15 },
                { datetime: getTimeFromMinutes(-60*2), altitude: 800, temperature: 268.65 },
                { datetime: getTimeFromMinutes(-60*1), altitude: 1000, temperature: 262.15 },
            ]
            const expected = 113898;
            //act
            const actual = pressure.adjustPressureToSeaLevelByHistoricalData(101232, 1000, readings, 6);
            //assert
            expect(actual).toEqual(expected);
        });
    });
});

function getTimeFromMinutes(minutes: number) {
    let now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}