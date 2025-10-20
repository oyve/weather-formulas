import { dewPointMagnusFormula } from '../formulas/temperature';

/**
 * Estimate visibility in fog using Koschmieder’s Law.
 * @param {number} extinctionCoefficient - Atmospheric extinction coefficient (1/m)
 * @returns {number} Visibility in meters
 */
export function fogVisibility(extinctionCoefficient: number): number {
    // Koschmieder’s Law: V = 3.912 / beta
    return 3.912 / extinctionCoefficient;
}

/**
 * The fog point temperature is the dew point temperature at ground level.
 * Uses the Magnus formula from temperature.ts for consistency.
 * @param {number} temperatureK - Air temperature in Kelvin
 * @param {number} relativeHumidity - Relative humidity in percent (0–100)
 * @returns {number} Fog point temperature in Kelvin
 */
export function fogPointTemperature(temperatureK: number, relativeHumidity: number): number {
    return dewPointMagnusFormula(temperatureK, relativeHumidity);
}