import { Reading } from '../common';
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
 * Calculate the altitude difference based on the difference in pressure between two points.
 * Uses the hypsometric formula (barometric formula) to calculate altitude change.
 * 
 * The formula used is: Δh = (R * T_avg / g) * ln(P1 / P2)
 * where:
 * - R is the specific gas constant for dry air (287.05 J/(kg·K))
 * - T_avg is the average temperature between the two points
 * - g is gravitational acceleration (9.80665 m/s²)
 * - P1 is the pressure at the reference (lower) point
 * - P2 is the pressure at the higher point
 * 
 * @param {number} referencePressure - Pressure at the reference altitude in Pascals (Pa).
 * @param {number} currentPressure - Pressure at the current point in Pascals (Pa).
 * @param {number} temperature - Average temperature between the two points in Kelvin (K). Defaults to 288.15 K (15°C).
 * @returns {number} Altitude difference in meters (m). Positive values indicate higher altitude.
 * 
 * @example
 * // Calculate altitude change from sea level pressure to current pressure
 * const altitudeDiff = altitudeFromPressureDifference(101325, 95000, 288.15);
 * console.log(altitudeDiff); // ~540 meters higher
 * 
 * @see https://en.wikipedia.org/wiki/Hypsometric_equation
 */
export function altitudeFromPressureDifference(
    referencePressure: number,
    currentPressure: number,
    temperature: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN
): number {
    const R = c.DRY_AIR_CONSTANTS.gasConstant; // 287.05 J/(kg·K) for dry air
    const g = c.DRY_AIR_CONSTANTS.gravity; // 9.80665 m/s²
    
    // Hypsometric formula: Δh = (R * T / g) * ln(P1 / P2)
    const scaleHeight = (R * temperature) / g;
    const altitudeDifference = scaleHeight * Math.log(referencePressure / currentPressure);
    
    return Math.round(altitudeDifference * 100) / 100;
}
