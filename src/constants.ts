
const KELVIN = 273.15;
const STANDARD_MEAN_PRESSURE_SEA_LEVEL = 101325
const STANDARD_MEAN_TEMPERATURE_CELCIUS = 15;
const STANDARD_MEAN_TEMPERATURE_KELVIN = 288.15;

export interface AtmospericConstants {
    lapseRate: number;
    gravity: number;
    molarMass: number;
    gasConstant: number;
}

const DEFAULT_ATMOSPHERIC_CONSTANTS: AtmospericConstants = {
    lapseRate: 0.0065, // K/m Temperature lapse rate
    gravity: 9.80665, // m/s2 Gravitational acceleration
    molarMass: 0.0289644, //kg/mol (Molar mass of dry air)
    gasConstant: 8.31447 //J/(mol K) (Universal gas constant)
}

export default {
    KELVIN,
    STANDARD_MEAN_PRESSURE_SEA_LEVEL,
    STANDARD_MEAN_TEMPERATURE_CELCIUS,
    STANDARD_MEAN_TEMPERATURE_KELVIN,
    DEFAULT_ATMOSPHERIC_CONSTANTS
}