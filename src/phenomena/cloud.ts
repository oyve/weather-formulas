import { liftingCondensationLevel } from '../formulas/humidity';
import { STANDARD_LAPSE_RATE } from '../constants';

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
 * Calculate the temperature at the cloud base using the environmental lapse rate.
 * The cloud base temperature is determined by applying the atmospheric lapse rate
 * to the surface temperature over the height difference to the cloud base.
 * 
 * Formula: T_cloud = T_surface - (lapse_rate × height_above_surface)
 * 
 * @param {number} temperature - Surface air temperature in Kelvin.
 * @param {number} dewPoint - Dew point temperature in Kelvin.
 * @param {number} lapseRate - Environmental lapse rate in K/m (default: 0.0065 K/m, standard atmosphere).
 * @returns {number} Temperature at cloud base in Kelvin.
 * @throws {Error} If dew point is greater than temperature (physically impossible).
 * 
 * @example
 * const cloudTemp = cloudTemperature(293.15, 283.15);
 * console.log(cloudTemp); // ~285.05 K (approximately 12°C)
 * 
 * @see https://en.wikipedia.org/wiki/Lapse_rate
 * @see https://en.wikipedia.org/wiki/Cloud_base
 */
export function cloudTemperature(
    temperature: number,
    dewPoint: number,
    lapseRate: number = STANDARD_LAPSE_RATE
): number {
    // Calculate the height above the surface where clouds form
    const heightAboveSurface = liftingCondensationLevel(temperature, dewPoint);
    
    // Apply the environmental lapse rate to get temperature at cloud base
    // Temperature decreases with altitude
    const cloudTemp = temperature - (lapseRate * heightAboveSurface);
    
    return cloudTemp;
}
