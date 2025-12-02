import { Reading } from '../common';
import * as c from '../constants';
import { saturationVaporPressure, actualVaporPressure, mixingRatio as calcMixingRatio } from './humidity';
import { virtualTemperature } from './temperature';

/**
 * Estimate the altitude (in meters) where the temperature drops below freezing (0°C).
 * Assumes a linear lapse rate (default: 0.0065 K/m).
 * @param {number} surfaceTemp - Surface temperature in Kelvin.
 * @param {number} surfaceAltitude - Surface altitude in meters.
 * @param {number} lapseRate - Lapse rate in Kelvin per meter (default: 0.0065).
 * @returns {number | null} Altitude in meters where temperature is 273.15 K (0°C), or null if already below freezing.
 */
export function freezingLevelAltitude(
    surfaceTemp: number,
    surfaceAltitude: number = 0,
    lapseRate: number = 0.0065
): number | null {
    if (surfaceTemp <= 273.15) return null; // Already freezing or below at surface
    // Calculate altitude difference needed to reach 0°C (273.15 K)
    const altitudeDiff = (surfaceTemp - 273.15) / lapseRate;
    return surfaceAltitude + altitudeDiff;
}

/**
 * Calculate the final altitude from a pressure difference using the hypsometric formula.
 * Given a reference pressure at a known altitude and an observed pressure, this function
 * returns the altitude at which the observed pressure occurs.
 * 
 * For dry air conditions, the formula uses the specific gas constant for dry air (287.05 J/(kg·K)).
 * For moist air conditions (when humidity parameters are provided), the formula uses the virtual
 * temperature approach which accounts for the lower density of moist air compared to dry air.
 * This correction typically results in slightly higher altitude estimates for the same pressure
 * difference, as moist air is less dense than dry air at the same temperature and pressure.
 * 
 * The function supports three modes for humidity:
 * 1. No humidity: Dry air calculation (no humidity parameters provided)
 * 2. Single humidity: Uses the same relative humidity for both reference and observed altitudes
 * 3. Separate humidities: Uses different humidity values for reference and observed altitudes,
 *    which provides more accurate results when humidity varies significantly between the two levels
 * 
 * @param {number} referencePressure - Reference pressure in Pascals (Pa) at the reference altitude.
 * @param {number} observedPressure - Observed pressure in Pascals (Pa) at the unknown altitude.
 * @param {number} referenceAltitude - Altitude in meters (m) where the reference pressure was measured. Defaults to 0 (sea level).
 * @param {number} temperature - Average temperature in Kelvin (K) between the two altitudes. Defaults to 288.15 K (15°C).
 * @param {number} [relativeHumidity] - Optional relative humidity in percentage (0-100%). When provided without referenceHumidity/observedHumidity, this value is used for both altitudes.
 * @param {number} [referenceHumidity] - Optional relative humidity in percentage (0-100%) at the reference altitude. When provided along with observedHumidity, allows for more accurate calculations when humidity varies with altitude.
 * @param {number} [observedHumidity] - Optional relative humidity in percentage (0-100%) at the observed altitude. When provided along with referenceHumidity, allows for more accurate calculations when humidity varies with altitude.
 * @returns {number} The final altitude in meters (m) where the observed pressure occurs.
 * 
 * @example
 * // Calculate altitude for dry air when pressure drops from 101325 Pa (sea level) to 89874 Pa
 * const altitudeDry = altitudeFromPressureDifference(101325, 89874, 0, 288.15);
 * console.log(altitudeDry); // ~1011 m
 * 
 * @example
 * // Calculate altitude for moist air (60% relative humidity at both levels)
 * const altitudeMoist = altitudeFromPressureDifference(101325, 89874, 0, 288.15, 60);
 * console.log(altitudeMoist); // ~1021 m (slightly higher due to lower density of moist air)
 * 
 * @example
 * // Calculate altitude with different humidity at reference (80%) and observed (40%) altitudes
 * const altitudeVarying = altitudeFromPressureDifference(101325, 89874, 0, 288.15, undefined, 80, 40);
 * console.log(altitudeVarying); // More accurate when humidity varies with altitude
 * 
 * @see https://en.wikipedia.org/wiki/Hypsometric_equation
 * @see https://en.wikipedia.org/wiki/Virtual_temperature
 */
export function altitudeFromPressureDifference(
    referencePressure: number,
    observedPressure: number,
    referenceAltitude: number = 0,
    temperature: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN,
    relativeHumidity?: number,
    referenceHumidity?: number,
    observedHumidity?: number
): number {
    const g = c.DRY_AIR_CONSTANTS.gravity; // Gravitational acceleration (m/s²)
    const R = c.DRY_AIR_CONSTANTS.gasConstant; // Specific gas constant for dry air (J/(kg·K))
    
    // Determine the effective temperature to use in the calculation
    let effectiveTemperature = temperature;
    
    // Determine which humidity values to use
    // Priority: referenceHumidity/observedHumidity pair > relativeHumidity > no humidity (dry air)
    const hasSeparateHumidities = referenceHumidity !== undefined && observedHumidity !== undefined;
    const hasSingleHumidity = relativeHumidity !== undefined;
    
    if (hasSeparateHumidities || hasSingleHumidity) {
        // For moist air, use the virtual temperature approach
        // Virtual temperature accounts for the effect of water vapor on air density
        // by treating moist air as dry air at a slightly higher temperature
        
        // Calculate saturation vapor pressure at the given temperature
        const svp = saturationVaporPressure(temperature);
        
        if (hasSeparateHumidities) {
            // Use separate humidity values for reference and observed altitudes
            // Calculate virtual temperature for each level and use their average
            
            // Reference level calculations
            const refAvp = actualVaporPressure(svp, referenceHumidity!);
            const refMixRatio = calcMixingRatio(refAvp, referencePressure);
            const refVirtualTemp = virtualTemperature(temperature, refMixRatio);
            
            // Observed level calculations
            const obsAvp = actualVaporPressure(svp, observedHumidity!);
            const obsMixRatio = calcMixingRatio(obsAvp, observedPressure);
            const obsVirtualTemp = virtualTemperature(temperature, obsMixRatio);
            
            // Use the average of virtual temperatures for the layer
            effectiveTemperature = (refVirtualTemp + obsVirtualTemp) / 2;
        } else {
            // Use single humidity value (backward compatible behavior)
            // Calculate average pressure for mixing ratio calculation
            // Using geometric mean because pressure varies exponentially with altitude,
            // so geometric mean better represents the average pressure in the layer
            const avgPressure = Math.sqrt(referencePressure * observedPressure);
            
            // Calculate actual vapor pressure from relative humidity
            const avp = actualVaporPressure(svp, relativeHumidity!);
            
            // Calculate mixing ratio in g/kg
            const mixRatio = calcMixingRatio(avp, avgPressure);
            
            // Use virtual temperature which accounts for moist air
            effectiveTemperature = virtualTemperature(temperature, mixRatio);
        }
    }
    
    // Using the hypsometric formula: h = (R * T / g) * ln(P1 / P2)
    // Where h is the altitude difference, R is gas constant, T is temperature (or virtual temperature),
    // g is gravity, P1 is reference pressure, P2 is observed pressure
    const altitudeDifference = (R * effectiveTemperature / g) * Math.log(referencePressure / observedPressure);
    
    // Return the final altitude (reference altitude + altitude difference)
    return referenceAltitude + altitudeDifference;
}
