/**
 * Calculate Relative Humidity
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} dewPoint Dew Point in K (Kelvin)
 * @returns {number} Relative Humidity in percentage (%)
 */
function relativeHumidity(temperature: number, dewPoint: number): number {
    const T = temperature - 273.15; // Convert Kelvin to Celsius
    const Td = dewPoint - 273.15; // Convert Kelvin to Celsius

    const RH = 100 * (Math.exp((17.625 * Td) / (243.04 + Td)) / Math.exp((17.625 * T) / (243.04 + T)));
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
 * @param T Temperature in celcius
 * @returns Absolute Humidity
 */
function absoluteHumidityByRelativeHumidity(RH: number, T: number): number {
    const P = 22.064; // MPa - Critical Pressure for water (check if this is relevant to your use case)
    const R_specific = 461.5; // J/(kg·K) - Specific gas constant for water vapor

    const T_K = T + 273.15; // Convert temperature from Celsius to Kelvin
    const AH = (RH * P * 1000) / (R_specific * T_K);

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
    const T = temperature - 273.15; // Convert Kelvin to Celsius
    return 611.2 * Math.exp((17.67 * T) / (T + 243.5));
}

/**
 * Calculate Saturation Vapor Pressure using the Clausius-Clapeyron equation.
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Saturation Vapor Pressure in Pa (Pascal)
 */
function saturationVaporPressure(temperature: number): number {
    const T = temperature - 273.15; // Convert Kelvin to Celsius
    return 611.2 * Math.exp((17.62 * T) / (243.12 + T));
}

export default {
    relativeHumidity,
    absoluteHumidity,
    mixingRatio,
    vaporPressure,
    saturationVaporPressure,
    specificHumidity
};
