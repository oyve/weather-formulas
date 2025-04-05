/**
 * Get the wind direction based on the degree.
 * Converts a degree value (0-360) into a compass direction (e.g., N, NE, E).
 * Handles normalization for degrees greater than 360 or less than 0.
 *
 * @param {number} degree - The wind direction in degrees (can be negative or greater than 360).
 * @returns {string} - The corresponding compass direction (e.g., 'N', 'NE', 'E').
 *
 * Example:
 *   getWindDirectionByDegree(0)    -> 'N'
 *   getWindDirectionByDegree(45)   -> 'NE'
 *   getWindDirectionByDegree(725)  -> 'N'
 *   getWindDirectionByDegree(-45)  -> 'NW'
 */
function getWindDirectionByDegree(degree: number): string {
    degree = ((degree % 360) + 360) % 360; // Normalize degrees to the range [0, 360]

    const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];

    const index = Math.floor((degree + 11.25) / 22.5) % 16;
    return directions[index];
}

/**
 * Calculate wind power density.
 * @param {number} windSpeed - Wind speed in meters per second.
 * @param {number} airDensity - Air density in kilograms per cubic meter (default is 1.225 kg/m³ at sea level).
 * @returns {number} - Wind power density in watts per square meter.
 */
function calculateWindPowerDensity(windSpeed: number, airDensity: number = 1.225): number {
    return 0.5 * airDensity * Math.pow(windSpeed, 3);
}

export default {
    getWindDirectionByDegree,
    calculateWindPowerDensity,
};
