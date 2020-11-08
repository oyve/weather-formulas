const sun = require('../sun');
const assert = require('assert');

const year = 2020; month = 11;  day = 5;
const lat = 15.870039; lng = -61.586608;

describe("Sun - Integration Tests", function () {
    describe("Sunrise", function () {
        it("it should equal", function () {
            //arrange
            const expected = new Date(Date.UTC(year, month, day, 6, 4, 56));
            //const expected = new Date(year, month, day, 6, 4, 56);
            //act
            const solarEvents = sun.calculate(year, month, day, lat, lng, -4);
            const actual = solarEvents.sunrise;
            //assert
            assert.strictEqual(actual.toISOString(), expected.toISOString());
        });
    });

    describe("Sunset", function () {
        it("it should equal", function () {
            //arrange
            const expected = new Date(Date.UTC(year, month, day, 17, 34, 53));
            //const expected = new Date(year, month, day, 17, 34, 53);
            //act
            const solarEvents = sun.calculate(year, month, day, lat, lng, -4);
            const actual = solarEvents.sunset;
            //assert
            assert.strictEqual(actual.toISOString(), expected.toISOString());
        });
    });

    describe("Solar Noon", function () {
        it("it should equal", function () {
            //arrange
            const expected = new Date(Date.UTC(year, month, day, 11, 49, 54));
            //const expected = new Date(year, month, day, 11, 49, 54);
            //act
            const solarEvents = sun.calculate(year, month, day, lat, lng, -4);
            const actual = solarEvents.solarnoon;
            //assert
            assert.strictEqual(actual.toISOString(), expected.toISOString());
        });
    });
});