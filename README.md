![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg) ![Node.js CI](https://github.com/oyve/weather-formulas/workflows/Node.js%20CI/badge.svg?branch=main)

# weather-formulas
A library of atmospheric and weather-related calculations.

- Includes test code for all formulas.
- Supports custom valuation sets where applicable.
- Supports both ES Module (ESM) and CommonJS (CJS).

## Table of Contents
- [Features](#features)
  - [Temperature](#temperature)
  - [Humidity](#humidity)
  - [Pressure](#pressure)
  - [Wind](#wind)
  - [Air Density](#air-density)
  - [Scales](#scales)
- [Install](#install)
- [How to Use](#how-to-use)
  - [ES Modules (ESM)](#es-modules-esm)
  - [CommonJS (CJS)](#commonjs-cjs)
  - [Advanced Examples](#advanced-examples)
- [Testing](#testing)
- [Compatibility](#compatibility)
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

### Wind
- [Wind Direction](https://en.wikipedia.org/wiki/Wind_direction): Convert wind direction in degrees to compass direction.
- [Wind Power Density](https://en.wikipedia.org/wiki/Wind_power): Calculate wind power density in watts per square meter.
- [Wind Force](https://en.wikipedia.org/wiki/Wind_force): Calculate wind force in kilograms per square meter.
- [Adjust Wind Speed for Altitude](https://en.wikipedia.org/wiki/Wind_speed): Adjust wind speed between different altitudes based on air density.
- [Apparent Wind](https://en.wikipedia.org/wiki/Apparent_wind): Calculate the wind speed and direction experienced by a moving observer (e.g., vessel or vehicle).  

### Air Density
- [Dry Air Density](https://en.wikipedia.org/wiki/Density_of_air): Calculate air density for dry air.
- [Moist Air Density](https://en.wikipedia.org/wiki/Density_of_air): Calculate air density for moist air, considering humidity.
- [Air Density at Altitude](https://en.wikipedia.org/wiki/Density_of_air): Calculate air density at a given altitude.
- [Decay Constant](https://en.wikipedia.org/wiki/Barometric_formula): Calculate decay constant for air density with altitude.

### Scales
- [Beaufort Scale](https://en.wikipedia.org/wiki/Beaufort_scale): Classify wind speed according to the Beaufort scale.
- [Saffir-Simpson Scale](https://en.wikipedia.org/wiki/Saffir%E2%80%93Simpson_scale): Classify hurricane wind speed according to the Saffir-Simpson scale.

## Install
Install the library using npm:

```bash
$ npm install weather-formulas
```

## How to Use

### ES Modules (ESM)
If your project is configured to use ES Modules (e.g., `"type": "module"` in `package.json`), you can use the `import` syntax to load the package:

```javascript
import { temperature, humidity, pressure, wind, airDensity } from 'weather-formulas';

// Example usage
const RH = humidity.relativeHumidity(298.15, 293.15); // 25°C and 20°C in Kelvin
console.log(`Relative Humidity: ${RH}%`);
```

### CommonJS (CJS)
If your project uses CommonJS (e.g., no `"type": "module"` in `package.json`), you can use the `require` syntax to load the package:

```javascript
const { temperature, humidity, pressure, wind, airDensity } = require('weather-formulas');

// Example usage
const RH = humidity.relativeHumidity(298.15, 293.15); // 25°C and 20°C in Kelvin
console.log(`Relative Humidity: ${RH}%`);
```

### Advanced Examples

Use a provided valuation set:
```javascript
const valuationSet = temperature.DEW_POINT_VALUATIONS.DAVID_BOLTON;
const actual = temperature.dewPointMagnusFormula(298.15, 60, valuationSet); // 25°C and 60% humidity
console.log(`Dew Point: ${actual} K`);
```

Use a custom valuation set:
```javascript
const valuationSet = { a: 6, b: 17, c: 250, d: 234.5 };
const actual = temperature.dewPointArdenBuckEquation(298.15, 60, valuationSet); // 25°C and 60% humidity
console.log(`Dew Point: ${actual} K`);
```

Inspect code/tests for all possibilities.

## Testing
All formulas are covered by automated tests.  
Run tests with:

```bash
npm test
```

## Compatibility
- Requires Node.js 18+.
- Fully typed with TypeScript (v5+).
- Supports both ES Modules (ESM) and CommonJS (CJS).

## Contribute
Please feel free to contribute by creating a Pull Request including test code, or by suggesting other formulas.

## License
This project is licensed under the GPL v3 License.

## Support
For support, please open an issue in the GitHub repository.

## Disclaimer
Always verify calculations before using in production as edge cases due to floating point errors may exist for large numbers, and which may not be covered by tests today. Please report any issues.