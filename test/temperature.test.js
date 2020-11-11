const temperature = require('../temperature');
const assert = require('assert');

const KELVIN = 273.15;

describe("Temperature Unit Tests", function () {
    describe("Magnus formula", function () {
        it("it should equal", function () {
            //arrange
            const expected = 285.27;
            //act
            const actual = temperature.dewPointMagnusFormula(26.85 + KELVIN, 40);
            //assert
            assert.strictEqual(actual, expected);
        });
    });

    describe("Ardenbuck formula", function () {
        it("it should equal", function () {
            //arrange
            const actual = temperature.dewPointArdenBuckEquation(26.85 + KELVIN, 40);
            //act
            const expected = 285.09;
            //assert
            assert.strictEqual(actual, expected);
        });
    });

    describe("Wind Chill Index", function () {
        it("it should equal", function () {
            //arrange
            const expected = 265.50;
            //act
            const actual = temperature.windChillIndex(273.15, 12);
            //assert
            assert.strictEqual(actual, expected);
        });
    });

    describe("Australian apparant temperature", function () {
        it("it should equal", function () {
            //arrange
            const expected = 273.74;
            //act
            const actual = temperature.australianAapparentTemperature(10 + KELVIN, 40, 10);
            //assert
            assert.strictEqual(actual, expected);
        });
    });

    describe("Heat Index", function () {
        it("it should equal", function () {
            //arrange
            const expected = 308;
            //act
            const actual = temperature.heatIndex(31 + KELVIN, 60);
            //assert           
            assert.strictEqual(actual, expected);
        });
    });

    describe("Heat Index Text", function () {
        it("it should equal", function () {
            //arrange
            const expected = 33;
            //act
            const heatIndex = temperature.heatIndex(31 + KELVIN, 60);
            const actual = temperature.heatIndexText(heatIndex);
            //assert           
            assert.strictEqual(actual.lowerLimit, expected);
        });
    });

    describe("Humidex", function () {
        it("it should equal", function () {
            //arrange
            const expected = 313.77;
            //act
            const actual = temperature.humidex(31 + KELVIN, 60);
            //assert
            assert.strictEqual(actual, expected);
        });
    });

    describe("Humidex Text", function () {
        it("it should equal", function () {
            //arrange
            const expected = 40;
            //act
            const humidex = temperature.humidex(31 + KELVIN, 60);
            const actual = temperature.humidexText(humidex);
            //assert
            assert.strictEqual(actual.lowerLimit, expected);
        });
    });
});