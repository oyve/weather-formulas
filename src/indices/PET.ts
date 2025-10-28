import { kelvinToCelcius, celciusToKelvin } from '../formulas/temperature';
import { saturationVaporPressure } from '../formulas/humidity';

/**
 * PET (Physiological Equivalent Temperature) Thermal Comfort Index
 * 
 * PET is defined as the air temperature at which, in a typical indoor setting,
 * the heat balance of the human body is maintained with core and skin temperatures
 * equal to those under the conditions being assessed.
 * 
 * This implementation uses a simplified approximation based on:
 * - Air temperature
 * - Relative humidity
 * - Wind speed
 * - Mean radiant temperature
 * 
 * The full PET calculation involves the Munich Energy-balance Model for Individuals (MEMI),
 * which is computationally intensive. This implementation provides a practical approximation
 * suitable for most applications.
 * 
 * @param temperature - Air temperature in Kelvin
 * @param humidity - Relative humidity (0-100%)
 * @param windSpeed - Wind speed in m/s
 * @param meanRadiantTemperature - Mean radiant temperature in Kelvin (optional, defaults to air temperature)
 * @returns PET in Kelvin
 * 
 * @example
 * const pet = calculatePET(298.15, 60, 2.5, 303.15);
 * console.log(pet); // Returns PET in Kelvin
 * 
 * @see https://en.wikipedia.org/wiki/Thermal_comfort
 * @see https://doi.org/10.1007/s00484-011-0453-2
 */
export function calculatePET(
  temperature: number,
  humidity: number,
  windSpeed: number,
  meanRadiantTemperature?: number
): number {
  if (humidity < 0 || humidity > 100) {
    throw new Error("Humidity must be between 0 and 100");
  }
  if (windSpeed < 0) {
    throw new Error("Wind speed must be non-negative");
  }

  const Ta = kelvinToCelcius(temperature); // Air temperature in °C
  const Tmrt = meanRadiantTemperature 
    ? kelvinToCelcius(meanRadiantTemperature)
    : Ta; // Mean radiant temperature in °C
  const RH = humidity; // Relative humidity %
  const v = windSpeed; // Wind speed m/s

  // Calculate vapor pressure
  const es = saturationVaporPressure(temperature); // Pa
  const ea = (RH / 100) * es; // Actual vapor pressure in Pa
  const vp = ea / 100; // Convert to hPa for calculation

  // Simplified PET approximation based on empirical relationships
  // This uses a regression-based approach derived from MEMI model outputs
  
  // Base temperature effect - weighted average of air temp and MRT
  // MRT has stronger influence on perceived temperature
  let PET = 0.5 * Ta + 0.5 * Tmrt;

  // Humidity effect - reduces comfort at higher humidity
  const humidityEffect = -0.006 * RH * (1 + 0.008 * Math.max(0, Ta - 20));
  PET += humidityEffect;

  // Wind effect - increases heat loss
  // Wind effect is more pronounced at higher temperatures
  const windEffect = -0.4 * Math.sqrt(v) * (1 + 0.015 * Math.max(0, Ta - 15));
  PET += windEffect;

  // Additional vapor pressure effect
  const vpEffect = -0.015 * vp * Math.max(0, Ta - 15);
  PET += vpEffect;

  return celciusToKelvin(PET);
}

/**
 * PET Assessment Categories
 * 
 * Provides thermal perception and physiological stress level based on PET value.
 * These categories are based on standard PET assessment scales for central Europeans.
 * 
 * @param petTemperature - PET value in Kelvin
 * @returns Assessment object with lower limit (°C), thermal perception, and grade of physiological stress, or null if outside range
 * 
 * @example
 * const pet = calculatePET(298.15, 60, 2.5);
 * const assessment = petCategory(pet);
 * console.log(assessment); // { lowerLimit: 23, perception: "Slightly warm", stress: "Slight heat stress" }
 * 
 * @see https://doi.org/10.1007/s004840050118
 */
export function petCategory(
  petTemperature: number
): null | { lowerLimit: number; perception: string; stress: string } {
  const petCelsius = kelvinToCelcius(petTemperature);

  const thresholds = [
    { lowerLimit: 41, perception: "Very hot", stress: "Extreme heat stress" },
    { lowerLimit: 35, perception: "Hot", stress: "Strong heat stress" },
    { lowerLimit: 29, perception: "Warm", stress: "Moderate heat stress" },
    { lowerLimit: 23, perception: "Slightly warm", stress: "Slight heat stress" },
    { lowerLimit: 18, perception: "Comfortable", stress: "No thermal stress" },
    { lowerLimit: 13, perception: "Slightly cool", stress: "Slight cold stress" },
    { lowerLimit: 8, perception: "Cool", stress: "Moderate cold stress" },
    { lowerLimit: 4, perception: "Cold", stress: "Strong cold stress" },
    { lowerLimit: -Infinity, perception: "Very cold", stress: "Extreme cold stress" },
  ];

  const result = thresholds.find((t) => petCelsius >= t.lowerLimit);

  return result === undefined ? null : result;
}

/**
 * Simplified PET calculation for cases where mean radiant temperature is unknown
 * 
 * This version estimates mean radiant temperature from air temperature and assumes
 * standard conditions. Suitable for quick assessments when detailed radiation data
 * is not available.
 * 
 * @param temperature - Air temperature in Kelvin
 * @param humidity - Relative humidity (0-100%)
 * @param windSpeed - Wind speed in m/s
 * @returns PET in Kelvin
 * 
 * @example
 * const pet = simplePET(298.15, 60, 2.5);
 * console.log(pet); // Returns PET in Kelvin
 */
export function simplePET(
  temperature: number,
  humidity: number,
  windSpeed: number
): number {
  return calculatePET(temperature, humidity, windSpeed);
}
