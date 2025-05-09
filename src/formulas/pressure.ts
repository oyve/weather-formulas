import { Reading } from '../common';
import * as c from '../constants';
import { calculateDynamicLapseRate, calculateWeightedAverageTemperature } from './temperature';

/**
 * Calculates the pressure altitude based on the observed pressure.
 * Pressure altitude is the altitude in the International Standard Atmosphere (ISA) where the observed pressure would occur.
 * 
 * @param {number} pressure Observed pressure in Pascals (Pa).
 * @returns {number} Pressure altitude in meters (m).
 */
export function pressureAltitude(pressure: number): number {
    return (1 - Math.pow(pressure / c.STANDARD_MEAN_PRESSURE_SEA_LEVEL, 0.190284)) * 145366.45 * 0.3048;
}

/**
 * Calculates the density altitude, which is the altitude relative to the standard atmosphere conditions
 * at which the air density would be equal to the current air density.
 * 
 * @param {number} pressureAltitude Pressure altitude in meters (m).
 * @param {number} temperature Temperature in Kelvin (K).
 * @returns {number} Density altitude in meters (m).
 */
export function densityAltitude(pressureAltitude: number, temperature: number): number {
    return pressureAltitude + (120 * (temperature - c.STANDARD_MEAN_TEMPERATURE_KELVIN));
}

/**
 * Calculates the barometric pressure at a given altitude using the barometric formula.
 * The calculation accounts for both zero and non-zero lapse rates.
 * 
 * @param {number} altitude Target altitude in meters (m).
 * @param {number} referencePressure Pressure at the reference altitude in Pascals (Pa).
 * @param {number} referenceAltitude Reference altitude in meters (m).
 * @param {number} referenceTemperature Temperature at the reference altitude in Kelvin (K). Defaults to 288.15 K (15°C).
 * @param {AtmospericConstants} constants Atmospheric constants (e.g., lapse rate, gravity, gas constant).
 * @returns {number} Barometric pressure at the target altitude in Pascals (Pa).
 */
export function barometricFormula(
    altitude: number,
    referencePressure: number,
    referenceAltitude: number,
    referenceTemperature: number = 288.15,
    constants: c.AtmospericConstants = c.DRY_AIR_CONSTANTS
): number {
    let result: number;

    if (constants.lapseRate === 0) {
        // Case: Zero lapse rate
        const scaleHeight = (constants.gasConstant * referenceTemperature) / constants.gravity;
        result = referencePressure * Math.exp(-(altitude - referenceAltitude) / scaleHeight);
    } else {
        // Case: Non-zero lapse rate
        const tempRatio = 1 - (constants.lapseRate * (altitude - referenceAltitude)) / referenceTemperature;

        // Ensure tempRatio is positive to avoid invalid results
        if (tempRatio <= 0) {
            return 0; // Return 0 if the calculation is invalid
        }

        const exponent = constants.gravity / (constants.gasConstant * constants.lapseRate);
        result = referencePressure * Math.pow(tempRatio, exponent);
    }

    return Math.round(result * 100) / 100;
}

/**
 * Reduces the observed pressure to sea level using a simplified barometric formula.
 * This method assumes a standard sea level mean temperature of 15°C (288.15 K) and is less accurate for non-standard temperatures.
 * 
 * @param {number} pressureObserved Observed pressure in Pascals (Pa).
 * @param {number} altitude Altitude of the observed pressure in meters (m).
 * @param {number} temperatureAtSeaLevel Temperature at sea level in Kelvin (K). Defaults to 288.15 K (15°C).
 * @returns {number} Pressure reduced to sea level in Pascals (Pa), rounded to two decimal places.
 */
export function adjustPressureToSeaLevelSimple(pressureObserved: number, altitude: number, temperatureAtSeaLevel: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN): number {
    let pressureSeaLevel = pressureObserved * Math.pow(1 - ((0.0065 * altitude) / (temperatureAtSeaLevel + 0.0065 * altitude)), -5.257);

    return Number(pressureSeaLevel.toFixed(2));
}

/**
 * Reduces the observed pressure to sea level with higher accuracy by using the barometric formula.
 * This method allows customization of atmospheric constants for non-standard conditions.
 * 
 * @param {number} pressureObserved Observed pressure in Pascals (Pa).
 * @param {number} altitude Altitude of the observed pressure in meters (m).
 * @param {number} temperature Temperature at sea level in Kelvin (K). Defaults to 288.15 K (15°C).
 * @param {AtmospericConstants} constants Atmospheric constants (e.g., lapse rate, gravity, gas constant). Defaults to Earth's standard constants.
 * @returns {number} Pressure reduced to sea level in Pascals (Pa), rounded to two decimal places.
 */
export function adjustPressureToSeaLevelAdvanced(
    pressureObserved: number,
    altitude: number,
    temperature: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN,
    constants: c.AtmospericConstants = c.DRY_AIR_CONSTANTS
): number {
    return barometricFormula(0, pressureObserved, altitude, temperature, constants);
}

/**
 * 
 * @param pressure Observed pressure
 * @param altitude Observed altitude
 * @param temperature Observed temperature
 * @param lapseRate Lapse rate
 * @returns Adjusted pressure
 */
export function adjustPressureToSeaLevelByDynamicLapseRate(pressure: number, altitude: number, temperature: number, lapseRate: number) {
    const g = 9.80665; // Gravitational acceleration (m/s²)
    const R = 287.05; // Specific gas constant for dry air (J/(kg·K))

    if (lapseRate > 0) {
        // Handle temperature inversion
        const Tavg = temperature + (lapseRate * altitude) / 2; // Average temperature
        return pressure * Math.exp((g * altitude) / (R * Tavg));
    } else {
        // Standard formula
        return pressure * Math.pow(1 - (lapseRate * altitude) / temperature, -g / (R * lapseRate));
    }
}

export function adjustPressureToSeaLevelByHistoricalData(pressure: number, altitude: number, readings: Reading[], hours = 24) {
    const dynamicLapseRate = calculateDynamicLapseRate(readings, hours);
    const weightedAverageTemperature = calculateWeightedAverageTemperature(readings, hours);

    const adjusted = adjustPressureToSeaLevelByDynamicLapseRate(pressure, altitude, weightedAverageTemperature, dynamicLapseRate);

    return Math.round(adjusted);
}
