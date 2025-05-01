export interface BeaufortScale {
    min: number;
    max: number;
    category: string;
    force: number;
}

/**
 * Get the Beaufort scale object based on wind speed (measured at a 10 minutes average to be correct).
 * @param {number} windSpeed - Wind speed in meters per second (m/s).
 * @returns {BeaufortScale | null} - Beaufort scale object or null if not found.
 */
export function getBeaufortScaleByWindSpeed(windSpeed: number): BeaufortScale | null {
    if(windSpeed < 0) throw new Error('Wind speed cannot be negative.');
    windSpeed = Math.round(windSpeed * 10) / 10; //to 1 decimal place
    
    const beaufortScale: BeaufortScale[] = [
        { min: 0, max: 0.2, category: 'Calm', force: 0 },
        { min: 0.3, max: 1.5, category: 'Light Air', force: 1 },
        { min: 1.6, max: 3.3, category: 'Light Breeze', force: 2 },
        { min: 3.4, max: 5.4, category: 'Gentle Breeze', force: 3 },
        { min: 5.5, max: 7.9, category: 'Moderate Breeze', force: 4 },
        { min: 8, max: 10.7, category: 'Fresh Breeze', force: 5 },
        { min: 10.8, max: 13.8, category: 'Strong Breeze', force: 6 },
        { min: 13.9, max: 17.1, category: 'Near Gale', force: 7 },
        { min: 17.2, max: 20.7, category: 'Gale', force: 8 },
        { min: 20.8, max: 24.4, category: 'Strong Gale', force: 9 },
        { min: 24.5, max: 28.4, category: 'Storm', force: 10 },
        { min: 28.5, max: 32.6, category: 'Violent Storm', force: 11 },
        { min: 32.7, max: 37.1, category: 'Hurricane Force', force: 12 },
        //there are no official Beaufort category names for the extended scale beyond force 12
        { min: 37.2, max: 41.4, category: 'Strong Cyclonic Storm', force: 13 },
        { min: 41.5, max: 46.1, category: 'Severe Cyclonic Storm', force: 14 },
        { min: 46.2, max: 50.9, category: 'Violent Cyclone', force: 15 },
        { min: 51.0, max: 55.9, category: 'Extreme Cyclone', force: 16 },
        { min: 56.0, max: Infinity, category: 'Supreme Cyclone', force: 17 },
    ];

    return beaufortScale.find((entry) => windSpeed >= entry.min && windSpeed <= entry.max) || null;
}

/**
 * Get the Beaufort scale category based on pressure variation ratio.
 * @param {number} pressureDifference - Pressure difference in Pascals (Pa).
 * @param {number} airDensity - Air density in kilograms per cubic meter (default is 1.225 kg/m³ at sea level).
 * @returns {string} - Beaufort scale category (e.g., 'Calm', 'Light Breeze').
 */
export function getBeaufortScaleByPressure(pressureDifference: number, airDensity: number = 1.225): string {
    const windSpeed = Math.sqrt((2 * pressureDifference) / airDensity); // Calculate wind speed using Bernoulli's principle
    const scale = getBeaufortScaleByWindSpeed(windSpeed);
    return scale ? scale.category : 'Unknown';
}

/**
 * Get the Beaufort scale category based on pressure ratio.
 * @param {number} pressureRatio - Ratio of two pressures (P1 / P2).
 * @param {number} airDensity - Air density in kilograms per cubic meter (default is 1.225 kg/m³ at sea level).
 * @returns {string} - Beaufort scale category (e.g., 'Calm', 'Light Breeze').
 */
export function getBeaufortScaleByPressureRatio(pressureRatio: number, airDensity: number = 1.225): string {
    if (pressureRatio <= 0) {
        throw new Error('Pressure ratio must be greater than 0.');
    }

    // Calculate wind speed using Bernoulli's principle with pressure ratio
    const windSpeed = Math.sqrt((2 * airDensity * (1 - pressureRatio)) / airDensity);

    // Get the Beaufort scale category based on the calculated wind speed
    const scale = getBeaufortScaleByWindSpeed(windSpeed);
    return scale ? scale.category : 'Unknown';
}