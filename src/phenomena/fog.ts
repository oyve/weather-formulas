import { dewPointMagnusFormula } from '../formulas/temperature';
import { Reading } from '../common';
import regression from 'regression';
import SunCalc from 'suncalc';

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
export function fogProbability(readings: Reading[]): number {
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

/**
 * Adjust fog probability for solar elevation (fog dissipates after sunrise).
 * @param {number} predictedProb - Predicted fog probability (0–1)
 * @param {Date} futureDate - Date/time for prediction
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {number} Adjusted fog probability
 */
function adjustFogForSun(
    predictedProb: number,
    futureDate: Date,
    lat: number,
    lon: number
): number {
    const sun = SunCalc.getPosition(futureDate, lat, lon);
    const elevation = sun.altitude * (180 / Math.PI); // degrees

    if (elevation > 0) {
        // Lower elevation = slower dissipation (e.g., in autumn/winter)
        // Dissipation factor: 1 at sunrise, 0 at 20° elevation or higher
        const dissipation = Math.max(0, 1 - elevation / 20);
        return predictedProb * dissipation;
    }
    return predictedProb;
}

/**
 * Predict fog probability trend for the next N hours using regression on recent fog probabilities,
 * and adjust for solar elevation (fog dissipation after sunrise).
 * @param {Reading[]} readings - Array of readings sorted by time (oldest to newest)
 * @param {number} hoursAhead - Number of hours to predict ahead (default: 3)
 * @param {number} interval - Interval in hours between predictions (default: 1)
 * @param {number} lat - Latitude of location
 * @param {number} lon - Longitude of location
 * @returns {number[]} Array of predicted fog probabilities for each future hour
 */
export function fogTrendProbability(
    readings: Reading[],
    hoursAhead: number = 3,
    interval: number = 1,
    lat?: number,
    lon?: number
): number[] {
    if (readings.length < 2) return Array(hoursAhead).fill(0);

    // Calculate fog probabilities for each hour (pairwise)
    const fogProbs: number[] = [];
    for (let i = 1; i < readings.length; i++) {
        fogProbs.push(fogProbability([readings[i - 1], readings[i]]));
    }

    // Prepare regression data: x = time index, y = fog probability
    const times = fogProbs.map((_, i) => i);
    const data: [number, number][] = times.map((t, i) => [t, fogProbs[i]]);
    const result = regression.linear(data);

    // Predict future fog probabilities
    const predictions: number[] = [];
    const lastIndex = fogProbs.length - 1;
    const lastReadingTime = (readings as any)[readings.length - 1]?.timestamp
        ? new Date((readings as any)[readings.length - 1].timestamp)
        : new Date();

    for (let h = 1; h <= hoursAhead; h += interval) {
        const futureIndex = lastIndex + h;
        let predicted = result.predict(futureIndex)[1];
        predicted = Math.max(0, Math.min(1, predicted)); // Clamp to [0,1]

        // Adjust for solar elevation if lat/lon and timestamp are provided
        if (lat !== undefined && lon !== undefined && lastReadingTime) {
            const futureDate = new Date(lastReadingTime.getTime() + h * 60 * 60 * 1000);
            predicted = adjustFogForSun(predicted, futureDate, lat, lon);
        }

        predictions.push(predicted);
    }

    return predictions;
}