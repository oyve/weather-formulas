"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Calculate Relative Humidity
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} dewPoint Dew Point in K (Kelvin)
 * @returns {number} Relative Humidity in percentage (%)
 */
function relativeHumidity(temperature, dewPoint) {
    const T = temperature - 273.15; // Convert Kelvin to Celsius
    const Td = dewPoint - 273.15; // Convert Kelvin to Celsius
    const RH = 100 * (Math.exp((17.625 * Td) / (243.04 + Td)) / Math.exp((17.625 * T) / (243.04 + T)));
    return RH;
}
/**
 * Calculate Mixing Ratio
 * @param {number} vaporPressure Vapor Pressure in Pa (Pascal)
 * @param {number} pressure Pressure in Pa (Pascal)
 * @returns {number} Mixing Ratio in g/kg (grams per kilogram)
 */
function mixingRatio(vaporPressure, pressure) {
    return (0.622 * vaporPressure) / (pressure - vaporPressure) * 1000;
}
/**
 * Calculate Vapor Pressure using the Clausius-Clapeyron equation.
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Vapor Pressure in Pa (Pascal)
 */
function vaporPressure(temperature) {
    const T = temperature - 273.15; // Convert Kelvin to Celsius
    return 611.2 * Math.exp((17.67 * T) / (T + 243.5));
}
/**
 * Calculate Saturation Vapor Pressure using the Clausius-Clapeyron equation.
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Saturation Vapor Pressure in Pa (Pascal)
 */
function saturationVaporPressure(temperature) {
    const T = temperature - 273.15; // Convert Kelvin to Celsius
    return 611.2 * Math.exp((17.62 * T) / (243.12 + T));
}
/**
 * Calculate Specific Humidity
 * @param {number} mixingRatio Mixing Ratio in g/kg (grams per kilogram)
 * @returns {number} Specific Humidity in kg/kg (kilograms per kilogram)
 */
function specificHumidity(mixingRatio) {
    return mixingRatio / (1 + mixingRatio);
}
exports.default = {
    relativeHumidity,
    mixingRatio,
    vaporPressure,
    saturationVaporPressure,
    specificHumidity
};
