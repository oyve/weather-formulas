import * as humidityFormulas from './humidity';

/**
 * Calculates air density using pressure, temperature, and humidity.
 * Supports both dry air and moist air calculations.
 * @param {number} pressure - Atmospheric pressure in Pascals (Pa).
 * @param {number} temperature - Temperature in Kelvin (K).
 * @param {number} humidity - Relative Humidity in percentage (%).
 * @param {boolean} [isDryAir=false] - Whether to calculate for dry air (ignores humidity).
 * @returns {number} - Air density in kilograms per cubic meter (kg/m³).
 */
export function calculateAirDensity(
    pressure: number,
    temperature: number,
    humidity: number,
    isDryAir: boolean = false
): number {
    const R_d = 287.05; // Specific gas constant for dry air (J/(kg·K))

    if (isDryAir) {
        // Dry air calculation
        return pressure / (R_d * temperature);
    } else {
        // Moist air calculation
        const saturationVaporPressure = humidityFormulas.saturationVaporPressure(temperature);
        const actualVaporPressure = humidityFormulas.actualVaporPressure(saturationVaporPressure, humidity);
        const mixingRatio = humidityFormulas.mixingRatio(actualVaporPressure, pressure) / 1000; // Convert g/kg to kg/kg
        const specificGasConstant = humidityFormulas.specificGasConstantForMoistAir(mixingRatio);

        return pressure / (specificGasConstant * temperature);
    }
}

export default {
    calculateAirDensity,
};