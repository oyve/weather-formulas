'use strict'
const KELVIN = 273.15;

const DEW_POINT_VALUATIONS = {
    ARDENBUCK_DEFAULT: { a: 6.1121, b: 18.678, c: 257.14, d: 234.5 },
    DAVID_BOLTON: { a: 6.112, b: 17.67, c: 234.5, d: 234.5 }, //maximum error of 0.1%, for −30 °C ≤ T ≤ 35°C and 1% < RH < 100%
    SONNTAG1990: { a: 6.112, b: 17.62, c: 243.12, d: 234.5 }, //for −45 °C ≤ T ≤ 60 °C (error ±0.35 °C).
    PAROSCIENTIFIC: { a: 6.105, b: 17.27, c: 237.7, d: 234.5 }, //for 0 °C ≤ T ≤ 60 °C (error ±0.4 °C).
    ARDENBUCK_PLUS: { a: 6.1121, b: 17.368, c: 238.88, d: 234.5 }, //for 0 °C ≤ T ≤ 50 °C (error ≤ 0.05%).
    ARDENBUCK_MINUS: { a: 6.1121, b: 17.966, c: 247.15, d: 234.5 } //for −40 °C ≤ T ≤ 0 °C (error ≤ 0.06%).
};

/**
 * Gets the Dew Point Valuation by temperature
 * @param {number} temperature Temperature in CELCIUS
 * @returns {Array<object>} Dew Point Valuation
 */
function dewPointValuationsByTemperature(temperature) {
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
 * @returns {number} Dew Point in Kelvin
 */
function dewPointMagnusFormula(temperature, humidity) {
    let T = kelvinToCelcius(temperature);
    let RH = humidity;
    let constants = dewPointValuationsByTemperature(T);

    let gammaT_RH = Math.log(RH / 100) + ((constants.b * T) / (constants.c + T));
    let Tdp = (constants.c * gammaT_RH) / (constants.b - gammaT_RH);

    return celciusToKelvin(Tdp);
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Dew Point in Kelvin
 */
function dewPointArdenBuckEquation(temperature, humidity) {
    let T = kelvinToCelcius(temperature);
    let RH = humidity;
    let constants = dewPointValuationsByTemperature(T);

    let gamma_T_RH = Math.log((RH / 100) * Math.exp((constants.b - (T / constants.d)) * (T / (constants.c + T))));
    let Tdp = (constants.c * gamma_T_RH) / (constants.b - gamma_T_RH);

    return celciusToKelvin(Tdp);
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} windSpeed Windspeed in M/S (meter per second)
 * @returns {number} Wind Chill Index in Kelvin
 */
function windChillIndex(temperature, windSpeed) {
    let v = meterPerSecondToKilometerPerHour(windSpeed);
    let Ta = kelvinToCelcius(temperature);
    let v_exp = (v ** 0.16);

    let Twc = 13.12 + (0.6215 * Ta) - (11.37 * v_exp) + (0.3965 * Ta * v_exp);
    return celciusToKelvin(Twc);
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @param {number} windSpeed Windspeed in M/S (meter per second)
 * @returns {number} Apparent Temperature in Kelvin
 */
function australianAapparentTemperature(temperature, humidity, windspeed) {
    let Ta = kelvinToCelcius(temperature);
    let v = windspeed;

    let e = (humidity / 100) * 6.015 * Math.exp((17.27 * Ta) / (237.7 + Ta));
    let AT = Ta + (0.33 * e) - (0.7 * v) - 4.00;

    return celciusToKelvin(AT);
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Heat Index in Kelvin
 */
function heatIndex(temperature, humidity) {
    if (humidity > 100 || humidity < 0) return null;

    let T = kelvinToCelcius(temperature);
    let R = humidity;

    let c1 = -8.78469475556;
    let c2 = 1.61139411;
    let c3 = 2.33854883889;
    let c4 = -0.14611605;
    let c5 = -0.012308094;
    let c6 = -0.0164248277778;
    let c7 = 0.002211732;
    let c8 = 0.00072546;
    let c9 = -0.000003582;

    let Te2 = (T ** 2);
    let Re2 = (R ** 2);

    let HI = (c1) + (c2 * T) + (c3 * R) + (c4 * T * R) + (c5 * Te2) + (c6 * Re2) + (c7 * Te2 * R) + (c8 * T * Re2) + (c9 * Te2 * Re2);

    return celciusToKelvin(HI);
}

/**
 * 
 * @param {number} heatIndexTemperature Temperature in K (Kelvin)
 * @returns {string} Heat Index Warning
 */
function heatIndexText(heatIndexTemperature) {
    let thresholds = [
        { lowerLimit: 52, text: "Extreme danger", warning: "Heat stroke is imminent." },
        { lowerLimit: 40, text: "Danger", warning: "Heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity." },
        { lowerLimit: 33, text: "Extreme caution", warning: "Heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke." },
        { lowerLimit: 26, text: "Caution", warning: "Fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps." }
    ];

    let result = thresholds.find((t) => heatIndexTemperature >= (t.lowerLimit + KELVIN));

    return result == null ? "No warning" : result;
}

/**
 * Gets the Humidex temperature
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Humidex in Kelvin
 */
function humidex(temperature, humidity) {
    let Tair = kelvinToCelcius(temperature);
    let Tdew = dewPointMagnusFormula(temperature, humidity);

    let e = 6.11 * Math.exp(5417.7530 * ((1 / 273.16) - (1 / Tdew)));
    let h = (0.5555) * (e - 10.0);
    let humidex = Tair + h;

    return celciusToKelvin(humidex);
}

/**
 * Gets the Humidex test warning
 * @param {number} humidex Temperature in K (Kelvin)
 * @returns {string} Humidex Warning
 */
function humidexText(humidex) {
    let thresholds = [
        { lowerLimit: 46, text: "Dangerous" },
        { lowerLimit: 40, text: "Great discomfort" },
        { lowerLimit: 30, text: "Some discomfort" }
    ];

    let result = thresholds.find((t) => humidex >= (t.lowerLimit + KELVIN));

    return result == null ? "No warning" : result;
}

/**
 * Convert Kelvin to Celcius
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Celcius
 */
function kelvinToCelcius(temperature) {
    return temperature - KELVIN;
}

/**
 * Convert Celcius to Kelvin
 * @param {number} temperature Temperature in C (Celcius)
 * @returns {number} Kelvin
 */
function celciusToKelvin(temperature) {
    return roundToTwoDecimals(temperature + KELVIN);
}

/**
 * Round decimal number to two decimals
 * @param {number} num Number
 * @returns {number} num rounded to two decimals
 */
function roundToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
}

/**
 * Convert M/S to KM/H
 * @param {number} mps Meter Per Second
 * @returns {number} KM/H
 */
function meterPerSecondToKilometerPerHour(mps) {
    return mps * 3.6;
}

module.exports = {
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
    meterPerSecondToKilometerPerHour
}