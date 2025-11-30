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

/**
 * Calculate altitudes from a time series of pressure readings starting from a known initial altitude.
 * This function processes a series of pressure readings and calculates the altitude at each point
 * relative to the starting altitude using the hypsometric formula.
 * 
 * @param {Reading[]} readings - Array of readings with timestamps and pressure. Must contain at least one reading.
 * @param {number} startAltitude - The known altitude at the first reading in meters (m). Defaults to 0 (sea level).
 * @param {number} defaultTemperature - Default temperature to use if not provided in readings, in Kelvin (K). Defaults to 288.15 K (15°C).
 * @returns {Reading[]} Array of readings with calculated altitudes corresponding to each pressure reading.
 * 
 * @example
 * // Track altitude during a hiking trip using barometer readings
 * const readings: Reading[] = [
 *   { timestamp: Date.now() - 3600000, pressure: 101325, temperature: 288.15, altitude: 0, relativeHumidity: 50 },
 *   { timestamp: Date.now() - 1800000, pressure: 98000, temperature: 286.15, altitude: 0, relativeHumidity: 55 },
 *   { timestamp: Date.now(), pressure: 95000, temperature: 284.15, altitude: 0, relativeHumidity: 60 }
 * ];
 * const altitudes = calculateAltitudesFromPressureSeries(readings, 100); // Starting at 100m
 * console.log(altitudes);
 * // [
 * //   { timestamp: ..., altitude: 100, pressure: 101325, ... },
 * //   { timestamp: ..., altitude: ~380, pressure: 98000, ... },
 * //   { timestamp: ..., altitude: ~640, pressure: 95000, ... }
 * // ]
 * 
 * @see https://en.wikipedia.org/wiki/Barometric_formula
 */
export function calculateAltitudesFromPressureSeries(
    readings: Reading[],
    startAltitude: number = 0,
    defaultTemperature: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN
): Reading[] {
    if (readings.length === 0) {
        return [];
    }
    
    // Sort readings by timestamp (oldest to newest)
    const sortedReadings = [...readings].sort((a, b) => a.timestamp - b.timestamp);
    
    const results: Reading[] = [];
    let currentAltitude = startAltitude;
    
    // First reading uses the start altitude
    results.push({
        ...sortedReadings[0],
        altitude: currentAltitude
    });
    
    // Calculate altitude for each subsequent reading based on pressure difference from previous
    for (let i = 1; i < sortedReadings.length; i++) {
        const previousReading = sortedReadings[i - 1];
        const currentReading = sortedReadings[i];
        
        // Use average temperature between two readings for more accuracy
        const prevTemp = previousReading.temperature ?? defaultTemperature;
        const currTemp = currentReading.temperature ?? defaultTemperature;
        const avgTemperature = (prevTemp + currTemp) / 2;
        
        // Calculate altitude change from previous reading
        const altitudeChange = altitudeFromPressureDifference(
            previousReading.pressure,
            currentReading.pressure,
            avgTemperature
        );
        
        currentAltitude += altitudeChange;
        
        results.push({
            ...currentReading,
            altitude: Math.round(currentAltitude * 100) / 100
        });
    }
    
    return results;
}
