/**
 * Calculate Pressure Altitude
 * @param {number} pressure Pressure in Pa (Pascal)
 * @returns {number} Pressure Altitude in meters (m)
 */
function pressureAltitude(pressure: number): number {
    const standardPressure = 101325; // Standard atmospheric pressure in Pa
    return (1 - Math.pow(pressure / standardPressure, 0.190284)) * 145366.45 * 0.3048;
}

/**
 * Calculate Density Altitude
 * @param {number} pressureAltitude Pressure Altitude in meters (m)
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Density Altitude in meters (m)
 */
function densityAltitude(pressureAltitude: number, temperature: number): number {
    const standardTemperature = 288.15; // Standard temperature in Kelvin
    return pressureAltitude + (120 * (temperature - standardTemperature));
}

export default {
    pressureAltitude,
    densityAltitude
};
