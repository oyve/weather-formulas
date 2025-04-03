import constants from "../../src/constants";
import pressure, { Reading } from "../../src/formulas/pressure";
import temperature from "../../src/formulas/temperature"

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
            const result = pressure.barometricPressure(0, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate 1000 m altitude', function() {
            //arrange
            const expected = 89874.46; // m
            //act
            const result = pressure.barometricPressure(1000, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate 5000 m altitude', function() {
            //arrange
            const expected = 54019.55; // m
            //act
            const result = pressure.barometricPressure(5000, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate 10000 m altitude', function() {
            //arrange
            const expected = 26435.89; // m
            //act
            const result = pressure.barometricPressure(10000, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate custom reference pressure (90000 at 1000m)', function() {
            //arrange
            const expected = 79722.31; // m
            //act
            const result = pressure.barometricPressure(2000, 90000, 1000, 285);
            //assert
            expect(result).toEqual(expected);
        });
        it('should calculate custom negative pressure (below sea level)', function() {
            //arrange
            const expected = 107477.57; // m
            //act
            const result = pressure.barometricPressure(-500, 101325, 0, 288.15);
            //assert
            expect(result).toEqual(expected);
        });
        // it('should calculate Isothermal Atmosphere (zero lapse rate)', function() {
        //     //arrange
        //     const c = { ...constants.DEFAULT_ATMOSPHERIC_CONSTANTS }; //make a copy do not alter existing
        //     c.lapseRate = 0;
        //     const expected = 107398.5; // m
        //     //act
        //     const result = pressure.barometricPressure(5000, 101325, 0, 288.15, c);
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

    describe('isTemperatureInversion', function() {
        it('should be no inversion', function() {
            //arrange
            const A1 = 1000;
            const T1 = 290; //K
            const A2 = 2000;
            const T2 = 280; //K
            const expected = false;
            //act
            const actual = pressure.isTemperatureInversion(A1, T1, A2, T2);
            //assert
            expect(actual).toEqual(expected);
        });
        it('should be inversion', function() {
            //arrange
            const A1 = 2000;
            const T1 = 290; //K
            const A2 = 1000;
            const T2 = 280; //K
            const expected = true;
            //act
            const actual = pressure.isTemperatureInversion(A1, T1, A2, T2);
            //assert
            expect(actual).toEqual(expected);
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

    describe('Adjust To Sea Level By Lapse Rate', function() {
        it('should be the same', function() {
            //arrange
            const temperature = 20;
            const altitude = 0;
            const expected = 20;
            //act
            const actual = pressure.adjustPressureToSeaLevelByLapseRate(altitude, temperature);
            //assert
            expect(actual).toEqual(expected);
        });
        it('should calculate lapse rate correctly', function() {
            //arrange
            const temperature = 20;
            const altitude = 1000;
            const expected = 26.5;
            //act
            const actual = pressure.adjustPressureToSeaLevelByLapseRate(altitude, temperature);
            //assert
            expect(actual).toEqual(expected);
        });
        it('should calculate with a custom lapse rate', function() {
            //assert
            const temperature = 20;
            const altitude = 1000;
            const expected = 25;
            //act
            const actual = pressure.adjustPressureToSeaLevelByLapseRate(altitude, temperature, 0.005);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe('Calculate Lapse Rate', function() {
        it('should calculate lapse rate correctly', function() {
            //arrange
            const A1 = 1000;
            const T1 = 290;
            const A2 = 2000
            const T2 = 280;
            const expected = -0.01;
            //act
            const actual = pressure.calculateLapseRate(A1, T1, A2, T2);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe('Calculate Dynamic Lapse Rate', function() {
        it('should calculate dynamic lapse rate correctly', function() {
            //arrange
            const readings: Reading[] = [
                { datetime: getTimeFromMinutes(-60*5), altitude: 0, temperature: 25 },
                { datetime: getTimeFromMinutes(-60*4), altitude: 50, temperature: 22 },
                { datetime: getTimeFromMinutes(-60*3), altitude: 100, temperature: 18 },
                { datetime: getTimeFromMinutes(-60*2), altitude: 200, temperature: 15 },
                { datetime: getTimeFromMinutes(-60*1), altitude: 300, temperature: 12 },
            ]
            const expected = -0.05;
            //act
            const actual = pressure.calculateDynamicLapseRate(readings, 12);
            //assert
            expect(actual).toEqual(expected);
        });
        it('should equal standard lapse rate correctly', function() {
            //arrange
            const readings: Reading[] = [
                { datetime: getTimeFromMinutes(-60*5), altitude: 0, temperature: 288.15 },
                { datetime: getTimeFromMinutes(-60*4), altitude: 1000, temperature: 281.65 },
                { datetime: getTimeFromMinutes(-60*3), altitude: 2000, temperature: 275.15 },
                { datetime: getTimeFromMinutes(-60*2), altitude: 3000, temperature: 268.65 },
                { datetime: getTimeFromMinutes(-60*1), altitude: 4000, temperature: 262.15 },
            ]
            const expected = -0.0065;
            //act
            const actual = pressure.calculateDynamicLapseRate(readings, 12);
            //assert
            expect(actual).toEqual(expected);
        });
        it('should equal cut off hours correctly', function() {
            //arrange
            const readings: Reading[] = [
                { datetime: getTimeFromMinutes(-60*5), altitude: 0, temperature: 10 },
                { datetime: getTimeFromMinutes(-60*4), altitude: 5, temperature: 20 }, //cut off these two
                { datetime: getTimeFromMinutes(-60*3), altitude: 2000, temperature: 275.15 },
                { datetime: getTimeFromMinutes(-60*2), altitude: 3000, temperature: 268.65 },
                { datetime: getTimeFromMinutes(-60*1), altitude: 4000, temperature: 262.15 },
            ]
            const expected = -0.0065;
            //act
            const actual = pressure.calculateDynamicLapseRate(readings, 3);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe('Calculate Weighted Average Temperature', function() {
        it('should calculate correctly', function() {
            //arrange
            const readings: Reading[] = [
                { datetime: getTimeFromMinutes(-60*5), altitude: 0, temperature: 288.15 },
                { datetime: getTimeFromMinutes(-60*4), altitude: 1000, temperature: 281.65 },
                { datetime: getTimeFromMinutes(-60*3), altitude: 2000, temperature: 275.15 },
                { datetime: getTimeFromMinutes(-60*2), altitude: 3000, temperature: 268.65 },
                { datetime: getTimeFromMinutes(-60*1), altitude: 4000, temperature: 262.15 },
            ]
            const expected = 275.15;
            //act
            const actual = pressure.calculateWeightedAverageTemperature(readings, 6);
            //assert
            expect(actual).toEqual(expected);
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