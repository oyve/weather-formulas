![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg) ![Node.js CI](https://github.com/oyve/weather-formulas/workflows/Node.js%20CI/badge.svg?branch=main)
# weather-formulas
A library of atmospheric and weather related calculations.

* Test code for all formulas
* Supports custom valuation sets where supported

## Features

### Temperature
- [Dew Point](https://en.wikipedia.org/wiki/Dew_point)
- [Wind Chill](https://en.wikipedia.org/wiki/Wind_chill#North_American_and_United_Kingdom_wind_chill_index)
- [(Australian) Apparent Temperature](https://en.wikipedia.org/wiki/Wind_chill#Australian_apparent_temperature)
- [Heat Index](https://en.wikipedia.org/wiki/Heat_index)
- [Humidex](https://en.wikipedia.org/wiki/Humidex)
- [Potential Temperature](https://en.wikipedia.org/wiki/Potential_temperature)
- [Virtual Temperature](https://en.wikipedia.org/wiki/Virtual_temperature)

### Humidity
- [Relative Humidity](https://en.wikipedia.org/wiki/Humidity)
- [Specific Humidity](https://en.wikipedia.org/wiki/Humidity)
- [Mixing Ratio](https://en.wikipedia.org/wiki/Humidity)
- [Vapor Pressure](https://en.wikipedia.org/wiki/Vapor_pressure)
- [Saturation Vapor Pressure](https://en.wikipedia.org/wiki/Vapour_pressure_of_water)

### Pressure
- [Pressure Altitude](https://en.wikipedia.org/wiki/Pressure_altitude)
- [Density Altitude](https://en.wikipedia.org/wiki/Density_altitude)
- [Lapse Rate](https://en.wikipedia.org/wiki/Lapse_rate)
- [Dynamic lapse rate]
- [Adjust Pressure To Sea Level](https://en.wikipedia.org/wiki/Atmospheric_pressure)
-- By lapse rate
-- By dynamic lapse rate
-- By historical data

## Install
```
$ npm install weather-formulas
```

## How to use
```
//Option #1 - accessing all
const wf = require('weather-formulas');
wf.temperature, wf.humidity, wf.pressure

//Option #2 - accessing directly
import { temperature, humidity, pressure } from 'weather-formulas'
```
```
//With Option #1
let RH = wf.humidity.relativeHumidity(TEMPERATURE, DEW_POINT);
...

//With Option #2
let RH = humidity.relativeHumidity(TEMPERATURE, DEW_POINT);
...

```

**Advanced examples**

Use a provided valuation set
```
const valuationSet =  wf.temperature.DEW_POINT_VALUATIONS.DAVID_BOLTON;
const actual = wf.temperature.dewPointMagnusFormula(TEMPERATURE, HUMIDITY, valuationSet);
```
Use a custom valuation set
```
const valuationSet =  { a: 6, b: 17, c: 250, d: 234.5 };
const actual = wf.temperature.dewPointArdenBuckEquation(TEMPERATURE, HUMIDITY, valuationSet);
```

## Contribute
Please feel free to contribute by creating a Pull Request including test code.

## Disclaimer
Always verify calculations before using in production as edge cases due to floating point errors may exists for large numbers, and that are not covered by tests today. Please report!