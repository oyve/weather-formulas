import * as heatIndexScale from "../../src/indices/heatIndex"
import * as c from '../../src/constants';

describe('Heat Index Tests', function() {
    describe("Heat Index", function () {
        it("it should equal", function () {
            //arrange
            const expected = 308;
            //act
            const actual = heatIndexScale.heatIndex(31 + c.CELSIUS_TO_KELVIN, 60);
            //assert           
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe("Heat Index Text", function () {
        it("it should equal", function () {
            //arrange
            const expected = 33;
            //act
            const heatIndex = heatIndexScale.heatIndex(31 + c.CELSIUS_TO_KELVIN, 60);
            const actual = heatIndexScale.heatIndexCategory(heatIndex);
            //assert           
            expect(actual?.lowerLimit).toEqual(expected);
        });
    });
});