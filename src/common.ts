export interface Reading {
    temperature: number, //kelvin
    pressure: number, //meter
    altitude: number, //meter
    relativeHumidity: number, //relative humidity in %
    timestamp: number
}

/**
 * Sort readings by timestamp (oldest to newest).
 * Returns a new sorted array without modifying the original.
 * 
 * @param {Reading[]} readings - Array of readings to sort.
 * @returns {Reading[]} New array of readings sorted by timestamp (oldest to newest).
 */
export function sortReadingsByTimestamp(readings: Reading[]): Reading[] {
    return [...readings].sort((a, b) => a.timestamp - b.timestamp);
}