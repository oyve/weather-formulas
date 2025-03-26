import c, {AtmospericConstants} from '../constants'

/**
 * Calculate Pressure Altitude
 * @param {number} pressure Pressure in Pa (Pascal)
 * @returns {number} Pressure Altitude in meters (m)
 */
function pressureAltitude(pressure: number): number {
    return (1 - Math.pow(pressure / c.STANDARD_MEAN_PRESSURE_SEA_LEVEL, 0.190284)) * 145366.45 * 0.3048;
}
    
/**
 * Calculate Density Altitude
 * @param {number} pressureAltitude Pressure Altitude in meters (m)
 * @param {number} temperature Temperature in K (Kelvin)
 * @returns {number} Density Altitude in meters (m)
 */
function densityAltitude(pressureAltitude: number, temperature: number): number {
    return pressureAltitude + (120 * (temperature - c.STANDARD_MEAN_TEMPERATURE_KELVIN));
}

/**
 * 
 * @description This function reduces observerd pressure to sea level using a faster, simpler calculation for standard sea level mean temperature (15C), but will be off with other temperatures.
 * @param pressureObserved Observed pressure
 * @param altitude Altitude of observered pressure
 * @param temperatureAtSeaLevel Temperature at sea level. Default standard mean temperature: 15 Celcius
 * @returns {number} Reduced pressure to sea level in Pascals with two decimal precision
 */
function adjustPressureToSeaLevelSimple(pressureObserved: number, altitude: number, temperatureAtSeaLevel: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN): number {
	let pressureSeaLevel = pressureObserved * Math.pow(1 - ((0.0065 * altitude) / (temperatureAtSeaLevel + 0.0065 * altitude)), -5.257);

	return Number(pressureSeaLevel.toFixed(2));
}

/**
 * 
 * @description This function reduces observed pressure to sea level with more accuracy for different temperatures, and with option to replace Earth's standard constants.
 * @param pressureObserved Observed pressure
 * @param altitude Altitude of observered pressure
 * @param temperatureAtSeaLevel Temperature at sea level in Kelvin. Default standard mean temperature: 15 Celcius
 * @returns {number} Reduced pressure to sea level in Pascals with two decimal precision
 */
function adjustPressureToSeaLevelAdvanced(pressureObserved: number, altitude: number, temperatureAtSeaLevel: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN, constants: AtmospericConstants = c.DEFAULT_ATMOSPHERIC_CONSTANTS): number {
    let pressureSeaLevel = pressureObserved * Math.pow(
        (1 - (constants.lapseRate * altitude) / temperatureAtSeaLevel),
        (constants.gravity * constants.molarMass) / (constants.gasConstant * constants.lapseRate));

    return Number(pressureSeaLevel.toFixed(2));
}

export default {
    pressureAltitude,
    densityAltitude,
    adjustPressureToSeaLevelSimple,
    adjustPressureToSeaLevelAdvanced
};
