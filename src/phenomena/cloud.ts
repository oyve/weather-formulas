import { liftingCondensationLevel } from '../formulas/humidity';

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
