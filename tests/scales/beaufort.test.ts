import beaufortFormulas from '../../src/scales/beaufort';

describe('getWindDirectionByDegree', () => {
    it('should be actual force', () => {
        //arrange
        let windSpeeds = [0, 0.3, 1.6, 3.4, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37.2, 41.5, 46.2, 51.0, 56.0];
        //act
        let i = 0;
        windSpeeds.forEach((windSpeed) => {
            let actual = beaufortFormulas.getBeaufortScaleByWindSpeed(windSpeed);
            //assert
            expect(actual?.force).toBe(i);
            i++;
        });
    });
    it('should round decimals up', () => {
        //arrange
        let expected = 3;
        //act
        let actual = beaufortFormulas.getBeaufortScaleByWindSpeed(5.44);
        //assert
        expect(actual?.force).toBe(expected);
    });
    it('should round decimals down', () => {
        //arrange
        let expected = 4;
        //act
        let actual = beaufortFormulas.getBeaufortScaleByWindSpeed(5.45);
        //assert
        expect(actual?.force).toBe(expected);
    });
});
