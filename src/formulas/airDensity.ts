import * as humidityFormulas from './humidity';

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
export function calculateAirDensity(
    pressure: number,
    temperature: number,
    humidity: number,
    isDryAir: boolean = false,
    gasConstant: number = 287.05 // Default to the specific gas constant for dry air
): number {
    if (isDryAir) {
        // Dry air calculation
        return pressure / (gasConstant * temperature);
    } else {
        // Moist air calculation
        const saturationVaporPressure = humidityFormulas.saturationVaporPressure(temperature);
        const actualVaporPressure = humidityFormulas.actualVaporPressure(saturationVaporPressure, humidity);
        const mixingRatio = humidityFormulas.mixingRatio(actualVaporPressure, pressure) / 1000; // Convert g/kg to kg/kg
        const specificGasConstant = humidityFormulas.specificGasConstantForMoistAir(mixingRatio);

        return pressure / (specificGasConstant * temperature);
    }
}

/**
 * Calculate air density at a given altitude.
 * @param airDensityAtReference - Air density at the reference altitude in kg/m³.
 * @param altitudeDifference - Difference in altitude from the reference altitude in meters.
 * @returns {number} - Air density at the target altitude in kg/m³.
 */
export function calculateAirDensityAtAltitude(
    airDensityAtReference: number,
    altitudeDifference: number
): number {
    return airDensityAtReference * Math.exp(-0.00011856 * altitudeDifference);
}