import * as airDensityFormulas from "./airDensity";

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
export function getWindDirectionByDegree(degree: number): { abbr: string, full: string } {
    degree = ((degree % 360) + 360) % 360; // Normalize degrees to the range [0, 360]

    const directions = [
        { abbr: 'N',    full: 'north' },
        { abbr: 'NNE',  full: 'north-northeast' },
        { abbr: 'NE',   full: 'northeast' },
        { abbr: 'ENE',  full: 'east-northeast' },
        { abbr: 'E',    full: 'east' },
        { abbr: 'ESE',  full: 'east-southeast' },
        { abbr: 'SE',   full: 'southeast' },
        { abbr: 'SSE',  full: 'south-southeast' },
        { abbr: 'S',    full: 'south' },
        { abbr: 'SSW',  full: 'south-southwest' },
        { abbr: 'SW',   full: 'southwest' },
        { abbr: 'WSW',  full: 'west-southwest' },
        { abbr: 'W',    full: 'west' },
        { abbr: 'WNW',  full: 'west-northwest' },
        { abbr: 'NW',   full: 'northwest' },
        { abbr: 'NNW',  full: 'north-northwest' }
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
export function windPowerDensity(windSpeed: number, airDensity: number = 1.225): number {
    return 0.5 * airDensity * Math.pow(windSpeed, 3);
}

/**
 * Calculate wind force in kilograms per square meter.
 * @param {number} windSpeed - Wind speed in meters per second.
 * @param {number} airDensity - Air density in kilograms per cubic meter (default is 1.225 kg/m³ at sea level).
 * @returns {number} - Wind force in kilograms per square meter (kg/m²).
 */
export function windForce(windSpeed: number, airDensity: number = 1.225): number {
    // Force = 0.5 * airDensity * windSpeed^2 (in N/m²)
    // Convert to kg/m² by dividing by gravitational acceleration (9.81 m/s²)
    return (0.5 * airDensity * Math.pow(windSpeed, 2)) / 9.81;
}

/**
 * Adjust wind speed between two altitudes.
 * @param windSpeed - Wind speed at the measurement altitude in meters per second.
 * @param measurementAltitude - Altitude where the wind speed is measured, in meters.
 * @param airDensityAtMeasurementAltitude - Air density at the measurement altitude in kg/m³ (default is 1.225 kg/m³ at sea level).
 * @param referenceAltitude - Reference altitude in meters.
 * @param targetAltitude - Target altitude in meters. 
 * @returns {number} - Adjusted wind speed at the target altitude.
 */
export function adjustWindSpeedForAltitude(
    windSpeed: number,
    measurementAltitude: number,
    airDensityAtMeasurementAltitude: number = 1.225, // Default to sea level air density
    referenceAltitude: number,
    targetAltitude: number,
): number {
    // Calculate air density at the reference altitude
    const airDensityAtReference = airDensityFormulas.airDensityAtAltitude(
        airDensityAtMeasurementAltitude,
        referenceAltitude - measurementAltitude
    );

    // Calculate air density at the target altitude
    const airDensityAtTarget = airDensityFormulas.airDensityAtAltitude(
        airDensityAtMeasurementAltitude,
        targetAltitude - measurementAltitude
    );

    // Adjust wind speed based on the ratio of air densities
    return windSpeed * (airDensityAtReference / airDensityAtTarget) ** (1 / 3);
}

/**
 * Calculate the apparent wind speed and direction as experienced by a moving observer.
 *
 * - The true wind direction is given in meteorological convention ("FROM"): 
 *   e.g., 90° means wind is coming FROM the east, blowing TO the west.
 * - The observer's direction is given as "TO": 
 *   e.g., 270° means the observer is moving TO the west.
 * - The returned direction is also in meteorological convention ("FROM"): 
 *   the direction FROM which the apparent wind is felt.
 *
 * This function uses vector subtraction to combine the true wind and the observer's motion,
 * and converts the result back to the "FROM" convention for the apparent wind direction.
 *
 * @param {number} trueWindSpeed - True wind speed in m/s.
 * @param {number} trueWindDirection - True wind direction in degrees ("FROM" direction, meteorological).
 * @param {number} observerSpeed - Observer's speed in m/s.
 * @param {number} observerDirection - Observer's direction in degrees ("TO" direction).
 * @returns {{ speed: number, direction: number }} - Apparent wind speed (m/s) and direction ("FROM" degrees).
 *
 * Example 1:
 *   Wind 10 m/s FROM east (90°) and observer moving TO east (90°) at 5 m/s
 *   apparentWind(10, 90, 5, 90) => { speed: 15, direction: 90 }
 * 
 * Example 2:
 *   Wind 10 m/s FROM east (90°), observer moving TO west (270°) at 5 m/s
 *   apparentWind(10, 90, 5, 270) => { speed: 5, direction: 270 }
 */
export function apparentWind(
    trueWindSpeed: number,
    trueWindDirection: number,
    observerSpeed: number,
    observerDirection: number
): { speed: number, direction: number } {
    const twRad = ((trueWindDirection + 180) * Math.PI) / 180;
    const obsRad = (observerDirection * Math.PI) / 180;

    // Wind vector (direction FROM)
    const windX = trueWindSpeed * Math.sin(twRad);
    const windY = trueWindSpeed * Math.cos(twRad);

    // Observer velocity vector (direction TO)
    const obsX = observerSpeed * Math.sin(obsRad);
    const obsY = observerSpeed * Math.cos(obsRad);

    // Apparent wind = wind - observer velocity
    const appX = windX - obsX;
    const appY = windY - obsY;

    const speed = Math.sqrt(appX * appX + appY * appY);
    let direction = Math.atan2(appX, appY) * (180 / Math.PI);
    direction = (direction + 360) % 360;

 // Convert TO direction to FROM direction
    direction = (direction + 180) % 360;

    return { speed, direction };
}