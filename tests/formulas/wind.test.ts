import * as windFormulas from '../../src/formulas/wind';
import * as airDensityFormulas from '../../src/formulas/airDensity';

describe('getWindDirectionByDegree', () => {
    it('should return "N" for 0 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(0).abbr).toBe('N');
    });

    it('should return "N" for 360 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(360).abbr).toBe('N');
    });

    it('should return "NE" for 45 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(45).abbr).toBe('NE');
    });

    it('should return "E" for 90 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(90).abbr).toBe('E');
    });

    it('should return "S" for 180 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(180).abbr).toBe('S');
    });

    it('should return "W" for 270 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(270).abbr).toBe('W');
    });

    it('should return "NNE" for 22.5 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(22.5).abbr).toBe('NNE');
    });

    it('should return "SSW" for 202.5 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(202.5).abbr).toBe('SSW');
    });

    it('should return "NW" for 315 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(315).abbr).toBe('NW');
    });

    it('should handle values greater than 360 degrees', () => {
        expect(windFormulas.getWindDirectionByDegree(725).abbr).toBe('N'); // 725 % 360 = 5
    });

    it('should handle negative degree values', () => {
        expect(windFormulas.getWindDirectionByDegree(-45).abbr).toBe('NW'); // -45 % 360 = 315
    });
});

describe('calculateWindPowerDensity', () => {
    it('should calculate wind power density with default air density', () => {
        const windSpeed = 10; // m/s
        const expectedDensity = 612.5; // 0.5 * 1.225 * 10^3
        expect(windFormulas.windPowerDensity(windSpeed)).toBeCloseTo(expectedDensity, 5);
    });

    it('should calculate wind power density with custom air density', () => {
        const windSpeed = 10; // m/s
        const airDensity = 1.2; // kg/m³
        const expectedDensity = 600; // 0.5 * 1.2 * 10^3
        expect(windFormulas.windPowerDensity(windSpeed, airDensity)).toBeCloseTo(expectedDensity, 5);
    });

    it('should return 0 for wind speed of 0', () => {
        const windSpeed = 0; // m/s
        const expectedDensity = 0; // No wind power
        expect(windFormulas.windPowerDensity(windSpeed)).toBe(expectedDensity);
    });

    it('should handle very high wind speeds', () => {
        const windSpeed = 50; // m/s
        const expectedDensity = 76562.5; // 0.5 * 1.225 * 50^3
        expect(windFormulas.windPowerDensity(windSpeed)).toBeCloseTo(expectedDensity, 5);
    });

    it('should handle very low air density', () => {
        const windSpeed = 10; // m/s
        const airDensity = 0.5; // kg/m³
        const expectedDensity = 250; // 0.5 * 0.5 * 10^3
        expect(windFormulas.windPowerDensity(windSpeed, airDensity)).toBeCloseTo(expectedDensity, 5);
    });
});


describe('calculate custom', () => {
    it('should calculate', () => {
        const expected = 1.5;

        const windSpeed = 5; // m/s
        const temperature = 15 + 288.15
        const humidity = 60;
        const pressure = 101300;
        
        let airDensity = airDensityFormulas.airDensityMoistAir(pressure, temperature, humidity);
        let actual = windFormulas.windForce(windSpeed, airDensity);

        expect(actual).toBeCloseTo(expected, 1);
    });
    it('should calculate 2', () => {
        const expected = 13.2;

        const windSpeed = 15; // m/s
        const temperature = 25 + 288.15
        const humidity = 80;
        const pressure = 101300;
        
        let airDensity = airDensityFormulas.airDensityMoistAir(pressure, temperature, humidity);
        let actual = windFormulas.windForce(windSpeed, airDensity);

        expect(actual).toBeCloseTo(expected, 1);
    });
    it('should calculate 3', () => {
        const expected = 13.7;

        const windSpeed = 15; // m/s
        const temperature = 10 + 288.15
        const humidity = 80;
        const pressure = 101300;
        
        let airDensity = airDensityFormulas.airDensityMoistAir(pressure, temperature, humidity);
        let actual = windFormulas.windForce(windSpeed, airDensity);

        expect(actual).toBeCloseTo(expected, 1);
    });
});

describe('apparentWind', () => {
    it('should return true wind when observer is stationary', () => {
        const result = windFormulas.apparentWind(10, 90, 0, 0);
        expect(result.speed).toBeCloseTo(10, 3);
        expect(result.direction).toBeCloseTo(90, 3);
    });

    it('should calculate apparent wind for observer moving directly into the wind', () => {
        // True wind: 10 m/s from east (90°), observer moves east at 5 m/s
        const result = windFormulas.apparentWind(10, 90, 5, 90);
        expect(result.speed).toBeCloseTo(15, 3);
        expect(result.direction).toBeCloseTo(90, 3);
    });

        it('should calculate apparent wind for observer moving directly into and more fast than the wind', () => {
        // True wind: 10 m/s from east (90°), observer moves east at 5 m/s
        const result = windFormulas.apparentWind(10, 90, 15, 90);
        expect(result.speed).toBeCloseTo(25, 3);
        expect(result.direction).toBeCloseTo(90, 3);
    });

    it('should calculate apparent wind for observer moving directly away from the wind', () => {
        // True wind: 10 m/s from east (90°), observer moves west at 5 m/s (270°)
        const result = windFormulas.apparentWind(10, 90, 5, 270);
        expect(result.speed).toBeCloseTo(5, 3);
        expect(result.direction).toBeCloseTo(90, 3);
    });

        it('should calculate apparent wind for observer moving directly away from and more fast than the wind', () => {
        // True wind: 10 m/s from east (90°), observer moves west at 5 m/s (270°)
        const result = windFormulas.apparentWind(10, 90, 15, 270);
        expect(result.speed).toBeCloseTo(5, 3);
        expect(result.direction).toBeCloseTo(270, 3);
    });

    it('should calculate apparent wind for observer moving directly east to a northern wind', () => {
        // True wind: 10 m/s from north (0°), observer moves east at 10 m/s (90°)
        const result = windFormulas.apparentWind(10, 0, 10, 90);
        expect(result.speed).toBeCloseTo(14.142, 3);
        expect(result.direction).toBeCloseTo(45, 3);
    });

        it('should calculate apparent wind for observer moving directly east to and faster than a northern wind', () => {
        // True wind: 10 m/s from north (0°), observer moves east at 10 m/s (90°)
        const result = windFormulas.apparentWind(10, 0, 20, 90);
        expect(result.speed).toBeCloseTo(22.361, 3);
        expect(result.direction).toBeCloseTo(63.435, 3);
    });

    it('should calculate apparent wind for observer moving directly west to a northern wind', () => {
        // True wind: 10 m/s from north (0°), observer moves east at 10 m/s (90°)
        const result = windFormulas.apparentWind(10, 0, 10, 270);
        expect(result.speed).toBeCloseTo(14.142, 3);
        expect(result.direction).toBeCloseTo(315, 3);
    });

        it('should calculate apparent wind for observer moving directly west to and faster than a northern wind', () => {
        // True wind: 10 m/s from north (0°), observer moves east at 10 m/s (90°)
        const result = windFormulas.apparentWind(10, 0, 20, 270);
        expect(result.speed).toBeCloseTo(22.361, 3);
        expect(result.direction).toBeCloseTo(296.565, 3);
    });
});

describe('windGustFactor', () => {
    it('should estimate gust speed with default gust factor', () => {
        expect(windFormulas.windGustFactor(10)).toBeCloseTo(15, 3); // 10 * 1.5
    });

    it('should estimate gust speed with custom gust factor', () => {
        expect(windFormulas.windGustFactor(10, 2)).toBeCloseTo(20, 3); // 10 * 2
    });

    it('should return 0 for zero mean wind speed', () => {
        expect(windFormulas.windGustFactor(0)).toBe(0);
    });

    it('should handle very low gust factor', () => {
        expect(windFormulas.windGustFactor(10, 1.1)).toBeCloseTo(11, 3);
    });

    it('should handle very high mean wind speed', () => {
        expect(windFormulas.windGustFactor(50)).toBeCloseTo(75, 3); // 50 * 1.5
    });
});