import { dewPointMagnusFormula } from '../formulas/temperature';
import { Reading } from '../common';

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
 * @param {number} temperature - Air temperature in Kelvin
 * @param {number} relativeHumidity - Relative humidity in percent (0–100)
 * @returns {number} Fog point temperature in Kelvin
 */
export function fogPointTemperature(temperature: number, relativeHumidity: number): number {
    return dewPointMagnusFormula(temperature, relativeHumidity);
}

/**
 * Predict the probability of fog formation using multiple meteorological factors.
 * @param {Reading[]} readings - Array of readings sorted by time (oldest to newest)
 * @returns {number} Probability of fog (0 to 1)
 */
export function predictFog(readings: Reading[]): number {
    if (readings.length < 2) return 0;

    let fogScore = 0;
    let total = readings.length - 1;

    for (let i = 1; i < readings.length; i++) {
        const prev = readings[i - 1];
        const curr = readings[i];

        const dewPoint = fogPointTemperature(curr.temperature, curr.relativeHumidity);

        // Factors
        const tempCloseToDew = Math.abs(curr.temperature - dewPoint) < 1 ? 1 : 0;
        const highRH = curr.relativeHumidity >= 95 ? 1 : 0;
        // Accept steady or falling pressure as favorable for fog
        const pressureNotRising = curr.pressure <= prev.pressure ? 1 : 0;
        // Optional: calm wind favors fog (if windSpeed exists)
        const calmWind = (curr as any).windSpeed !== undefined
            ? ((curr as any).windSpeed < 2 ? 1 : 0)
            : 0;

        // Weighted sum (adjust weights as needed)
        const score = 0.25 * tempCloseToDew +
                      0.25 * highRH +
                      0.25 * pressureNotRising +
                      0.25 * calmWind;

        fogScore += score;
    }

    // Normalize to [0,1]
    return Math.min(fogScore / total, 1);
}