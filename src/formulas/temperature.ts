import c from '../constants'

export interface IValuationSet {
    a: number, //millibar
    b: number, //constant
    c: number, //celcius degrees
    d: number; //celcius degrees
}

const DEW_POINT_VALUATIONS = {
    ARDENBUCK_DEFAULT: { a: 6.1121, b: 18.678, c: 257.14, d: 234.5 },
    DAVID_BOLTON: { a: 6.112, b: 17.67, c: 234.5, d: 234.5 }, //maximum error of 0.1%, for −30 °C ≤ T ≤ 35°C and 1% < RH < 100%
    SONNTAG1990: { a: 6.112, b: 17.62, c: 243.12, d: 234.5 }, //for −45 °C ≤ T ≤ 60 °C (error ±0.35 °C).
    PAROSCIENTIFIC: { a: 6.105, b: 17.27, c: 237.7, d: 234.5 }, //for 0 °C ≤ T ≤ 60 °C (error ±0.4 °C).
    ARDENBUCK_PLUS: { a: 6.1121, b: 17.368, c: 238.88, d: 234.5 }, //for 0 °C ≤ T ≤ 50 °C (error ≤ 0.05%).
    ARDENBUCK_MINUS: { a: 6.1121, b: 17.966, c: 247.15, d: 234.5 } //for −40 °C ≤ T ≤ 0 °C (error ≤ 0.06%).
} as const;

/**
 * Gets the Dew Point Valuation by temperature
 * @param {number} temperature Temperature in CELCIUS
 * @returns {Array<IValuationSet>} Dew Point Valuation
 */
function dewPointValuationsByTemperature(temperature: number): IValuationSet {
    if (temperature < 0) {
        return DEW_POINT_VALUATIONS.ARDENBUCK_MINUS;
    } else if (temperature >= 0 && temperature <= 50) {
        return DEW_POINT_VALUATIONS.ARDENBUCK_PLUS;
    } else if (temperature > 50) {
        return DEW_POINT_VALUATIONS.PAROSCIENTIFIC;
    } else {
        return DEW_POINT_VALUATIONS.ARDENBUCK_DEFAULT;
    }
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @param {IValuationSet} valuationSet The valuation set to use in the calculation
 * @returns {number} Dew Point in Kelvin
 */
function dewPointMagnusFormula(temperature: number, humidity: number, valuationSet?: IValuationSet): number {
    const T: number = kelvinToCelcius(temperature);
    const RH: number = humidity;

    if(valuationSet === null || valuationSet === undefined) valuationSet = dewPointValuationsByTemperature(T);
    
    const gammaT_RH = Math.log(RH / 100) + ((valuationSet.b * T) / (valuationSet.c + T));
    const Tdp = (valuationSet.c * gammaT_RH) / (valuationSet.b - gammaT_RH);

    return celciusToKelvin(Tdp);
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @param {IValuationSet} valuationSet The valuation set to use in the calculation
 * @returns {number} Dew Point in Kelvin
 */
function dewPointArdenBuckEquation(temperature: number, humidity: number, valuationSet?: IValuationSet): number {
    const T: number = kelvinToCelcius(temperature);
    const RH: number = humidity;

    if(valuationSet === null || valuationSet === undefined) valuationSet = dewPointValuationsByTemperature(T);

    const gamma_T_RH = Math.log((RH / 100) * Math.exp((valuationSet.b - (T / valuationSet.d)) * (T / (valuationSet.c + T))));
    const Tdp = (valuationSet.c * gamma_T_RH) / (valuationSet.b - gamma_T_RH);

    return celciusToKelvin(Tdp);
}

/**
 * Calculate Potential Temperature
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} pressure Pressure in Pa (Pascal)
 * @returns {number} Potential Temperature in K (Kelvin)
 */
function potentialTemperature(temperature: number, pressure: number): number {
    const standardPressure = 100000; // Standard pressure in Pa
    return temperature * Math.pow(standardPressure / pressure, 0.286);
}

/**
 * Calculate Virtual Temperature
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} mixingRatio Mixing Ratio in g/kg (grams per kilogram)
 * @returns {number} Virtual Temperature in K (Kelvin)
 */
function virtualTemperature(temperature: number, mixingRatio: number): number {
    return temperature * (1 + 0.61 * (mixingRatio / 1000));
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} windSpeed Windspeed in M/S (meter per second)
 * @returns {number} Wind Chill Index in Kelvin
 */
function windChillIndex(temperature: number, windSpeed: number): number {
    const v = meterPerSecondToKilometerPerHour(windSpeed);
    const Ta = kelvinToCelcius(temperature);
    const v_exp = (v ** 0.16);

    const Twc = 13.12 + (0.6215 * Ta) - (11.37 * v_exp) + (0.3965 * Ta * v_exp);
    return celciusToKelvin(Twc);
}

/**
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @param {number} windspeed Windspeed in M/S (meter per second)
 * @returns {number} Apparent Temperature in Kelvin
 */
function australianAapparentTemperature(temperature: number, humidity: number, windspeed: number): number {
    const Ta = kelvinToCelcius(temperature);
    const v = windspeed;

    const e = (humidity / 100) * 6.015 * Math.exp((17.27 * Ta) / (237.7 + Ta));
    const AT = Ta + (0.33 * e) - (0.7 * v) - 4.00;

    return celciusToKelvin(AT);
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Heat Index in Kelvin
 */
function heatIndex(temperature: number, humidity: number): number {
    if (humidity > 100 || humidity < 0) throw("Not a valid humidity");

    const T = kelvinToCelcius(temperature);
    const R = humidity;

    const c1 = -8.78469475556;
    const c2 = 1.61139411;
    const c3 = 2.33854883889;
    const c4 = -0.14611605;
    const c5 = -0.012308094;
    const c6 = -0.0164248277778;
    const c7 = 0.002211732;
    const c8 = 0.00072546;
    const c9 = -0.000003582;

    const Te2 = (T ** 2);
    const Re2 = (R ** 2);

    const HI = (c1) + (c2 * T) + (c3 * R) + (c4 * T * R) + (c5 * Te2) + (c6 * Re2) + (c7 * Te2 * R) + (c8 * T * Re2) + (c9 * Te2 * Re2);

    return celciusToKelvin(HI);
}

/**
 * 
 * @param {number} heatIndexTemperature Temperature in K (Kelvin)
 * @returns {string} Heat Index Warning
 */
function heatIndexText(heatIndexTemperature: number): null | {lowerLimit: number, text: string, warning: string} {
    let thresholds = [
        { lowerLimit: 52, text: "Extreme danger", warning: "Heat stroke is imminent." },
        { lowerLimit: 40, text: "Danger", warning: "Heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity." },
        { lowerLimit: 33, text: "Extreme caution", warning: "Heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke." },
        { lowerLimit: 26, text: "Caution", warning: "Fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps." }
    ];

    let result = thresholds.find((t) => heatIndexTemperature >= (t.lowerLimit + c.KELVIN));

    return result === undefined ? null : result;
}

/**
 * Gets the Humidex temperature
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Humidex in Kelvin
 */
function humidex(temperature: number, humidity: number): number {
    const Tair = kelvinToCelcius(temperature);
    const Tdew = dewPointMagnusFormula(temperature, humidity);

    const e = 6.11 * Math.exp(5417.7530 * ((1 / 273.16) - (1 / Tdew)));
    const h = (0.5555) * (e - 10.0);
    const humidex = Tair + h;

    return celciusToKelvin(humidex);
}

/**
 * Gets the Humidex test warning
 * @param {number} humidex Temperature in K (Kelvin)
 * @returns {string} Humidex Warning
 */
function humidexText(humidex: number): null | {lowerLimit: number, text: string} {
    const thresholds = [
        { lowerLimit: 46, text: "Dangerous" },
        { lowerLimit: 40, text: "Great discomfort" },
        { lowerLimit: 30, text: "Some discomfort" }
    ];

    const result = thresholds.find((t) => humidex >= (t.lowerLimit + c.KELVIN));

    return result === undefined ? null : result;
}

/**
 * Convert Kelvin to Celcius
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Celcius
 */
function kelvinToCelcius(temperature: number): number {
    return temperature - c.KELVIN;
}

/**
 * Convert Celcius to Kelvin
 * @param {number} temperature Temperature in C (Celcius)
 * @returns {number} Kelvin
 */
function celciusToKelvin(temperature: number): number {
    return roundToTwoDecimals(temperature + c.KELVIN);
}

/**
 * 
 * @param celcius Celcius degrees
 * @returns Fahrenheit degrees
 */
function celciusToFahrenheit(celcius: number): number {
    return (celcius * 9/5) + 32;
}

/**
 * 
 * @param fahrenheit Fahrenheit degrees
 * @returns Celcius degrees
 */
function fahrenheitToCelcius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
}

/**
 * 
 * @param kelvin Kelvin degrees
 * @returns Fahrenheit degrees
 */
function kelvinToFahrenheit(kelvin: number): number {
    return (kelvin - c.KELVIN) * 9/5 + 32;
}

/**
 * 
 * @param fahrenheit Fahrenheit degrees
 * @returns Kelvin degrees
 */
function fahrenheitToKelvin(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9 + c.KELVIN;
}

/**
 * Round decimal number to two decimals
 * @param {number} num Number
 * @returns {number} num rounded to two decimals
 */
function roundToTwoDecimals(num: number): number {
    return Math.round(num * 100) / 100;
}

/**
 * Convert M/S to KM/H
 * @param {number} mps Meter Per Second
 * @returns {number} KM/H
 */
function meterPerSecondToKilometerPerHour(mps: number): number {
    return mps * 3.6;
}

export default {
    dewPointMagnusFormula,
    dewPointArdenBuckEquation,
    windChillIndex,
    australianAapparentTemperature,
    heatIndex,
    heatIndexText,
    humidex,
    humidexText,
    roundToTwoDecimals,
    kelvinToCelcius,
    celciusToKelvin,
    celciusToFahrenheit,
    fahrenheitToCelcius,
    kelvinToFahrenheit,
    fahrenheitToKelvin,
    meterPerSecondToKilometerPerHour,
    potentialTemperature,
    virtualTemperature,
    DEW_POINT_VALUATIONS
}