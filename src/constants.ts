
export const CELSIUS_TO_KELVIN = 273.15;
export const STANDARD_MEAN_PRESSURE_SEA_LEVEL = 101325
export const STANDARD_MEAN_TEMPERATURE_CELCIUS = 15;
export const STANDARD_MEAN_TEMPERATURE_KELVIN = 288.15;
export const STANDARD_LAPSE_RATE = 0.0065;
export const DRY_ADIABATIC_LAPSE_RATE = 0.0098; // K/m - Rate at which unsaturated air cools as it rises

export interface IValuationSet {
    a: number, //millibar
    b: number, //constant
    c: number, //celcius degrees
    d: number; //celcius degrees
}

export const DEW_POINT_VALUATIONS: Record<string, IValuationSet> = {
    ARDENBUCK_DEFAULT: { a: 6.1121, b: 18.678, c: 257.14, d: 234.5 },
    DAVID_BOLTON: { a: 6.112, b: 17.67, c: 234.5, d: 234.5 }, //maximum error of 0.1%, for −30 °C ≤ T ≤ 35°C and 1% < RH < 100%
    SONNTAG1990: { a: 6.112, b: 17.62, c: 243.12, d: 234.5 }, //for −45 °C ≤ T ≤ 60 °C (error ±0.35 °C).
    PAROSCIENTIFIC: { a: 6.105, b: 17.27, c: 237.7, d: 234.5 }, //for 0 °C ≤ T ≤ 60 °C (error ±0.4 °C).
    ARDENBUCK_PLUS: { a: 6.1121, b: 17.368, c: 238.88, d: 234.5 }, //for 0 °C ≤ T ≤ 50 °C (error ≤ 0.05%).
    ARDENBUCK_MINUS: { a: 6.1121, b: 17.966, c: 247.15, d: 234.5 } //for −40 °C ≤ T ≤ 0 °C (error ≤ 0.06%).
} as const;

export interface AtmospericConstants {
    lapseRate: number;
    gravity: number;
    molarMass: number;
    gasConstant: number;
}

export const STANDARD_ATMOSPHERIC_CONSTANTS: AtmospericConstants = {
    lapseRate: 0.0065, // K/m Temperature lapse rate
    gravity: 9.80665, // m/s2 Gravitational acceleration
    molarMass: 0.0289644, //kg/mol (Molar mass of dry air)
    gasConstant: 8.31447 //J/(mol K) (Universal gas constant)
} as const;

export const DRY_AIR_CONSTANTS: AtmospericConstants = {
    lapseRate: 0.0065, // K/m Temperature lapse rate
    gravity: 9.80665, // m/s2 Gravitational acceleration
    molarMass: 0.0289644, //kg/mol (Molar mass of dry air)
    gasConstant: 287.05 //J/(mol K) for dry air
} as const;

export interface SaturationVaporCoefficients {
    REFERENCE_PRESSURE: number;
    MAGNUS_CONSTANT_B: number;
    MAGNUS_CONSTANT_C: number;
}

export const SATURATION_VAPOR_PRESSURE_COEFFICIENTS: SaturationVaporCoefficients = {
    REFERENCE_PRESSURE: 611.2, // Reference pressure at 0°C in Pascals
    MAGNUS_CONSTANT_B: 17.62, // Empirical constant for water vapor
    MAGNUS_CONSTANT_C: 243.12, // Empirical constant for water vapor in Celsius
} as const;

export interface THERMODYNAMIC_CONSTANTS {
    Rd: number; // Gas constant for dry air (J/(kg·K))
    Cp: number; // Specific heat at constant pressure (J/(kg·K))
    Lv: number; // Latent heat of vaporization (J/kg)
    p0: number; // Reference pressure (Pa, 1000 hPa)
};

export const DEFAULT_THERMODYNAMIC_CONSTANTS: THERMODYNAMIC_CONSTANTS = {
    Rd: 287,        // Gas constant for dry air (J/(kg·K))
    Cp: 1004,       // Specific heat at constant pressure (J/(kg·K))
    Lv: 2.5e6,      // Latent heat of vaporization (J/kg)
    p0: 100000      // Reference pressure (Pa, 1000 hPa)
};