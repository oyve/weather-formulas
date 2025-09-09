import * as saffirSimpsonFormulas from '../../src/scales/saffirSimpson';

describe('Saffir-Simpson Hurricane Wind Scale', () => {
    it('should return the correct category for a given wind speed', () => {
        // Arrange
        const testCases = [
            { windSpeed: 30, expectedCategory: null },
            { windSpeed: 33, expectedCategory: 1 },
            { windSpeed: 42, expectedCategory: 1 },
            { windSpeed: 43, expectedCategory: 2 },
            { windSpeed: 49, expectedCategory: 2 },
            { windSpeed: 50, expectedCategory: 3 },
            { windSpeed: 58, expectedCategory: 3 },
            { windSpeed: 59, expectedCategory: 4 },
            { windSpeed: 69, expectedCategory: 4 },
            { windSpeed: 70, expectedCategory: 5 },
            { windSpeed: 80, expectedCategory: 5 },
            { windSpeed: 150, expectedCategory: 5 }
        ];

        // Act & Assert
        testCases.forEach(({ windSpeed, expectedCategory }) => {
            const actual = saffirSimpsonFormulas.getSaffirSimpsonScaleByWindSpeed(windSpeed);
            if (actual === null) {
                expect(actual).toBe(expectedCategory);
            } else {
                expect(actual.category).toBe(expectedCategory);
            }
        });
    });
    
    it('should throw error if negative wind speed', () => {
        expect(() => saffirSimpsonFormulas.getSaffirSimpsonScaleByWindSpeed(-10)).toThrow('Wind speed cannot be negative.');
    });
});
