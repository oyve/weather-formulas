<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0">
    <img alt="License: GPL v3" src="https://img.shields.io/badge/License-GPLv3-blue.svg">
  </a>
  <a href="https://github.com/oyve/weather-formulas/actions?query=workflow%3A%22Node.js+CI%22">
    <img alt="Node.js CI" src="https://github.com/oyve/weather-formulas/workflows/Node.js%20CI/badge.svg?branch=main">
  </a>
  <a href="https://www.npmjs.com/package/weather-formulas">
    <img alt="npm" src="https://img.shields.io/npm/v/weather-formulas">
  </a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5%2B-blue">
</p>


# weather-formulas
A library of atmospheric and weather-related formulas.

```js
import { temperature } from 'weather-formulas';
const dewPoint = temperature.dewPointMagnusFormula(298.15, 60);
console.log(`Dew Point: ${dewPoint} K`);
```

- Test code for all formulas.
- Supports provided and custom valuation sets, and configurable parameters where applicable.
- Supports both ES Module (ESM) and CommonJS (CJS).

## Table of Contents
- [Features](#features)
  - [Air Density](#air-density)
  - [Altitude](#altitude)
  - [Humidity](#humidity)
  - [Pressure](#pressure)
  - [Temperature](#temperature)
  - [Wind](#wind)
  - [Scales](#scales)
- [Install](#install)
- [Usage](#usage)
  - [ES Modules (ESM)](#es-modules-esm)
  - [CommonJS (CJS)](#commonjs-cjs)
  - [TypeScript](#typescript)
  - [Advanced Examples](#advanced-examples)
- [Testing](#testing)
- [Compatibility](#compatibility)
- [Contribute](#contribute)
- [License](#license)
- [Support](#support)
- [Disclaimer](#disclaimer)

## Features

### Air Density
| Formula                   | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| **Dry Air Density**       | Calculate air density for dry air. [🔗](https://en.wikipedia.org/wiki/Density_of_air) |
| **Moist Air Density**     | Calculate air density for moist air, considering humidity. [🔗](https://en.wikipedia.org/wiki/Density_of_air) |
| **Air Density at Altitude** | Calculate air density at a given altitude. [🔗](https://en.wikipedia.org/wiki/Density_of_air) |
| **Decay Constant**        | Calculate decay constant for air density with altitude. [🔗](https://en.wikipedia.org/wiki/Barometric_formula) |

### Altitude
| Formula                     | Description                                                               |
|-----------------------------|---------------------------------------------------------------------------|
| **Freezing Level Altitude**  | Estimate the altitude where temperature drops below freezing. [🔗](https://en.wikipedia.org/wiki/Freezing_level) |

### Humidity
| Formula                     | Description                                                               |
|-----------------------------|---------------------------------------------------------------------------|
| **Relative Humidity**       | Calculate the ratio of the current absolute humidity to the maximum possible humidity. [🔗](https://en.wikipedia.org/wiki/Humidity) |
| **Specific Humidity**       | Calculate the mass of water vapor per unit mass of air. [🔗](https://en.wikipedia.org/wiki/Humidity) |
| **Mixing Ratio**            | Calculate the ratio of water vapor to dry air. [🔗](https://en.wikipedia.org/wiki/Humidity) |
| **Vapor Pressure**          | Calculate the partial pressure of water vapor in the air. [🔗](https://en.wikipedia.org/wiki/Vapor_pressure) |
| **Actual Vapor Pressure**   | Calculate the partial pressure of water vapor actually present in the air, based on saturation vapor pressure and relative humidity. [🔗](https://en.wikipedia.org/wiki/Vapor_pressure) |
| **Saturation Vapor Pressure** | Calculate the maximum vapor pressure at a given temperature. [🔗](https://en.wikipedia.org/wiki/Vapour_pressure_of_water) |
| **Dew Point Depression**    | Calculate the difference between the air temperature and the dew point temperature, indicating how close the air is to saturation. [🔗](https://en.wikipedia.org/wiki/Dew_point#Dew_point_depression) |
| **Lifting Condensation Level** | Estimate the altitude at which an air parcel becomes saturated when lifted and condensation begins (cloud base height). [🔗](https://en.wikipedia.org/wiki/Lifting_condensation_level) |

### Pressure
| Formula                     | Description                                                               |
|-----------------------------|---------------------------------------------------------------------------|
| **Pressure Altitude**       | Calculate the altitude based on observed pressure. [🔗](https://en.wikipedia.org/wiki/Pressure_altitude) |
| **Density Altitude**        | Calculate the altitude adjusted for temperature and air density. [🔗](https://en.wikipedia.org/wiki/Density_altitude) |
| **Barometric Formula**      | Calculate pressure at a given altitude using the barometric formula. [🔗](https://en.wikipedia.org/wiki/Barometric_formula) |
| **Adjust Pressure To Sea Level** | Adjust pressure to sea level using various methods:                   |
| &nbsp;&nbsp;**Simple formula**      | A quick approximation for standard conditions. [🔗](https://en.wikipedia.org/wiki/Atmospheric_pressure#Altitude_variation) |
| &nbsp;&nbsp;**Advanced formula**    | A more accurate calculation using the barometric formula. [🔗](https://en.wikipedia.org/wiki/Atmospheric_pressure#Altitude_variation) |
| &nbsp;&nbsp;**By dynamic lapse rate** | Adjust pressure using a dynamically calculated lapse rate. [🔗](https://en.wikipedia.org/wiki/Atmospheric_pressure#Altitude_variation) |
| &nbsp;&nbsp;**By historical data**   | Adjust pressure using historical readings. [🔗](https://en.wikipedia.org/wiki/Atmospheric_pressure#Altitude_variation) |

### Temperature
| Formula                     | Description                                                               |
|-----------------------------|---------------------------------------------------------------------------|
| **Dew Point**               | Calculate the dew point using the Magnus formula or Arden Buck equation. [🔗](https://en.wikipedia.org/wiki/Dew_point) |
| **Wind Chill**              | Estimate the perceived temperature based on wind speed and air temperature. [🔗](https://en.wikipedia.org/wiki/Wind_chill#North_American_and_United_Kingdom_wind_chill_index) |
| **(Australian) Apparent Temperature** | Calculate the apparent temperature considering humidity and wind. [🔗](https://en.wikipedia.org/wiki/Wind_chill#Australian_apparent_temperature) |
| **Wet-bulb Temperature**    | Calculate the wet-bulb temperature. [🔗](https://en.wikipedia.org/wiki/Wet-bulb_temperature) |
| **Equivalent Temperature**  | Calculate the temperature an air parcel would have if all water vapor were condensed and the latent heat released. [🔗](https://en.wikipedia.org/wiki/Potential_temperature) |
| **Potential Temperature**   | Calculate the temperature an air parcel would have if brought to a standard pressure. [🔗](https://en.wikipedia.org/wiki/Potential_temperature) |
| **Virtual Temperature**     | Calculate the temperature accounting for water vapor in the air. [🔗](https://en.wikipedia.org/wiki/Virtual_temperature) |
| **Lapse Rate**              | Calculate the rate of temperature change with altitude. [🔗](https://en.wikipedia.org/wiki/Lapse_rate) |
| **Dynamic lapse rate**      | Calculate the lapse rate dynamically based on readings. [🔗](https://en.wikipedia.org/wiki/Lapse_rate) |
| **Weighted Average Temperature** | Calculate the weighted average temperature based on altitude differences. [🔗](https://en.wikipedia.org/wiki/Weighted_arithmetic_mean) |
| **Adjust Temperature by Lapse Rate** | Adjust temperature based on a fixed lapse rate. [🔗](https://en.wikipedia.org/wiki/Lapse_rate) |

### Wind
| Formula                     | Description                                                               |
|-----------------------------|---------------------------------------------------------------------------|
| **Wind Direction**          | Convert wind direction in degrees to compass direction. [🔗](https://en.wikipedia.org/wiki/Wind_direction) |
| **Wind Power Density**      | Calculate wind power density in watts per square meter. [🔗](https://en.wikipedia.org/wiki/Wind_power) |
| **Wind Force**              | Calculate wind force in kilograms per square meter. [🔗](https://en.wikipedia.org/wiki/Wind_force) |
| **Adjust Wind Speed for Altitude** | Adjust wind speed between different altitudes based on air density. [🔗](https://en.wikipedia.org/wiki/Wind_speed) |
| **Apparent Wind**           | Calculate the wind speed and direction experienced by a moving observer (e.g., vessel or vehicle). [🔗](https://en.wikipedia.org/wiki/Apparent_wind) |

### Phenomena
| Formula                     | Description                                                               |
|-----------------------------|---------------------------------------------------------------------------|
| **Fog Visibility**          | Estimate visibility in fog using Koschmieder’s Law. [🔗](https://en.wikipedia.org/wiki/Fog#Visibility_and_Koschmieder's_law) |
| **Fog Point Temperature**   | Calculate the fog point temperature (dew point at ground level). [🔗](https://en.wikipedia.org/wiki/Dew_point) |
| **Fog Probability**         | Predict the probability of fog formation using meteorological factors.     |

### Scales
| Scale                       | Description                                                               |
|-----------------------------|---------------------------------------------------------------------------|
| **Beaufort Scale**          | Classify wind speed according to the Beaufort scale. [🔗](https://en.wikipedia.org/wiki/Beaufort_scale) |
| **Saffir-Simpson Scale**    | Classify hurricane wind speed according to the Saffir-Simpson scale. [🔗](https://en.wikipedia.org/wiki/Saffir%E2%80%93Simpson_scale) |
| **UV Index**                | Classify ultraviolet index. [🔗](https://en.wikipedia.org/wiki/Ultraviolet_index) |
| **Heat Index**              | Measure the perceived temperature based on air temperature and humidity. [🔗](https://en.wikipedia.org/wiki/Heat_index) |
| **Humidex**                 | Calculate the humidex, a Canadian measure of perceived temperature. [🔗](https://en.wikipedia.org/wiki/Humidex) |


## Install
Install the library using npm:

```bash
$ npm install weather-formulas
```

## Usage

> **Note:** All temperatures must be provided and are returned in Kelvin (the SI unit for temperature).

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

### TypeScript

```typescript
import { temperature } from 'weather-formulas';

const dewPoint: number = temperature.dewPointMagnusFormula(298.15, 60); // 25°C and 60% humidity
console.log(`Dew Point: ${dewPoint} K`);
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
npm run test
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
For support, please [open an issue](https://github.com/oyve/weather-formulas/issues/new) in the GitHub repository.

## Disclaimer
While the formulas are implemented with care, results may vary due to floating point errors, edge cases, or incorrect usage. Please verify results and report any issues or inaccuracies.