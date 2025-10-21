import * as c from '../constants';
import { celciusToKelvin, dewPointMagnusFormula, kelvinToCelcius } from '../formulas/temperature';

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
