import c, { AtmospericConstants } from '../constants';
import temperature from './temperature';

/**
 * Calculates the pressure altitude based on the observed pressure.
 * Pressure altitude is the altitude in the International Standard Atmosphere (ISA) where the observed pressure would occur.
 * 
 * @param {number} pressure Observed pressure in Pascals (Pa).
 * @returns {number} Pressure altitude in meters (m).
 */
function pressureAltitude(pressure: number): number {
    return (1 - Math.pow(pressure / c.STANDARD_MEAN_PRESSURE_SEA_LEVEL, 0.190284)) * 145366.45 * 0.3048;
}

/**
 * Calculates the density altitude, which is the altitude relative to the standard atmosphere conditions
 * at which the air density would be equal to the current air density.
 * 
 * @param {number} pressureAltitude Pressure altitude in meters (m).
 * @param {number} temperature Temperature in Kelvin (K).
 * @returns {number} Density altitude in meters (m).
 */
function densityAltitude(pressureAltitude: number, temperature: number): number {
    return pressureAltitude + (120 * (temperature - c.STANDARD_MEAN_TEMPERATURE_KELVIN));
}

/**
 * Calculates the barometric pressure at a given altitude using the barometric formula.
 * The calculation accounts for both zero and non-zero lapse rates.
 * 
 * @param {number} altitude Target altitude in meters (m).
 * @param {number} referencePressure Pressure at the reference altitude in Pascals (Pa).
 * @param {number} referenceAltitude Reference altitude in meters (m).
 * @param {number} referenceTemperature Temperature at the reference altitude in Kelvin (K). Defaults to 288.15 K (15°C).
 * @param {AtmospericConstants} constants Atmospheric constants (e.g., lapse rate, gravity, gas constant).
 * @returns {number} Barometric pressure at the target altitude in Pascals (Pa).
 */
function barometricPressure(
    altitude: number,
    referencePressure: number,
    referenceAltitude: number,
    referenceTemperature: number = 288.15,
    constants: AtmospericConstants = c.DEFAULT_ATMOSPHERIC_CONSTANTS_DRY_AIR
): number {
    let result: number;

    if (constants.lapseRate === 0) {
        // Case: Zero lapse rate
        const scaleHeight = (constants.gasConstant * referenceTemperature) / constants.gravity;
        result = referencePressure * Math.exp(-(altitude - referenceAltitude) / scaleHeight);
    } else {
        // Case: Non-zero lapse rate
        const tempRatio = 1 - (constants.lapseRate * (altitude - referenceAltitude)) / referenceTemperature;

        // Ensure tempRatio is positive to avoid invalid results
        if (tempRatio <= 0) {
            return 0; // Return 0 if the calculation is invalid
        }

        const exponent = constants.gravity / (constants.gasConstant * constants.lapseRate);
        result = referencePressure * Math.pow(tempRatio, exponent);
    }

    return Math.round(result * 100) / 100;
}

/**
 * Reduces the observed pressure to sea level using a simplified barometric formula.
 * This method assumes a standard sea level mean temperature of 15°C (288.15 K) and is less accurate for non-standard temperatures.
 * 
 * @param {number} pressureObserved Observed pressure in Pascals (Pa).
 * @param {number} altitude Altitude of the observed pressure in meters (m).
 * @param {number} temperatureAtSeaLevel Temperature at sea level in Kelvin (K). Defaults to 288.15 K (15°C).
 * @returns {number} Pressure reduced to sea level in Pascals (Pa), rounded to two decimal places.
 */
function adjustPressureToSeaLevelSimple(pressureObserved: number, altitude: number, temperatureAtSeaLevel: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN): number {
    let pressureSeaLevel = pressureObserved * Math.pow(1 - ((0.0065 * altitude) / (temperatureAtSeaLevel + 0.0065 * altitude)), -5.257);

    return Number(pressureSeaLevel.toFixed(2));
}

/**
 * Reduces the observed pressure to sea level with higher accuracy by using the barometric formula.
 * This method allows customization of atmospheric constants for non-standard conditions.
 * 
 * @param {number} pressureObserved Observed pressure in Pascals (Pa).
 * @param {number} altitude Altitude of the observed pressure in meters (m).
 * @param {number} temperature Temperature at sea level in Kelvin (K). Defaults to 288.15 K (15°C).
 * @param {AtmospericConstants} constants Atmospheric constants (e.g., lapse rate, gravity, gas constant). Defaults to Earth's standard constants.
 * @returns {number} Pressure reduced to sea level in Pascals (Pa), rounded to two decimal places.
 */
function adjustPressureToSeaLevelAdvanced(
    pressureObserved: number,
    altitude: number,
    temperature: number = c.STANDARD_MEAN_TEMPERATURE_KELVIN,
    constants: AtmospericConstants = c.DEFAULT_ATMOSPHERIC_CONSTANTS_DRY_AIR
): number {
    return barometricPressure(0, pressureObserved, altitude, temperature, constants);
}

export interface Reading {
    temperature: number, //kelvin
    altitude: number, //meter
    datetime: Date
}

const standardLapseRate = 0.0065;

/**
 * Adjust pressure to sea level by fixed lapse ratio.
 * @param {number} altitude altitude in meters.
 * @param {number} temperature temperature at altitude in Celcius|Kelvin|Fahrenheit.
 * @param {number} lapseRate Custom lapse rate. Defaults to standard lapse rate.
 * @returns Adjusted pressure
 */
function adjustPressureToSeaLevelByLapseRate(altitude: number, temperature: number, lapseRate: number = standardLapseRate) {
    return temperature + lapseRate * altitude;
}

/**
 * 
 * @param pressure Observed pressure
 * @param altitude Observed altitude
 * @param temperature Observed temperature
 * @param lapseRate Lapse rate
 * @returns Adjusted pressure
 */
function adjustPressureToSeaLevelByDynamicLapseRate(pressure: number, altitude: number, temperature: number, lapseRate: number) {
    const g = 9.80665; // Gravitational acceleration (m/s²)
    const R = 287.05; // Specific gas constant for dry air (J/(kg·K))

    if (lapseRate > 0) {
        // Handle temperature inversion
        const Tavg = temperature + (lapseRate * altitude) / 2; // Average temperature
        return pressure * Math.exp((g * altitude) / (R * Tavg));
    } else {
        // Standard formula
        return pressure * Math.pow(1 - (lapseRate * altitude) / temperature, -g / (R * lapseRate));
    }
}

/**
 * Calculate dynamic lapse rate based on a range of altitude and temperature data
 * @param readings Readings data
 * @param hours Number of hours to read
 * @param filterByLastReading Filter by the datetime in the most recent reading
 * @returns Dynamic lapse rate, or default.
 */
function calculateDynamicLapseRate(readings: Reading[], hours = 24, filterByLastReading = false) {
    const filteredReadings = filterReadingsByTimeRange(readings, hours);

    let totalLapseRate = 0;
    let count = 0;

    for (let i = 1; i < filteredReadings.length; i++) {
        const T1 = filteredReadings[i - 1].temperature;
        const altitude1 = filteredReadings[i - 1].altitude;
        const T2 = filteredReadings[i].temperature;
        const altitude2 = filteredReadings[i].altitude;

        if (altitude2 !== altitude1) {
            const lapseRate = calculateLapseRate(altitude1, T1, altitude2, T2);
            totalLapseRate += lapseRate;
            count++;
        }
    }

    return count > 0 ? totalLapseRate / count : 0.0065; // Default to standard lapse rate if no data
}

/**
 * 
 * @param readings Readings data
 * @param hours Filter by humber of hours to read
 * @param filterByLastReading Filter by the datetime in the most recent reading
 * @returns Readings within the given hours
 */
function filterReadingsByTimeRange(readings: Reading[], hours: number, filterByLastReading = false) {
    readings.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()); //oldest to newest
    const cutoffTime = filterByLastReading ? readings[readings.length - 1].datetime.getTime() - hours * 60 * 60 * 1000 : Date.now() - hours * 60 * 60 * 1000; // Convert hours to milliseconds

    const filteredReadings = readings.filter((reading) => reading.datetime.getTime() >= cutoffTime);

    return filteredReadings;
}

/**
 * 
 * @param readings Readings data
 * @param hours Hours to filter
 * @returns Weighted average temperature
 */
function calculateWeightedAverageTemperature(readings: Reading[], hours = 24) {
    const filteredReadings = filterReadingsByTimeRange(readings, hours);

    let totalWeight = 0;
    let weightedSum = 0;

    for (let i = 1; i < filteredReadings.length; i++) {
        const T1 = filteredReadings[i - 1].temperature;
        const altitude1 = filteredReadings[i - 1].altitude;
        const T2 = filteredReadings[i].temperature;
        const altitude2 = filteredReadings[i].altitude;

        const weight = Math.abs(altitude2 - altitude1); // Altitude difference as weight
        const averageTemperature = (T1 + T2) / 2;

        weightedSum += averageTemperature * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : readings[0]?.temperature || 288.15; // Default to 15°C in Kelvin if no data
}

function adjustPressureToSeaLevelByHistoricalData(pressure: number, altitude: number, readings: Reading[], hours = 24) {
    const dynamicLapseRate = calculateDynamicLapseRate(readings, hours);
    const weightedAverageTemperature = calculateWeightedAverageTemperature(readings, hours);

    const adjusted = adjustPressureToSeaLevelByDynamicLapseRate(pressure, altitude, weightedAverageTemperature, dynamicLapseRate);

    return Math.round(adjusted);
}

/**
 * 
 * @param altitude1 Lower or higher altitude 1
 * @param T1 Temperature at altitude 1
 * @param altitude2 Lower og higher altitude 2
 * @param T2 Temperature at altitude 2
 * @returns True if inversion is detected
 */
function isTemperatureInversion(altitude1: number, T1: number, altitude2: number, T2: number) {
    const lapseRate = calculateLapseRate(altitude1, T1, altitude2, T2);
    return lapseRate > 0;
}

/**
 * Calculate the lapse rate
 * @param altitude1 Lower or higher altitude 1
 * @param T1 Temperature at altitude 1
 * @param altitude2 Lower or higher altitude 2
 * @param T2 Temperature at altitude 2
 * @returns Lapse rate
 */
function calculateLapseRate(altitude1: number, T1: number, altitude2: number, T2: number) {
    return (T2 - T1) / (altitude2 - altitude1); // Kelvin/m
}

export default {
    pressureAltitude,
    densityAltitude,
    barometricPressure,

    adjustPressureToSeaLevelSimple,
    adjustPressureToSeaLevelAdvanced,
    adjustPressureToSeaLevelByLapseRate,
    adjustPressureToSeaLevelByDynamicLapseRate,
    adjustPressureToSeaLevelByHistoricalData,

    calculateWeightedAverageTemperature,
    isTemperatureInversion,

    calculateDynamicLapseRate,
    calculateLapseRate
};
