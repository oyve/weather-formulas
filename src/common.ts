export interface Reading {
    temperature: number, //kelvin
    pressure: number, //meter
    altitude: number, //meter
    relativeHumidity: number, //relative humidity in %
    timestamp: number
}