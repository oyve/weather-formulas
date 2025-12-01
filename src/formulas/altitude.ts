import * as c from '../constants';

/**
 * Estimate the altitude (in meters) where the temperature drops below freezing (0°C).
 * Assumes a linear lapse rate (default: 0.0065 K/m).
 * @param {number} surfaceTemp - Surface temperature in Kelvin.
 * @param {number} surfaceAltitude - Surface altitude in meters.
 * @param {number} lapseRate - Lapse rate in Kelvin per meter (default: 0.0065).
 * @returns {number | null} Altitude in meters where temperature is 273.15 K (0°C), or null if already below freezing.
 */
export function freezingLevelAltitude(
    surfaceTemp: number,
    surfaceAltitude: number = 0,
    lapseRate: number = 0.0065
): number | null {
    if (surfaceTemp <= 273.15) return null; // Already freezing or below at surface
    // Calculate altitude difference needed to reach 0°C (273.15 K)
    const altitudeDiff = (surfaceTemp - 273.15) / lapseRate;
    return surfaceAltitude + altitudeDiff;
}

/**
 * Calculate the final altitude from a pressure difference using the hypsometric formula.
 * Given a reference pressure at a known altitude and an observed pressure, this function
 * returns the altitude at which the observed pressure occurs.
 * 
 * @param {number} referencePressure - Reference pressure in Pascals (Pa) at the reference altitude.
 * @param {number} observedPressure - Observed pressure in Pascals (Pa) at the unknown altitude.
 * @param {number} referenceAltitude - Altitude in meters (m) where the reference pressure was measured. Defaults to 0 (sea level).
 * @param {number} temperature - Average temperature in Kelvin (K) between the two altitudes. Defaults to 288.15 K (15°C).
 * @returns {number} The final altitude in meters (m) where the observed pressure occurs.
 * 
 * @example
 * // Calculate altitude when pressure drops from 101325 Pa (sea level) to 89874 Pa
 * const altitude = altitudeFromPressureDifference(101325, 89874, 0, 288.15);
 * console.log(altitude); // ~1000 m
 * 
 * @see https://en.wikipedia.org/wiki/Hypsometric_equation
 */
export function altitudeFromPressureDifference(
    referencePressure: number,
    observedPressure: number,
    referenceAltitude: number = 0,
    temperature: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN
): number {
    const g = c.DRY_AIR_CONSTANTS.gravity; // Gravitational acceleration (m/s²)
    const R = c.DRY_AIR_CONSTANTS.gasConstant; // Specific gas constant for dry air (J/(kg·K))
    
    // Using the hypsometric formula: h = (R * T / g) * ln(P1 / P2)
    // Where h is the altitude difference, R is gas constant, T is temperature,
    // g is gravity, P1 is reference pressure, P2 is observed pressure
    const altitudeDifference = (R * temperature / g) * Math.log(referencePressure / observedPressure);
    
    // Return the final altitude (reference altitude + altitude difference)
    return referenceAltitude + altitudeDifference;
}
