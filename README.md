![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg) ![Node.js CI](https://github.com/oyve/weather-formulas/workflows/Node.js%20CI/badge.svg?branch=main)

# weather-formulas
A library of atmospheric and weather-related calculations.

- Includes test code for all formulas.
- Supports custom valuation sets where applicable.
- Published as an ES Module (ESM).

## Table of Contents
- [Features](#features)
  - [Temperature](#temperature)
  - [Humidity](#humidity)
  - [Pressure](#pressure)
- [Install](#install)
- [How to Use](#how-to-use)
  - [Basic Examples](#basic-examples)
  - [Advanced Examples](#advanced-examples)
- [Contribute](#contribute)
- [License](#license)
- [Support](#support)
- [Disclaimer](#disclaimer)

## Features

### Temperature
- [Dew Point](https://en.wikipedia.org/wiki/Dew_point): Calculate the dew point using the Magnus formula or Arden Buck equation.
- [Wind Chill](https://en.wikipedia.org/wiki/Wind_chill#North_American_and_United_Kingdom_wind_chill_index): Estimate the perceived temperature based on wind speed and air temperature.
- [(Australian) Apparent Temperature](https://en.wikipedia.org/wiki/Wind_chill#Australian_apparent_temperature): Calculate the apparent temperature considering humidity and wind.
- [Heat Index](https://en.wikipedia.org/wiki/Heat_index): Measure the perceived temperature based on air temperature and humidity.
- [Humidex](https://en.wikipedia.org/wiki/Humidex): Calculate the humidex, a Canadian measure of perceived temperature.
- [Potential Temperature](https://en.wikipedia.org/wiki/Potential_temperature): Calculate the temperature an air parcel would have if brought to a standard pressure.
- [Virtual Temperature](https://en.wikipedia.org/wiki/Virtual_temperature): Calculate the temperature accounting for water vapor in the air.
- [Lapse Rate](https://en.wikipedia.org/wiki/Lapse_rate): Calculate the rate of temperature change with altitude.
- Dynamic lapse rate: Calculate the lapse rate dynamically based on readings.
- [Weighted Average Temperature](https://en.wikipedia.org/wiki/Weighted_arithmetic_mean): Calculate the weighted average temperature based on altitude differences.
- Adjust Temperature by Lapse Rate: Adjust temperature based on a fixed lapse rate.

### Humidity
- [Relative Humidity](https://en.wikipedia.org/wiki/Humidity): Calculate the ratio of the current absolute humidity to the maximum possible humidity.
- [Specific Humidity](https://en.wikipedia.org/wiki/Humidity): Calculate the mass of water vapor per unit mass of air.
- [Mixing Ratio](https://en.wikipedia.org/wiki/Humidity): Calculate the ratio of water vapor to dry air.
- [Vapor Pressure](https://en.wikipedia.org/wiki/Vapor_pressure): Calculate the partial pressure of water vapor in the air.
- [Saturation Vapor Pressure](https://en.wikipedia.org/wiki/Vapour_pressure_of_water): Calculate the maximum vapor pressure at a given temperature.

### Pressure
- [Pressure Altitude](https://en.wikipedia.org/wiki/Pressure_altitude): Calculate the altitude based on observed pressure.
- [Density Altitude](https://en.wikipedia.org/wiki/Density_altitude): Calculate the altitude adjusted for temperature and air density.
- [Barometric Formula](https://en.wikipedia.org/wiki/Barometric_formula): Calculate pressure at a given altitude using the barometric formula.
- [Adjust Pressure To Sea Level](https://en.wikipedia.org/wiki/Atmospheric_pressure#Altitude_variation):
    - Simple formula: A quick approximation for standard conditions.
    - Advanced formula: A more accurate calculation using the barometric formula.
    - By dynamic lapse rate: Adjust pressure using a dynamically calculated lapse rate.
    - By historical data: Adjust pressure using historical readings.

## Install
Install the library using npm:

```bash
$ npm install weather-formulas
```

## How to Use

### ES Module Only
This package is published as an ES Module (ESM). It does not natively support CommonJS (require). To use this package:

Ensure your project is configured to support ES Modules (e.g., "type": "module" in package.json). Use the import syntax to load the package. If you are using a CommonJS project, you can dynamically import the package using import() (see below).

### Basic Examples
```javascript
import { temperature, humidity, pressure } from 'weather-formulas';

// Example usage
const RH = humidity.relativeHumidity(TEMPERATURE, DEW_POINT);
```
### CommonJS Workaround
If you are using a CommonJS project, you can dynamically import the package:

```javascript
(async () => {
  const weatherFormulas = await import('weather-formulas');
  const { temperature } = weatherFormulas;
  const RH = temperature.relativeHumidity(TEMPERATURE, DEW_POINT);
  console.log(`Relative Humidity: ${RH}%`);
})();
```

### Advanced Examples

Use a provided valuation set:
```javascript
const valuationSet = temperature.DEW_POINT_VALUATIONS.DAVID_BOLTON;
const actual = temperature.dewPointMagnusFormula(TEMPERATURE, HUMIDITY, valuationSet);
```
Use a custom valuation set:
```javascript
const valuationSet =  { a: 6, b: 17, c: 250, d: 234.5 };
const actual = temperature.dewPointArdenBuckEquation(TEMPERATURE, HUMIDITY, valuationSet);
```

Inspect code/tests for all possibilities.

## Contribute
Please feel free to contribute by creating a Pull Request including test code, or by suggesting other formulas.

## License
This project is licensed under the GPL v3 License.

## Support
For support, please open an issue in the GitHub repository.

## Disclaimer
This package is published as an ES Module (ESM). It does not natively support CommonJS (require). If you need CommonJS support, consider using a bundler like Webpack or Rollup to transpile the package into CommonJS, or dynamically import the package using import().

Always verify calculations before using in production as edge cases due to floating point errors may exist for large numbers, and which may not be covered by tests today. Please report any issues.