import { Reading } from '../../src/common';
import temperatureFormulas from '../../src/formulas/temperature';

const KELVIN = 273.15;

describe("Temperature Tests", function () {
    describe("Magnus formula", function () {
        it("it should equal", function () {
            //arrange
            const expected = 285.27;
            //act
            const actual = temperatureFormulas.dewPointMagnusFormula(26.85 + KELVIN, 40);
            //assert
            expect(actual).toEqual(expected);
        });

        it("it should equal with defined valuation set", function () {
            //arrange
            const expected = 285.72;
            const valuationSet = temperatureFormulas.DEW_POINT_VALUATIONS.DAVID_BOLTON;
            //act
            const actual = temperatureFormulas.dewPointMagnusFormula(26.85 + KELVIN, 40, valuationSet);
            //assert
            expect(actual).toEqual(expected);
        });

        it("it should equal with own custom defined valuation set", function () {
            //arrange
            const expected = 284.41;
            const valuationSet =  { a: 6, b: 17, c: 250, d: 234.5 }; //these values are made up for the sake of testing
            //act
            const actual = temperatureFormulas.dewPointMagnusFormula(26.85 + KELVIN, 40, valuationSet);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe("Ardenbuck formula", function () {
        it("it should equal", function () {
            //arrange
            const expected = 285.09;
            //act
            const actual = temperatureFormulas.dewPointArdenBuckEquation(26.85 + KELVIN, 40);
            //assert
            expect(actual).toEqual(expected);
        });

        it("it should equal", function () {
            //arrange
            const expected = 285.55;
            const valuationSet = temperatureFormulas.DEW_POINT_VALUATIONS.DAVID_BOLTON;
            //act
            const actual = temperatureFormulas.dewPointArdenBuckEquation(26.85 + KELVIN, 40, valuationSet);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe("Wind Chill Index", function () {
        it("it should equal", function () {
            //arrange
            const expected = 265.50;
            //act
            const actual = temperatureFormulas.windChillIndex(273.15, 12);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe("Australian apparant temperature", function () {
        it("it should equal", function () {
            //arrange
            const expected = 273.74;
            //act
            const actual = temperatureFormulas.australianAapparentTemperature(10 + KELVIN, 40, 10);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe("Heat Index", function () {
        it("it should equal", function () {
            //arrange
            const expected = 308;
            //act
            const actual = temperatureFormulas.heatIndex(31 + KELVIN, 60);
            //assert           
            expect(actual).toEqual(expected);
        });
    });

    describe("Heat Index Text", function () {
        it("it should equal", function () {
            //arrange
            const expected = 33;
            //act
            const heatIndex = temperatureFormulas.heatIndex(31 + KELVIN, 60);
            const actual = temperatureFormulas.heatIndexText(heatIndex);
            //assert           
            expect(actual?.lowerLimit).toEqual(expected);
        });
    });

    describe("Humidex", function () {
        it("it should equal", function () {
            //arrange
            const expected = 313.77;
            //act
            const actual = temperatureFormulas.humidex(31 + KELVIN, 60);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe("Humidex Text", function () {
        it("it should equal", function () {
            //arrange
            const expected = 40;
            //act
            const humidex = temperatureFormulas.humidex(31 + KELVIN, 60);
            const actual = temperatureFormulas.humidexText(humidex);
            //assert
            expect(actual?.lowerLimit).toEqual(expected);
        });
    });

    describe('Potential Temperature', function() {
        it('should calculate potential temperature correctly', function() {
            const kelvin = 293.15; // K
            const pressure = 90000; // Pa
            const expectedPotentialTemp = 302.11795811169407; // K
            const result = temperatureFormulas.potentialTemperature(kelvin, pressure);
            expect(result).toEqual(expectedPotentialTemp);
        });
    });

    describe('Virtual Temperature', function() {
        it('should calculate virtual temperature correctly', function() {
            const kelvin = 293.15; // K
            const mixingRatio = 14.84; // g/kg
            const expectedVirtualTemp = 295.80371106; // K
            const result = temperatureFormulas.virtualTemperature(kelvin, mixingRatio);
            expect(result).toEqual(expectedVirtualTemp);
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
            const actual = temperatureFormulas.isTemperatureInversion(A1, T1, A2, T2);
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
            const actual = temperatureFormulas.isTemperatureInversion(A1, T1, A2, T2);
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
            const actual = temperatureFormulas.calculateLapseRate(A1, T1, A2, T2);
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
            const actual = temperatureFormulas.calculateDynamicLapseRate(readings, 12);
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
            const actual = temperatureFormulas.calculateDynamicLapseRate(readings, 12);
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
            const actual = temperatureFormulas.calculateDynamicLapseRate(readings, 3);
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
            const actual = temperatureFormulas.calculateWeightedAverageTemperature(readings, 6);
            //assert
            expect(actual).toEqual(expected);
        });
    });

    describe('Adjust Temperature By Lapse Rate', function() {
        it('should be the same', function() {
            //arrange
            const temperature = 20;
            const altitude = 0;
            const expected = 20;
            //act
            const actual = temperatureFormulas.adjustTemperatureByLapseRate(altitude, temperature);
            //assert
            expect(actual).toEqual(expected);
        });
        it('should calculate lapse rate correctly', function() {
            //arrange
            const temperature = 20;
            const altitude = 1000;
            const expected = 26.5;
            //act
            const actual = temperatureFormulas.adjustTemperatureByLapseRate(altitude, temperature);
            //assert
            expect(actual).toEqual(expected);
        });
        it('should calculate with a custom lapse rate', function() {
            //assert
            const temperature = 20;
            const altitude = 1000;
            const expected = 25;
            //act
            const actual = temperatureFormulas.adjustTemperatureByLapseRate(altitude, temperature, 0.005);
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