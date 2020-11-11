![Node.js CI](https://github.com/oyve/weather-formulas/workflows/Node.js%20CI/badge.svg?branch=main)
# weather-formulas
A library of weather calculations.

* Agnostic to input source, hook it up in any project
* I/O in SI units (International System of Units)
* Formulas and algorithms off Wikipedia with 1:1 variable naming
* All algorithms are automatically tested
* Use provided or custom valuation sets

## Features / Currently supported
- [Dew Point](https://en.wikipedia.org/wiki/Dew_point)
- [Wind Chill](https://en.wikipedia.org/wiki/Wind_chill#North_American_and_United_Kingdom_wind_chill_index)
- [(Australian) Apparent Temperature](https://en.wikipedia.org/wiki/Wind_chill#Australian_apparent_temperature)
- [Heat Index](https://en.wikipedia.org/wiki/Heat_index)
- [Humidex](https://en.wikipedia.org/wiki/Humidex)

## Install
```
$ npm install weather-formulas
```

## How to use
```
const WF = require('weather-formulas');

const TEMPERATURE = 300, HUMIDITY = 60, WINDSPEED = 10; //300 Kelvin, 60% Relative Humidity, 10 M/S

let dewPointMF = WF.dewPointMagnusFormula(TEMPERATURE, HUMIDITY);
let dewPointAF = WF.dewPointArdenBuckEquation(TEMPERATURE, HUMIDITY);
let windChill = WF.windChillIndex(TEMPERATURE, WINDSPEED);
let apparentTemperature = WF.australianAapparentTemperature(TEMPERATURE, HUMIDITY, WINDSPEED);
let heatIndex = WF.heatIndex(TEMPERATURE, HUMIDITY);
let heatIndexText = WF.heatIndexText(heatIndex); //output heat index threshold and warning text

let humidex = WF.humidex(TEMPERATURE, HUMIDITY);
let humidexText = WF.humidexText(humidex); //output humidex threshold and warning text

```

**Advanced examples**

Use a provided valuation set
```
const valuationSet =  temperature.DEW_POINT_VALUATIONS.DAVID_BOLTON;
const actual = temperature.dewPointMagnusFormula(TEMPERATURE, HUMIDITY, valuationSet);
```
Use a custom valuation set
```
const valuationSet =  { a: 6, b: 17, c: 250, d: 234.5 }; //these values are made up for the sake of example
const actual = temperature.dewPointArdenBuckEquation(TEMPERATURE, HUMIDITY, valuationSet);
```

## Contribute
Please feel free to contribute by creating a Pull Request with test code.
