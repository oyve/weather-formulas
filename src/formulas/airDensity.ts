import * as humidityFormulas from './humidity';
import * as c from '../constants';

/**
 * Calculates air density using pressure, temperature, and humidity.
 * Supports both dry air and moist air calculations.
 * @param {number} pressure - Atmospheric pressure in Pascals (Pa).
 * @param {number} temperature - Temperature in Kelvin (K).
 * @param {number} humidity - Relative Humidity in percentage (%).
 * @param {boolean} [isDryAir=false] - Whether to calculate for dry air (ignores humidity).
 * @param {number} [gasConstant=287.05] - Specific gas constant for dry air (J/(kg·K)).
 * @returns {number} - Air density in kilograms per cubic meter (kg/m³).
 */
export function calculateAirDensityDryAir(
    pressure: number,
    temperature: number,
    gasConstant: number = 287.05 // Default to the specific gas constant for dry air
): number {
    return pressure / (gasConstant * temperature);
}

export function calculateAirDensityMoistAir(
    pressure: number,
    temperature: number,
    humidity: number
): number {    
    const saturationVaporPressure = humidityFormulas.saturationVaporPressure(temperature);
    const actualVaporPressure = humidityFormulas.actualVaporPressure(saturationVaporPressure, humidity);
    const mixingRatio = humidityFormulas.mixingRatio(actualVaporPressure, pressure) / 1000; // Convert g/kg to kg/kg
    const specificGasConstant = humidityFormulas.specificGasConstantForMoistAir(mixingRatio);

    return pressure / (specificGasConstant * temperature);
}


/**
 * Calculate air density at a given altitude.
 * @param airDensityAtReference - Air density at the reference altitude in kg/m³.
 * @param altitudeDifference - Difference in altitude from the reference altitude in meters
 * @param decayConstant - Decay constant for air density with altitude (default is -0.00011856).
 * @returns {number} - Air density at the target altitude in kg/m³.
 */
export function calculateAirDensityAtAltitude(
    referenceDensity: number,
    altitudeDifference: number,
    decayConstant: number = -defaultDecayConstant()): number {
    return referenceDensity * Math.exp(-decayConstant * altitudeDifference);
}

const defaultDecayConstant = () => calculateDecayConstant(288.15);

/**
 * Calculate decay constant for given atmosperic constants and temperature
 * @param temperature Temperature in Kelvin (K)
 * @param constants Athmosperic constants
 * @returns Decay constant
 */
export function calculateDecayConstant(temperature: number, constants: c.AtmospericConstants = c.STANDARD_ATMOSPHERIC_CONSTANTS): number {
    return (constants.gravity * constants.molarMass) / (constants.gasConstant * temperature);
}