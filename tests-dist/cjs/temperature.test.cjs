/**
 * CommonJS integration tests for temperature module.
 * Tests that the CJS build output works correctly when imported via require().
 */
const temperature = require('../../dist/cjs/formulas/temperature.cjs');
const { CELSIUS_TO_KELVIN, DEW_POINT_VALUATIONS } = require('../../dist/cjs/constants.cjs');

describe('CJS Temperature Module Import Tests', () => {
    describe('Temperature conversions', () => {
        it('should convert kelvin to celsius', () => {
            const result = temperature.kelvinToCelcius(273.15);
            expect(result).toBeCloseTo(0, 2);
        });

        it('should convert celsius to kelvin', () => {
            const result = temperature.celciusToKelvin(0);
            expect(result).toBeCloseTo(273.15, 2);
        });

        it('should convert celsius to fahrenheit', () => {
            const result = temperature.celciusToFahrenheit(0);
            expect(result).toBeCloseTo(32, 2);
        });

        it('should convert fahrenheit to celsius', () => {
            const result = temperature.fahrenheitToCelcius(32);
            expect(result).toBeCloseTo(0, 2);
        });

        it('should convert kelvin to fahrenheit', () => {
            const result = temperature.kelvinToFahrenheit(273.15);
            expect(result).toBeCloseTo(32, 2);
        });

        it('should convert fahrenheit to kelvin', () => {
            const result = temperature.fahrenheitToKelvin(32);
            expect(result).toBeCloseTo(273.15, 2);
        });
    });

    describe('Dew Point Magnus Formula', () => {
        it('should calculate dew point correctly', () => {
            const expected = 285.720988;
            const actual = temperature.dewPointMagnusFormula(26.85 + CELSIUS_TO_KELVIN, 40);
            expect(actual).toBeCloseTo(expected, 2);
        });

        it('should calculate dew point with defined valuation set', () => {
            const expected = 285.72;
            const valuationSet = DEW_POINT_VALUATIONS.DAVID_BOLTON;
            const actual = temperature.dewPointMagnusFormula(26.85 + CELSIUS_TO_KELVIN, 40, valuationSet);
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe('Wind Chill Index', () => {
        it('should calculate wind chill correctly', () => {
            const expected = 265.50;
            const actual = temperature.windChillIndex(273.15, 12);
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe('Potential Temperature', () => {
        it('should calculate potential temperature correctly', () => {
            const kelvin = 293.15;
            const pressure = 90000;
            const expectedPotentialTemp = 302.11795811169407;
            const result = temperature.potentialTemperature(kelvin, pressure);
            expect(result).toEqual(expectedPotentialTemp);
        });
    });

    describe('Virtual Temperature', () => {
        it('should calculate virtual temperature correctly', () => {
            const kelvin = 293.15;
            const mixingRatio = 14.84;
            const expectedVirtualTemp = 295.80371106;
            const result = temperature.virtualTemperature(kelvin, mixingRatio);
            expect(result).toEqual(expectedVirtualTemp);
        });
    });

    describe('Wet Bulb Temperature', () => {
        it('should calculate wet bulb temperature correctly', () => {
            const temperatureK = temperature.celciusToKelvin(25);
            const humidity = 60;
            const expected = 292.65;
            const actual = temperature.wetBulbTemperature(temperatureK, humidity);
            expect(actual).toBeCloseTo(expected, 2);
        });
    });

    describe('Module export verification', () => {
        it('should export all expected functions', () => {
            expect(typeof temperature.dewPointMagnusFormula).toBe('function');
            expect(typeof temperature.dewPointArdenBuckEquation).toBe('function');
            expect(typeof temperature.equivalentTemperature).toBe('function');
            expect(typeof temperature.potentialTemperature).toBe('function');
            expect(typeof temperature.virtualTemperature).toBe('function');
            expect(typeof temperature.windChillIndex).toBe('function');
            expect(typeof temperature.australianApparentTemperature).toBe('function');
            expect(typeof temperature.kelvinToCelcius).toBe('function');
            expect(typeof temperature.celciusToKelvin).toBe('function');
            expect(typeof temperature.celciusToFahrenheit).toBe('function');
            expect(typeof temperature.fahrenheitToCelcius).toBe('function');
            expect(typeof temperature.kelvinToFahrenheit).toBe('function');
            expect(typeof temperature.fahrenheitToKelvin).toBe('function');
            expect(typeof temperature.wetBulbTemperature).toBe('function');
        });
    });
});
