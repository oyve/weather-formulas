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
 * Estimate the altitude of the cloud base (in meters) from temperature and dew point.
 * This uses a simplified approximation based on the difference between temperature and dew point.
 * The formula assumes standard atmospheric conditions and uses the approximation that
 * cloud base height is approximately 125 meters for every degree (Celsius/Kelvin) of
 * temperature-dewpoint spread.
 * @param {number} temperature - Air temperature in Kelvin.
 * @param {number} dewPoint - Dew point temperature in Kelvin.
 * @param {number} surfaceAltitude - Surface altitude in meters (default: 0).
 * @returns {number} Cloud base altitude in meters above mean sea level.
 */
export function cloudBaseHeight(
    temperature: number,
    dewPoint: number,
    surfaceAltitude: number = 0
): number {
    // The temperature difference is the same in Kelvin and Celsius
    const tempDewPointSpread = temperature - dewPoint;
    // Cloud base height above surface using the 125m per degree approximation
    const heightAboveSurface = 125 * tempDewPointSpread;
    return surfaceAltitude + heightAboveSurface;
}