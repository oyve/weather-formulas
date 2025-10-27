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