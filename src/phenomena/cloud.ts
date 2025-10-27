import { liftingCondensationLevel } from '../formulas/humidity';
import { DRY_ADIABATIC_LAPSE_RATE } from '../constants';

/**
 * Estimate the altitude of the cloud base (in meters) from temperature and dew point.
 * This uses the lifting condensation level formula with the empirical approximation 
 * from meteorological practice: approximately 124.7 meters for every degree (Celsius/Kelvin) of spread.
 * Formula: cloud_base_height = (T - Td) * 124.7 meters
 * @param {number} temperature - Air temperature in Kelvin.
 * @param {number} dewPoint - Dew point temperature in Kelvin.
 * @param {number} altitude - Surface altitude in meters (default: 0).
 * @returns {number} Cloud base altitude in meters above mean sea level.
 * @throws {Error} If dew point is greater than temperature (physically impossible).
 */
export function cloudBaseHeight(
    temperature: number,
    dewPoint: number,
    altitude: number = 0
): number {
    // Use the lifting condensation level from humidity formulas
    const heightAboveSurface = liftingCondensationLevel(temperature, dewPoint);
    return altitude + heightAboveSurface;
}

/**
 * Calculate the temperature at the cloud base using the dry adiabatic lapse rate.
 * The cloud base temperature is determined by applying the dry adiabatic lapse rate
 * to the surface temperature over the height difference to the cloud base.
 * 
 * Before saturation (i.e., before cloud formation), rising air cools at the dry 
 * adiabatic lapse rate (~9.8°C/km or 0.0098 K/m). This is the appropriate rate for 
 * calculating cloud base temperature since the air is still unsaturated up to that point.
 * 
 * Formula: T_cloud = T_surface - (lapse_rate × height_above_surface)
 * 
 * @param {number} temperature - Surface air temperature in Kelvin.
 * @param {number} dewPoint - Dew point temperature in Kelvin.
 * @param {number} lapseRate - Environmental lapse rate in K/m (default: 0.0098 K/m, dry adiabatic lapse rate).
 * @returns {number} Temperature at cloud base in Kelvin.
 * @throws {Error} If dew point is greater than temperature (physically impossible).
 * 
 * @example
 * const cloudTemp = cloudTemperature(293.15, 283.15);
 * console.log(cloudTemp); // ~280.93 K (approximately 7.8°C)
 * 
 * @see https://en.wikipedia.org/wiki/Lapse_rate
 * @see https://en.wikipedia.org/wiki/Cloud_base
 */
export function cloudTemperature(
    temperature: number,
    dewPoint: number,
    lapseRate: number = DRY_ADIABATIC_LAPSE_RATE
): number {
    // Calculate the height above the surface where clouds form
    const heightAboveSurface = liftingCondensationLevel(temperature, dewPoint);
    
    // Apply the dry adiabatic lapse rate to get temperature at cloud base
    // Temperature decreases with altitude as unsaturated air rises and expands
    const cloudTemp = temperature - (lapseRate * heightAboveSurface);
    
    return cloudTemp;
}
