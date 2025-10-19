import { Reading } from '../common';
import * as c from '../constants'

export interface IValuationSet {
    a: number, //millibar
    b: number, //constant
    c: number, //celcius degrees
    d: number; //celcius degrees
}

/**
 * Gets the Dew Point Valuation by temperature
 * @param {number} temperature Temperature in CELCIUS
 * @returns {Array<IValuationSet>} Dew Point Valuation
 */
export function dewPointValuationsByTemperature(temperature: number): IValuationSet {
    if (temperature < 0) {
        return c.DEW_POINT_VALUATIONS.ARDENBUCK_MINUS;
    } else if (temperature >= 0 && temperature <= 50) {
        return c.DEW_POINT_VALUATIONS.ARDENBUCK_PLUS;
    } else if (temperature > 50) {
        return c.DEW_POINT_VALUATIONS.PAROSCIENTIFIC;
    } else {
        return c.DEW_POINT_VALUATIONS.ARDENBUCK_DEFAULT;
    }
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @param {IValuationSet} valuationSet The valuation set to use in the calculation
 * @returns {number} Dew Point in Kelvin
 */
export function dewPointMagnusFormula(temperature: number, humidity: number, valuationSet?: IValuationSet): number {
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
export function dewPointArdenBuckEquation(temperature: number, humidity: number, valuationSet?: IValuationSet): number {
    const T: number = kelvinToCelcius(temperature);
    const RH: number = humidity;

    if(valuationSet === null || valuationSet === undefined) valuationSet = dewPointValuationsByTemperature(T);

    const gamma_T_RH = Math.log((RH / 100) * Math.exp((valuationSet.b - (T / valuationSet.d)) * (T / (valuationSet.c + T))));
    const Tdp = (valuationSet.c * gamma_T_RH) / (valuationSet.b - gamma_T_RH);

    return celciusToKelvin(Tdp);
}

/**
 * Calculate Equivalent Temperature (Teq).
 * Equivalent temperature is the temperature an air parcel would have if all water vapor were condensed and the latent heat released.
 * @param {number} temperature Temperature in Kelvin (K)
 * @param {number} mixingRatio Mixing ratio in kg/kg
 * @returns {number} Equivalent temperature in Kelvin (K)
 */
export function equivalentTemperature(temperature: number, mixingRatio: number, constants: c.THERMODYNAMIC_CONSTANTS = c.DEFAULT_THERMODYNAMIC_CONSTANTS): number {
    return temperature + (constants.Lv * mixingRatio) / constants.Cp;
}

/**
 * Calculate Potential Temperature
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} pressure Pressure in Pa (Pascal)
 * @returns {number} Potential Temperature in K (Kelvin)
 */
export function potentialTemperature(temperature: number, pressure: number): number {
    const standardPressure = 100000; // Standard pressure in Pa
    return temperature * Math.pow(standardPressure / pressure, 0.286);
}

/**
 * Calculate Virtual Temperature
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} mixingRatio Mixing Ratio in g/kg (grams per kilogram)
 * @returns {number} Virtual Temperature in K (Kelvin)
 */
export function virtualTemperature(temperature: number, mixingRatio: number): number {
    return temperature * (1 + 0.61 * (mixingRatio / 1000));
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} windSpeed Windspeed in M/S (meter per second)
 * @returns {number} Wind Chill Index in Kelvin
 */
export function windChillIndex(temperature: number, windSpeed: number): number {
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
export function australianApparentTemperature(temperature: number, humidity: number, windspeed: number): number {
    const Ta = kelvinToCelcius(temperature);
    const v = windspeed;

    const e = (humidity / 100) * 6.105 * Math.exp((17.27 * Ta) / (237.7 + Ta));
    const AT = Ta + (0.33 * e) - (0.7 * v) - 4.00;

    return celciusToKelvin(AT);
}

/**
 * 
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Heat Index in Kelvin
 */
export function heatIndex(temperature: number, humidity: number): number {
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
export function heatIndexText(heatIndexTemperature: number): null | {lowerLimit: number, text: string, warning: string} {
    let thresholds = [
        { lowerLimit: 52, text: "Extreme danger", warning: "Heat stroke is imminent." },
        { lowerLimit: 40, text: "Danger", warning: "Heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity." },
        { lowerLimit: 33, text: "Extreme caution", warning: "Heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke." },
        { lowerLimit: 26, text: "Caution", warning: "Fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps." }
    ];

    let result = thresholds.find((t) => heatIndexTemperature >= (t.lowerLimit + c.CELSIUS_TO_KELVIN));

    return result === undefined ? null : result;
}

/**
 * Gets the Humidex temperature
 * @param {number} temperature Temperature in K (Kelvin)
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Humidex in Kelvin
 */
export function humidex(temperature: number, humidity: number): number {
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
export function humidexText(humidex: number): null | {lowerLimit: number, text: string} {
    const thresholds = [
        { lowerLimit: 46, text: "Dangerous" },
        { lowerLimit: 40, text: "Great discomfort" },
        { lowerLimit: 30, text: "Some discomfort" }
    ];

    const result = thresholds.find((t) => humidex >= (t.lowerLimit + c.CELSIUS_TO_KELVIN));

    return result === undefined ? null : result;
}


// #### Physiological Equivalent Temperature ?????????????
///#### https://cds.climate.copernicus.eu/datasets/derived-utci-historical?tab=overview ??

/**
 * Returns the UTCI thermal stress category for a given temperature in Celsius.
 * @param {number} temperature - UTCI temperature in Kelvin
 * @returns {string} Thermal stress category
 */
export function UTCIAssessmentScale(temperature: number): string {
    const temperatureC = kelvinToCelcius(temperature);
    if (temperatureC >= 46) return "Extreme heat stress";
    if (temperatureC >= 38) return "Very strong heat stress";
    if (temperatureC >= 32) return "Strong heat stress";
    if (temperatureC >= 26) return "Moderate heat stress";
    if (temperatureC >= 9) return "No thermal stress";
    if (temperatureC >= 0) return "Slight cold stress";
    if (temperatureC >= -13) return "Moderate cold stress";
    if (temperatureC >= -27) return "Strong cold stress";
    if (temperatureC >= -40) return "Very strong cold stress";
    return "Extreme cold stress";
}

/**
 * Calculate the lapse rate
 * @param altitude1 Lower or higher altitude 1
 * @param T1 Temperature at altitude 1
 * @param altitude2 Lower or higher altitude 2
 * @param T2 Temperature at altitude 2
 * @returns Lapse rate
 */
export function calculateLapseRate(altitude1: number, T1: number, altitude2: number, T2: number) {
    return (T2 - T1) / (altitude2 - altitude1); // Kelvin/m
}

/**
 * Calculate dynamic lapse rate based on a range of altitude and temperature data
 * @param readings Readings data
 * @param hours Number of hours to read
 * @param filterByLastReading Filter by the datetime in the most recent reading
 * @returns Dynamic lapse rate, or default.
 */
export function calculateDynamicLapseRate(readings: Reading[], hours = 24, filterByLastReading = false) {
    const filteredReadings = filterReadingsByTimeRange(readings, hours);

    let totalLapseRate = 0;
    let count = 0;

    for (let i = 1; i < filteredReadings.length; i++) {
        const T1 = filteredReadings[i - 1].temperature;
        const altitude1 = filteredReadings[i - 1].altitude;
        const T2 = filteredReadings[i].temperature;
        const altitude2 = filteredReadings[i].altitude;

        if (altitude2 !== altitude1) {
            const lapseRate = calculateLapseRate(altitude1, T1, altitude2, T2);
            totalLapseRate += lapseRate;
            count++;
        }
    }

    return count > 0 ? totalLapseRate / count : 0.0065; // Default to standard lapse rate if no data
}


/**
 * 
 * @param readings Readings data
 * @param hours Hours to filter
 * @returns Weighted average temperature
 */
export function calculateWeightedAverageTemperature(readings: Reading[], hours = 24) {
    const filteredReadings = filterReadingsByTimeRange(readings, hours);

    let totalWeight = 0;
    let weightedSum = 0;

    for (let i = 1; i < filteredReadings.length; i++) {
        const T1 = filteredReadings[i - 1].temperature;
        const altitude1 = filteredReadings[i - 1].altitude;
        const T2 = filteredReadings[i].temperature;
        const altitude2 = filteredReadings[i].altitude;

        const weight = Math.abs(altitude2 - altitude1); // Altitude difference as weight
        const averageTemperature = (T1 + T2) / 2;

        weightedSum += averageTemperature * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : readings[0]?.temperature || 288.15; // Default to 15°C in Kelvin if no data
}

/**
 * 
 * @param readings Readings data
 * @param hours Filter by humber of hours to read
 * @param filterByLastReading Filter by the datetime in the most recent reading
 * @returns Readings within the given hours
 */
export function filterReadingsByTimeRange(readings: Reading[], hours: number, filterByLastReading = false) {
    readings.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()); //oldest to newest
    const cutoffTime = filterByLastReading ? readings[readings.length - 1].datetime.getTime() - hours * 60 * 60 * 1000 : Date.now() - hours * 60 * 60 * 1000; // Convert hours to milliseconds

    const filteredReadings = readings.filter((reading) => reading.datetime.getTime() >= cutoffTime);

    return filteredReadings;
}

/**
 * 
 * @param altitude1 Lower or higher altitude 1
 * @param T1 Temperature at altitude 1
 * @param altitude2 Lower og higher altitude 2
 * @param T2 Temperature at altitude 2
 * @returns True if inversion is detected
 */
export function isTemperatureInversion(altitude1: number, T1: number, altitude2: number, T2: number) {
    const lapseRate = calculateLapseRate(altitude1, T1, altitude2, T2);
    return lapseRate > 0;
}

/**
 * Adjust pressure to sea level by fixed lapse ratio.
 * @param {number} altitude altitude in meters.
 * @param {number} temperature temperature at altitude in Celcius|Kelvin|Fahrenheit.
 * @param {number} lapseRate Custom lapse rate. Defaults to standard lapse rate.
 * @returns Adjusted pressure
 */
export function adjustTemperatureByLapseRate(altitude: number, temperature: number, lapseRate: number = c.STANDARD_LAPSE_RATE) {
    return temperature + lapseRate * altitude;
}

/**
 * Convert Kelvin to Celcius
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Celcius
 */
export function kelvinToCelcius(temperature: number): number {
    return temperature - c.CELSIUS_TO_KELVIN;
}

/**
 * Convert Celcius to Kelvin
 * @param {number} temperature Temperature in C (Celcius)
 * @returns {number} Kelvin
 */
export function celciusToKelvin(temperature: number): number {
    return temperature + c.CELSIUS_TO_KELVIN;
}

/**
 * 
 * @param celcius Celcius degrees
 * @returns Fahrenheit degrees
 */
export function celciusToFahrenheit(celcius: number): number {
    return (celcius * 9/5) + 32;
}

/**
 * 
 * @param fahrenheit Fahrenheit degrees
 * @returns Celcius degrees
 */
export function fahrenheitToCelcius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
}

/**
 * 
 * @param kelvin Kelvin degrees
 * @returns Fahrenheit degrees
 */
export function kelvinToFahrenheit(kelvin: number): number {
    return (kelvin - c.CELSIUS_TO_KELVIN) * 9/5 + 32;
}

/**
 * 
 * @param fahrenheit Fahrenheit degrees
 * @returns Kelvin degrees
 */
export function fahrenheitToKelvin(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9 + c.CELSIUS_TO_KELVIN;
}

/**
 * Round decimal number to two decimals
 * @param {number} num Number
 * @returns {number} num rounded to two decimals
 */
export function roundToTwoDecimals(num: number): number {
    return Math.round(num * 100) / 100;
}

/**
 * Convert M/S to KM/H
 * @param {number} mps Meter Per Second
 * @returns {number} KM/H
 */
export function meterPerSecondToKilometerPerHour(mps: number): number {
    return mps * 3.6;
}

/**
 * Calculate Wet-Bulb Temperature using the Stull formula.
 * @param {number} temperature Temperature in Kelvin (K)
 * @param {number} humidity Relative Humidity in percentage (%)
 * @returns {number} Wet-Bulb Temperature in Kelvin (K)
 */
export function wetBulbTemperature(temperature: number, humidity: number): number {
    const T = kelvinToCelcius(temperature);

    const wetBulbCelsius =
        T * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) +
        Math.atan(T + humidity) -
        Math.atan(humidity - 1.676331) +
        0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
        4.686035;

    return celciusToKelvin(wetBulbCelsius);
}


/**
 * Estimates dry bulb temperature in Kelvin from wet bulb temperature and relative humidity.
 * Uses iterative search based on the Stull approximation.
 * @param wetBulbTemperature - Wet bulb temperature in Kelvin
 * @param relativeHumidity - Relative humidity in percentage (0–100)
 * @returns Estimated dry bulb temperature in Kelvin
 */
export function estimateDryBulbTemperature(wetBulbTemperature: number, relativeHumidity: number): number {
  const rh = Math.max(0, Math.min(100, relativeHumidity)); // Clamp RH
  const wetBulbC = kelvinToCelcius(wetBulbTemperature);

  // Search range: 0°C to 60°C
  let bestMatch = 0;
  let minError = Infinity;

  for (let tC = 0; tC <= 60; tC += 0.01) {
    const estimatedWetBulb =
      tC * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
      Math.atan(tC + rh) -
      Math.atan(rh - 1.676331) +
      0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
      4.686035;

    const error = Math.abs(estimatedWetBulb - wetBulbC);
    if (error < minError) {
      minError = error;
      bestMatch = tC;
    }
  }

  return celciusToKelvin(bestMatch);
}