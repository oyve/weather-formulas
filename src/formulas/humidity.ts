import c, {SaturationVaporCoefficients} from '../constants';

/**
 * Calculate Relative Humidity
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} dewPoint Dew Point in K (Kelvin)
 * @returns {number} Relative Humidity in percentage (%)
 */
function relativeHumidity(temperature: number, dewPoint: number): number {
    const RH = 100 * (Math.exp((17.625 * (dewPoint - c.CELSIUS_TO_KELVIN)) / (243.04 + (dewPoint - c.CELSIUS_TO_KELVIN))) /
                      Math.exp((17.625 * (temperature - c.CELSIUS_TO_KELVIN)) / (243.04 + (temperature - c.CELSIUS_TO_KELVIN))));
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
 * @param RH Relative humidity %
 * @param T Temperature in Kelvin
 * @returns Absolute Humidity
 */
function absoluteHumidityByRelativeHumidity(RH: number, T: number): number {
    const M_w = 18.015; // g/mol - Molar mass of water vapor
    const R = c.STANDARD_ATMOSPHERIC_CONSTANTS.gasConstant; // J/(mol·K) - Universal gas constant

    // Calculate saturation vapor pressure (Pa)
    const P_sat = saturationVaporPressure(T);

    // Convert RH from percentage to fraction
    const RH_fraction = RH / 100;

    // Calculate absolute humidity (g/m³)
    const AH = (RH_fraction * P_sat * M_w) / (R * T);

    return AH;
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
    if (pressure <= vaporPressure) {
        throw new Error("Barometric pressure must be greater than vapor pressure.");
    }
    return (0.622 * vaporPressure) / (pressure - vaporPressure) * 1000;
}

/**
 * Calculate Vapor Pressure using the Clausius-Clapeyron equation.
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Vapor Pressure in Pa (Pascal)
 */
function vaporPressure(temperature: number): number {
    const T = temperature; // Keep temperature in Kelvin
    return 611.2 * Math.exp((17.67 * (T - c.CELSIUS_TO_KELVIN)) / ((T - c.CELSIUS_TO_KELVIN) + 243.5));
}

/**
 * Calculates the actual vapor pressure of water vapor in the air.
 * @param {number} saturationVaporPressure - Saturation vapor pressure in Pascals (Pa).
 * @param {number} relativeHumidity - Relative Humidity in percentage (%).
 * @returns {number} - Actual vapor pressure in Pascals (Pa).
 */
function actualVaporPressure(saturationVaporPressure: number, relativeHumidity: number): number {
    return (relativeHumidity / 100) * saturationVaporPressure;
}

/**
 * Calculate Saturation Vapor Pressure using the Clausius-Clapeyron equation.
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Saturation Vapor Pressure in Pa (Pascal)
 */
function saturationVaporPressure(temperature: number, constants: SaturationVaporCoefficients = c.SATURATION_VAPOR_PRESSURE_COEFFICIENTS): number {
    return constants.REFERENCE_PRESSURE * Math.exp((constants.MAGNUS_CONSTANT_B * (temperature - c.CELSIUS_TO_KELVIN)) / (constants.MAGNUS_CONSTANT_C + (temperature - c.CELSIUS_TO_KELVIN)));
}

function specificGasConstantForMoistAir(mixingRatio: number): number {
    const R_d = 287.058; // Specific gas constant for dry air (J/(kg·K))
    return R_d / (1 + 0.61 * mixingRatio);
}

/**
 * Calculate the dew point depression.
 * @param {number} airTemperature - The air temperature in Kelvin.
 * @param {number} dewPointTemperature - The dew point temperature in Kelvin.
 * @returns {number} The dew point depression in Kelvin.
 */
function dewPointDepression(airTemperature: number, dewPointTemperature: number): number {
    return airTemperature - dewPointTemperature;
}

export default {
    relativeHumidity,
    absoluteHumidity,
    absoluteHumidityByRelativeHumidity,
    mixingRatio,
    vaporPressure,
    actualVaporPressure,
    saturationVaporPressure,
    specificHumidity,
    specificGasConstantForMoistAir,
    dewPointDepression
};
