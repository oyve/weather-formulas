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