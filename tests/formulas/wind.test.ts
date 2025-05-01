import * as windFormulas from '../../src/formulas/wind';

describe('getWindDirectionByDegree', () => {
    it('should return "N" for 0 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(0)).toBe('N');
    });

    it('should return "N" for 360 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(360)).toBe('N');
    });

    it('should return "NE" for 45 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(45)).toBe('NE');
    });

    it('should return "E" for 90 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(90)).toBe('E');
    });

    it('should return "S" for 180 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(180)).toBe('S');
    });

    it('should return "W" for 270 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(270)).toBe('W');
    });

    it('should return "NNE" for 22.5 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(22.5)).toBe('NNE');
    });

    it('should return "SSW" for 202.5 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(202.5)).toBe('SSW');
    });

    it('should return "NW" for 315 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(315)).toBe('NW');
    });

    it('should handle values greater than 360 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(725)).toBe('N'); // 725 % 360 = 5
    });

    it('should handle negative degree values', () => {
        expect(windFormulas.getWindDirectionByDegree(-45)).toBe('NW'); // -45 % 360 = 315
    });
});

describe('getWindDirectionByDegree', () => {
    it('should return "N" for 0 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(0)).toBe('N');
    });

    it('should return "N" for 360 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(360)).toBe('N');
    });

    it('should return "NE" for 45 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(45)).toBe('NE');
    });

    it('should return "E" for 90 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(90)).toBe('E');
    });

    it('should return "S" for 180 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(180)).toBe('S');
    });

    it('should return "W" for 270 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(270)).toBe('W');
    });

    it('should return "NNE" for 22.5 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(22.5)).toBe('NNE');
    });

    it('should return "SSW" for 202.5 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(202.5)).toBe('SSW');
    });

    it('should return "NW" for 315 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(315)).toBe('NW');
    });

    it('should handle values greater than 360 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(725)).toBe('N'); // 725 % 360 = 5
    });

    it('should handle negative degree values', () => {
        expect(windFormulas.getWindDirectionByDegree(-45)).toBe('NW'); // -45 % 360 = 315
    });
});

describe('calculateWindPowerDensity', () => {
    it('should calculate wind power density with default air density', () => {
        const windSpeed = 10; // m/s
        const expectedDensity = 612.5; // 0.5 * 1.225 * 10^3
        expect(windFormulas.calculateWindPowerDensity(windSpeed)).toBeCloseTo(expectedDensity, 5);
    });

    it('should calculate wind power density with custom air density', () => {
        const windSpeed = 10; // m/s
        const airDensity = 1.2; // kg/m³
        const expectedDensity = 600; // 0.5 * 1.2 * 10^3
        expect(windFormulas.calculateWindPowerDensity(windSpeed, airDensity)).toBeCloseTo(expectedDensity, 5);
    });

    it('should return 0 for wind speed of 0', () => {
        const windSpeed = 0; // m/s
        const expectedDensity = 0; // No wind power
        expect(windFormulas.calculateWindPowerDensity(windSpeed)).toBe(expectedDensity);
    });

    it('should handle very high wind speeds', () => {
        const windSpeed = 50; // m/s
        const expectedDensity = 76562.5; // 0.5 * 1.225 * 50^3
        expect(windFormulas.calculateWindPowerDensity(windSpeed)).toBeCloseTo(expectedDensity, 5);
    });

    it('should handle very low air density', () => {
        const windSpeed = 10; // m/s
        const airDensity = 0.5; // kg/m³
        const expectedDensity = 250; // 0.5 * 0.5 * 10^3
        expect(windFormulas.calculateWindPowerDensity(windSpeed, airDensity)).toBeCloseTo(expectedDensity, 5);
    });
});