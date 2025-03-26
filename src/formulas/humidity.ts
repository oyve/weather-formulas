import c from '../../src/constants';

/**
 * Calculate Relative Humidity
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} dewPoint Dew Point in K (Kelvin)
 * @returns {number} Relative Humidity in percentage (%)
 */
function relativeHumidity(temperature: number, dewPoint: number): number {
    const RH = 100 * (Math.exp((17.625 * (dewPoint - c.KELVIN)) / (243.04 + (dewPoint - c.KELVIN))) /
                      Math.exp((17.625 * (temperature - c.KELVIN)) / (243.04 + (temperature - c.KELVIN))));
    return RH;
}

/**
 * 
 * @param mH20 Mass of water vapor g/m3
 * @param Vnet Volume of air (m3)
 * @returns 
 */
function absoluteHumidity(mH2O: number, Vnet: number): number {
    if (Vnet <= 0) {
        throw new Error("Vnet must be greater than 0 to avoid division by zero.");
    }
    const AH = mH2O / Vnet; // AH: absolute humidity (mass of water vapor per unit volume)
    return AH;
}

/**
 * 
 * @param RH Relative humidty
 * @param T Temperature in Kelvin
 * @returns Absolute Humidity
 */
function absoluteHumidityByRelativeHumidity(RH: number, T: number): number {
    const P = 22.064; // MPa - Critical Pressure for water
    const R_specific = 461.5; // J/(kg·K) - Specific gas constant for water vapor

    const AH = (RH * P * 1000) / (R_specific * T);

    return AH; // Returns absolute humidity in appropriate units (likely g/m³ based on input)
}

/**
 * Calculate Specific Humidity
 * @param {number} mixingRatio Mixing Ratio in g/kg (grams per kilogram)
 * @returns {number} Specific Humidity in kg/kg (kilograms per kilogram)
 */
function specificHumidity(mixingRatio: number): number {
    return mixingRatio / (1 + mixingRatio);
}

/**
 * Calculate Mixing Ratio
 * @param {number} vaporPressure Vapor Pressure in Pa (Pascal)
 * @param {number} pressure Pressure in Pa (Pascal)
 * @returns {number} Mixing Ratio in g/kg (grams per kilogram)
 */
function mixingRatio(vaporPressure: number, pressure: number): number {
    return (0.622 * vaporPressure) / (pressure - vaporPressure) * 1000;
}

/**
 * Calculate Vapor Pressure using the Clausius-Clapeyron equation.
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Vapor Pressure in Pa (Pascal)
 */
function vaporPressure(temperature: number): number {
    const T = temperature; // Keep temperature in Kelvin
    return 611.2 * Math.exp((17.67 * (T - c.KELVIN)) / ((T - c.KELVIN) + 243.5));
}

/**
 * Calculate Saturation Vapor Pressure using the Clausius-Clapeyron equation.
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Saturation Vapor Pressure in Pa (Pascal)
 */
function saturationVaporPressure(temperature: number): number {
    const T = temperature; // Keep temperature in Kelvin
    return 611.2 * Math.exp((17.62 * (T - c.KELVIN)) / (243.12 + (T - c.KELVIN)));
}

export default {
    relativeHumidity,
    absoluteHumidity,
    absoluteHumidityByRelativeHumidity,
    mixingRatio,
    vaporPressure,
    saturationVaporPressure,
    specificHumidity
};
