import { liftingCondensationLevel } from '../formulas/humidity';
import { DRY_ADIABATIC_LAPSE_RATE } from '../constants';

/**
 * Estimate the altitude of the cloud base from temperature and dew point.
 * 
 * This function calculates the lifting condensation level (LCL), which is the height
 * above the surface where air reaches saturation and clouds begin to form. It uses the
 * empirical approximation from meteorological practice: approximately 124.7 meters for
 * every degree (Celsius/Kelvin) of temperature-dewpoint spread.
 * 
 * **Important:** The return value depends on the altitude parameter:
 * - When altitude = 0 (default): Returns cloud base height above ground level (AGL)
 * - When altitude > 0: Returns cloud base height above mean sea level (MSL)
 * 
 * Formula:
 * - Height above surface (AGL) = (T - Td) × 124.7 meters
 * - Height above MSL = altitude + (T - Td) × 124.7 meters
 * 
 * @param {number} temperature - Air temperature in Kelvin.
 * @param {number} dewPoint - Dew point temperature in Kelvin.
 * @param {number} altitude - Surface altitude in meters above mean sea level (default: 0).
 * @returns {number} Cloud base height in meters. When altitude is 0 or omitted, returns height 
 *                   above ground level (AGL). When altitude is provided, returns height above 
 *                   mean sea level (MSL).
 * @throws {Error} If dew point is greater than temperature (physically impossible).
 * 
 * @example
 * // At sea level (altitude = 0): returns height above ground
 * const cloudHeightAGL = cloudBaseHeight(293.15, 283.15);
 * console.log(cloudHeightAGL); // 1247 meters above ground level
 * 
 * @example
 * // At elevated location: returns height above mean sea level
 * const cloudHeightMSL = cloudBaseHeight(293.15, 283.15, 500);
 * console.log(cloudHeightMSL); // 1747 meters above mean sea level (500m surface + 1247m cloud base)
 * 
 * @see https://en.wikipedia.org/wiki/Lifted_condensation_level
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
