'use strict'

//This code uses formulas and valuations derived from several Wikipedia articles:
//
//https://en.wikipedia.org/wiki/Dew_point
//https://en.wikipedia.org/wiki/Wind_chill#North_American_and_United_Kingdom_wind_chill_index
//https://en.wikipedia.org/wiki/Wind_chill#Australian_apparent_temperature
//https://en.wikipedia.org/wiki/Heat_index
//https://en.wikipedia.org/wiki/Humidex
//
//most variable names have been kept from the Wikipedia article to ease the reading.


const KELVIN = 273.15;

const DEW_POINT_VALUATIONS = {
    ARDENBUCK_DEFAULT: { a: 6.1121, b: 18.678, c: 257.14, d: 234.5 },
    DAVID_BOLTON: { a: 6.112, b: 17.67, c: 234.5, d: 234.5 }, //maximum error of 0.1%, for −30 °C ≤ T ≤ 35°C and 1% < RH < 100%
    SONNTAG1990: { a: 6.112, b: 17.62, c: 243.12, d: 234.5 }, //for −45 °C ≤ T ≤ 60 °C (error ±0.35 °C).
    PAROSCIENTIFIC: { a: 6.105, b: 17.27, c: 237.7, d: 234.5 }, //for 0 °C ≤ T ≤ 60 °C (error ±0.4 °C).
    ARDENBUCK_PLUS: { a: 6.1121, b: 17.368, c: 238.88, d: 234.5 }, //for 0 °C ≤ T ≤ 50 °C (error ≤ 0.05%).
    ARDENBUCK_MINUS: { a: 6.1121, b: 17.966, c: 247.15, d: 234.5 } //for −40 °C ≤ T ≤ 0 °C (error ≤ 0.06%).
};


function dewPointValuationsByTemperature(temperatureC) {
    if (temperatureC < 0) {
        return DEW_POINT_VALUATIONS.ARDENBUCK_MINUS;
    } else if (temperatureC >= 0 && temperatureC <= 50) {
        return DEW_POINT_VALUATIONS.ARDENBUCK_PLUS;
    } else if (temperatureC > 50) {
        return DEW_POINT_VALUATIONS.PAROSCIENTIFIC;
    } else {
        return DEW_POINT_VALUATIONS.ARDENBUCK_DEFAULT;
    }
}

function dewPointMagnusFormula(temperatureSI, humiditySI) {
    let T = kelvinToCelcius(temperatureSI);
    let RH = humiditySI;
    let constants = dewPointValuationsByTemperature(T);

    let gammaT_RH = Math.log(RH / 100) + ((constants.b * T) / (constants.c + T));
    let Tdp = (constants.c * gammaT_RH) / (constants.b - gammaT_RH);

    return celciusToKelvin(Tdp);
}

function dewPointArdenBuckEquation(temperatureSI, humiditySI) {
    let T = kelvinToCelcius(temperatureSI);
    let RH = humiditySI;
    let constants = dewPointValuationsByTemperature(T);

    let gamma_T_RH = Math.log((RH / 100) * Math.exp((constants.b - (T / constants.d)) * (T / (constants.c + T))));
    let Tdp = (constants.c * gamma_T_RH) / (constants.b - gamma_T_RH);

    return celciusToKelvin(Tdp);
}

function windChillIndex(temperatureSI, windSpeedSI) {
    let v = meterPerSecondToKilometerPerHour(windSpeedSI);
    let Ta = kelvinToCelcius(temperatureSI);
    let v_exp = (v ** 0.16);

    let Twc = 13.12 + (0.6215 * Ta) - (11.37 * v_exp) + (0.3965 * Ta * v_exp);
    return celciusToKelvin(Twc);
}

function australianAapparentTemperature(temperatureSI, humiditySI, windSpeedSI) {
    let Ta = kelvinToCelcius(temperatureSI);
    let v = windSpeedSI;

    let e = (humiditySI / 100) * 6.015 * Math.exp((17.27 * Ta) / (237.7 + Ta));
    let AT = Ta + (0.33 * e) - (0.7 * v) - 4.00;

    return celciusToKelvin(AT);
}

function heatIndex(temperatureSI, humiditySI) {
    if (humiditySI > 100 || humiditySI < 0) return null;

    let T = kelvinToCelcius(temperatureSI);
    let R = humiditySI;

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

function heatIndexText(heatIndexTemperatureSI) {
    let thresholds = [
        { lowerLimit: 52, text: "Extreme danger", warning: "Heat stroke is imminent." },
        { lowerLimit: 40, text: "Danger", warning: "Heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity." },
        { lowerLimit: 33, text: "Extreme caution", warning: "Heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke." },
        { lowerLimit: 26, text: "Caution", warning: "Fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps." }
    ];

    let result = thresholds.find((t) => {
        return heatIndexTemperatureSI >= (t.lowerLimit + KELVIN);
    });

    return result == null ? "No warning" : result;
}

function humidex(temperatureSI, humiditySI) {
    let Tair = kelvinToCelcius(temperatureSI);
    let Tdew = dewPointMagnusFormula(temperatureSI, humiditySI);

    let e = 6.11 * Math.exp(5417.7530 * ((1 / 273.16) - (1 / Tdew)));
    let h = (0.5555) * (e - 10.0);
    let humidex = Tair + h;

    return celciusToKelvin(humidex);
}

function humidexText(humidexSI) {
    let thresholds = [
        { lowerLimit: 46, text: "Dangerous" },
        { lowerLimit: 40, text: "Great discomfort" },
        { lowerLimit: 30, text: "Some discomfort" }
    ];

    let result = thresholds.find((t) => {
        return humidexSI >= (t.lowerLimit + KELVIN);
    });

    return result == null ? "No warning" : result;
}

function kelvinToCelcius(temperatureSI) {
    return temperatureSI - KELVIN;
}

function celciusToKelvin(temperatureC) {
    return roundToTwoDecimals(temperatureC + KELVIN);
}

function roundToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
}

function meterPerSecondToKilometerPerHour(meterPerSecond) {
    return meterPerSecond * 3.6;
}

module.exports = {
    dewPointMagnusFormula: dewPointMagnusFormula,
    dewPointArdenBuckEquation: dewPointArdenBuckEquation,
    windChillIndex: windChillIndex,
    australianAapparentTemperature: australianAapparentTemperature,
    heatIndex: heatIndex,
    heatIndexText: heatIndexText,
    humidex: humidex,
    humidexText: humidexText
}