/**
 * Calculate the snow-to-liquid ratio based on temperature.
 * The ratio varies with temperature, with colder temperatures producing fluffier, less dense snow.
 * Based on empirical relationships from meteorological studies.
 * 
 * @param {number} temperature - Air temperature in Kelvin
 * @returns {number} Snow-to-liquid ratio (dimensionless)
 */
export function snowToLiquidRatio(temperature: number): number {
    // Convert to Celsius for easier calculation
    const tempC = temperature - 273.15;
    
    // Based on empirical data:
    // - Very warm (near 0°C): ~5:1 (wet, heavy snow)
    // - Cold (-5 to -10°C): ~15:1 (typical snow)
    // - Very cold (< -15°C): ~20-30:1 (dry, fluffy snow)
    
    if (tempC >= 0) {
        // Above freezing - minimal snow, mostly sleet/rain
        return 5;
    } else if (tempC >= -5) {
        // Wet snow
        return 10;
    } else if (tempC >= -10) {
        // Typical snow
        return 15;
    } else if (tempC >= -15) {
        // Dry snow
        return 20;
    } else {
        // Very dry, fluffy snow
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
 * Calculate snow-to-liquid ratio using a continuous formula (Roebber et al. 2003).
 * This provides a more gradual transition between temperature regimes.
 * 
 * @param {number} temperature - Air temperature in Kelvin
 * @returns {number} Snow-to-liquid ratio (dimensionless)
 */
export function snowToLiquidRatioContinuous(temperature: number): number {
    // Convert to Celsius
    const tempC = temperature - 273.15;
    
    // Use a linear approximation for smooth transition
    // Linearly interpolates from 5:1 at 0°C to 30:1 at -20°C
    
    if (tempC >= 0) {
        // Above freezing
        return 5;
    } else if (tempC > -20) {
        // Linear interpolation for -20°C to 0°C
        // ratio = 5 - 1.25 * tempC
        return 5 - 1.25 * tempC;
    } else {
        // Very cold (-20°C and below)
        return 30;
    }
}

/**
 * Calculate snow depth from liquid precipitation using continuous ratio.
 * Provides a smoother estimate across temperature ranges.
 * 
 * @param {number} liquidPrecipitation - Liquid precipitation depth in millimeters
 * @param {number} temperature - Air temperature in Kelvin
 * @returns {number} Estimated snow depth in millimeters
 */
export function snowfallEquivalentContinuous(liquidPrecipitation: number, temperature: number): number {
    const ratio = snowToLiquidRatioContinuous(temperature);
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
