import * as humidexScale from "../../src/indices/humidex"
import * as c from '../../src/constants';


describe('Heat Index Tests', function() {
    describe("Humidex", function () {
        it("it should equal", function () {
            //arrange
            const expected = 314.021198;
            //act
            const actual = humidexScale.humidex(31 + c.CELSIUS_TO_KELVIN, 60);
            //assert
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe("Humidex Text", function () {
        it("it should equal", function () {
            //arrange
            const expected = 40;
            //act
            const humidex = humidexScale.humidex(31 + c.CELSIUS_TO_KELVIN, 60);
            const actual = humidexScale.humidexText(humidex);
            //assert
            expect(actual?.lowerLimit).toEqual(expected);
        });
    });
});
