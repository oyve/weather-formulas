import { Reading } from '../../src/common';
import * as temperatureFormulas from '../../src/formulas/temperature';
import * as c from '../../src/constants';

describe("Temperature Tests", function () {
    describe("Magnus formula", function () {
        it("it should equal", function () {
            //arrange
            const expected = 285.720988;
            //act
            const actual = temperatureFormulas.dewPointMagnusFormula(26.85 + c.CELSIUS_TO_KELVIN, 40);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });

        it("it should equal with defined valuation set", function () {
            //arrange
            const expected = 285.72;
            const valuationSet = c.DEW_POINT_VALUATIONS.DAVID_BOLTON;
            //act
            const actual = temperatureFormulas.dewPointMagnusFormula(26.85 + c.CELSIUS_TO_KELVIN, 40, valuationSet);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });

        it("it should equal with own custom defined valuation set", function () {
            //arrange
            const expected = 284.41;
            const valuationSet =  { a: 6, b: 17, c: 250, d: 234.5 }; //these values are made up for the sake of testing
            //act
            const actual = temperatureFormulas.dewPointMagnusFormula(26.85 + c.CELSIUS_TO_KELVIN, 40, valuationSet);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe("Ardenbuck formula", function () {
        it("it should equal", function () {
            //arrange
            const expected = 285.5478;
            //act
            const actual = temperatureFormulas.dewPointArdenBuckEquation(26.85 + c.CELSIUS_TO_KELVIN, 40);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });

        it("it should equal", function () {
            //arrange
            const expected = 285.55;
            const valuationSet = c.DEW_POINT_VALUATIONS.DAVID_BOLTON;
            //act
            const actual = temperatureFormulas.dewPointArdenBuckEquation(26.85 + c.CELSIUS_TO_KELVIN, 40, valuationSet);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe("Wind Chill Index", function () {
        it("it should equal", function () {
            //arrange
            const expected = 265.50;
            //act
            const actual = temperatureFormulas.windChillIndex(273.15, 12);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe("Australian apparant temperature", function () {
        it("it should equal", function () {
            //arrange
            const expected = 273.7682885;
            //act   
            const actual = temperatureFormulas.australianApparentTemperature(10 + c.CELSIUS_TO_KELVIN, 40, 10);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe("Humidex", function () {
        it("it should equal", function () {
            //arrange
            const expected = 314.021198;
            //act
            const actual = temperatureFormulas.humidex(31 + c.CELSIUS_TO_KELVIN, 60);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe("Humidex Text", function () {
        it("it should equal", function () {
            //arrange
            const expected = 40;
            //act
            const humidex = temperatureFormulas.humidex(31 + c.CELSIUS_TO_KELVIN, 60);
            const actual = temperatureFormulas.humidexText(humidex);
            //assert
            expect(actual?.lowerLimit).toEqual(expected);
        });
    });

    describe('Equivalent Temperature', function() {
        it('should calculate equivalent temperature correctly for typical values', function() {
            // Arrange
            const temperature = 293.15; // 20°C in Kelvin
            const mixingRatio = 0.01;   // 0.01 kg/kg
            // Act
            const result = temperatureFormulas.equivalentTemperature(temperature, mixingRatio);
            // Expected value calculated externally: ≈ 320.36 K
            expect(result).toBeCloseTo(318.0503984, 2);
        });

        it('should return the same temperature for zero mixing ratio', function() {
            const temperature = 293.15;
            const mixingRatio = 0;
            const result = temperatureFormulas.equivalentTemperature(temperature, mixingRatio);
            expect(result).toBeCloseTo(293.15, 2);
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

    
    describe('Wet Bulb Temperature', function() {
        it('should calculate correctly', function() {
            //arrange
            const temperature = temperatureFormulas.celciusToKelvin(25); // 25°C in Kelvin
            const humidity = 60; // 60% relative humidity
            const expected = 292.65; // Expected wet bulb temperature in Kelvin (approx. 19.0°C)
            //act
            const actual = temperatureFormulas.wetBulbTemperature(temperature, humidity);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

});

function getTimeFromMinutes(minutes: number) {
    let now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}