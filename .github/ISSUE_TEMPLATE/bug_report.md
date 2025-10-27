---
name: Bug Report
about: Report a bug or incorrect calculation
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Formula/Function Affected
Which formula or function is producing incorrect results?
- Function name: 
- Module: (e.g., temperature, humidity, pressure)

## Steps to Reproduce
Provide a minimal code example that reproduces the issue:

```typescript
import { temperature } from 'weather-formulas';

const result = temperature.dewPointMagnusFormula(298.15, 60);
console.log(result); // Actual: XXX, Expected: YYY
```

## Expected Behavior
What result did you expect?
- Expected value: 
- Units: 

## Actual Behavior
What result did you actually get?
- Actual value: 
- Units: 

## Input Parameters
List all input parameters used:
- Temperature: (in Kelvin)
- Humidity: (in %)
- Pressure: (in Pa or hPa)
- Other parameters:

## Reference/Source
If you believe the expected value is correct, please provide a reference:
- [ ] Scientific paper (provide citation)
- [ ] Validated calculator (provide link)
- [ ] Other authoritative source (specify)

Link or citation:

## Environment
- Node.js version: (e.g., 18.0.0)
- Package version: (e.g., 1.0.9)
- TypeScript version (if applicable): (e.g., 5.8.3)
- Module system: [ ] ESM [ ] CommonJS

## Additional Context
Add any other context about the problem here. For example:
- Is this a precision/rounding issue?
- Does it only occur for specific input ranges?
- Are there any error messages or warnings?

## Possible Solution (Optional)
If you have an idea of what might be causing the issue or how to fix it, please share.
