import humidityFormulas from './humidity';

/**
 * Calculates air density using pressure, temperature, and humidity.
 * @param {number} pressure - Atmospheric pressure in Pascals (Pa).
 * @param {number} temperature - Temperature in Kelvin (K).
 * @param {number} humidity - Relative Humidity in percentage (%).
 * @returns {number} - Air density in kilograms per cubic meter (kg/m³).
 */
function calculateAirDensity(
    pressure: number,
    temperature: number,
    humidity: number
): number {
    const saturationVaporPressure = humidityFormulas.saturationVaporPressure(temperature);
    const actualVaporPressure = humidityFormulas.actualVaporPressure(saturationVaporPressure, humidity);
    const mixingRatio = humidityFormulas.mixingRatio(actualVaporPressure, pressure) / 1000; // Convert g/kg to kg/kg
    const specificGasConstant = humidityFormulas.specificGasConstantForMoistAir(mixingRatio);

    const density = pressure / (specificGasConstant * temperature);

    return density;
}

export default {
    calculateAirDensity,
};