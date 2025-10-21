import * as c from '../constants';
import { celciusToKelvin, kelvinToCelcius } from '../formulas/temperature';

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
export function heatIndexCategory(heatIndexTemperature: number): null | {lowerLimit: number, text: string, warning: string} {
    let thresholds = [
        { lowerLimit: 52, text: "Extreme danger", warning: "Heat stroke is imminent." },
        { lowerLimit: 40, text: "Danger", warning: "Heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity." },
        { lowerLimit: 33, text: "Extreme caution", warning: "Heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke." },
        { lowerLimit: 26, text: "Caution", warning: "Fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps." }
    ];

    let result = thresholds.find((t) => heatIndexTemperature >= (t.lowerLimit + c.CELSIUS_TO_KELVIN));

    return result === undefined ? null : result;
}