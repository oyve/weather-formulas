/**
 * Calculate the snow-to-liquid ratio based on temperature.
 * The ratio varies with temperature, with colder temperatures producing fluffier, less dense snow.
 * Uses linear interpolation for smooth transition between temperature regimes.
 * 
 * @param {number} temperature - Air temperature in Kelvin
 * @returns {number} Snow-to-liquid ratio (dimensionless)
 */
export function snowToLiquidRatio(temperature: number): number {
    // Convert to Celsius
    const tempC = temperature - 273.15;
    
    // Use a linear approximation for smooth transition
    // Linearly interpolates from 5:1 at 0°C to 30:1 at -20°C
    
    if (tempC >= 0) {
        // Above freezing
        return 5;
    } else if (tempC > -20) {
        // Linear interpolation for -20°C to 0°C
        // Slope = (30 - 5) / (-20 - 0) = 25 / -20 = -1.25
        // ratio = 5 - 1.25 * tempC
        return 5 - 1.25 * tempC;
    } else {
        // Very cold (-20°C and below)
        return 30;
    }
}

/**
 * Calculate snow depth from liquid precipitation based on temperature.
 * Converts liquid precipitation (e.g., rainfall equivalent) to estimated snow depth.
 * 
 * @param {number} liquidPrecipitation - Liquid precipitation depth in millimeters
 * @param {number} temperature - Air temperature in Kelvin
 * @returns {number} Estimated snow depth in millimeters
 */
export function snowfallEquivalent(liquidPrecipitation: number, temperature: number): number {
    const ratio = snowToLiquidRatio(temperature);
    return liquidPrecipitation * ratio;
}



/**
 * Calculate liquid precipitation from snow depth (reverse calculation).
 * Useful for estimating water content of snowfall.
 * 
 * @param {number} snowDepth - Snow depth in millimeters
 * @param {number} temperature - Air temperature in Kelvin
 * @returns {number} Estimated liquid equivalent in millimeters
 */
export function snowToLiquidEquivalent(snowDepth: number, temperature: number): number {
    const ratio = snowToLiquidRatio(temperature);
    return snowDepth / ratio;
}
