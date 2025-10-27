import { freezingLevelAltitude } from '../../src/formulas/altitude';

describe('freezingLevelHeight', () => {
    it('should return null if surface temperature is at or below freezing', () => {
        expect(freezingLevelAltitude(273.15)).toBeNull();
        expect(freezingLevelAltitude(270)).toBeNull();
    });

    it('should calculate freezing level height above sea level', () => {
        // Surface temp: 283.15 K (10°C), sea level, lapse rate 0.0065 K/m
        const result = freezingLevelAltitude(283.15, 0);
        // (283.15 - 273.15) / 0.0065 = 1538.46 m
        expect(result).toBeCloseTo(1538.46, 2);
    });

    it('should calculate freezing level height above a given altitude', () => {
        // Surface temp: 283.15 K (10°C), altitude: 500 m, lapse rate 0.0065 K/m
        const result = freezingLevelAltitude(283.15, 500);
        // (283.15 - 273.15) / 0.0065 + 500 = 2038.46 m
        expect(result).toBeCloseTo(2038.46, 2);
    });

    it('should work with a custom lapse rate', () => {
        // Surface temp: 283.15 K (10°C), sea level, lapse rate 0.01 K/m
        const result = freezingLevelAltitude(283.15, 0, 0.01);
        // (283.15 - 273.15) / 0.01 = 1000 m
        expect(result).toBeCloseTo(1000, 2);
    });
});