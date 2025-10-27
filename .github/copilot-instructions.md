# GitHub Copilot Instructions for weather-formulas

This file provides guidance to GitHub Copilot when working with this codebase.

## Project Overview

weather-formulas is a TypeScript library that provides atmospheric and meteorological calculations. The library is built to support both ES Modules (ESM) and CommonJS (CJS), with full TypeScript type definitions.

## Architecture

### Module Structure
- `src/formulas/` - Core weather calculation formulas (temperature, pressure, humidity, etc.)
- `src/indices/` - Weather indices (heat index, humidex, UTCI, PET)
- `src/phenomena/` - Weather phenomena calculations (fog, diurnal rhythm)
- `src/scales/` - Classification scales (Beaufort, Saffir-Simpson, UV Index)
- `src/constants.ts` - Physical constants used across formulas
- `src/common.ts` - Shared utility functions

### Build System
- Source: TypeScript in `src/`
- Output: Dual ESM/CJS in `dist/esm/` and `dist/cjs/`
- Types: TypeScript definitions in `dist/types/`
- Scripts: Build utilities in `scripts/`

## Coding Guidelines

### Units and Measurements
**CRITICAL**: All temperature values MUST be in Kelvin (K)
- Input parameters: Kelvin
- Return values: Kelvin
- Internal calculations: Kelvin
- Document any temperature conversions explicitly

Other units (follow SI standards):
- Pressure: Pascals (Pa) or hectopascals (hPa)
- Distance: meters (m) or kilometers (km)
- Speed: meters per second (m/s)
- Density: kilograms per cubic meter (kg/m³)

### Function Signatures
When creating new formulas:

```typescript
/**
 * Brief description of what the formula calculates.
 * 
 * Longer description if needed, including scientific context.
 * 
 * @param paramName - Description (units: K, Pa, etc.)
 * @param optionalParam - Description (optional, default: value)
 * @returns Description of return value (units)
 * 
 * @example
 * const result = formulaName(298.15, 60);
 * console.log(result); // Expected output
 * 
 * @see https://en.wikipedia.org/wiki/Relevant_Article
 */
export function formulaName(
  paramName: number,
  optionalParam?: number
): number {
  // Implementation
}
```

### Valuation Sets and Configuration
Many formulas support configurable parameters via valuation sets:

```typescript
// Define valuation set type
interface FormulaValuations {
  a: number;
  b: number;
  c: number;
}

// Provide predefined valuation sets
export const FORMULA_VALUATIONS = {
  DEFAULT: { a: 1, b: 2, c: 3 },
  ALTERNATIVE: { a: 1.1, b: 2.1, c: 3.1 },
} as const;

// Accept valuation set as optional parameter
export function formula(
  input: number,
  valuations: FormulaValuations = FORMULA_VALUATIONS.DEFAULT
): number {
  return valuations.a * input + valuations.b;
}
```

### Type Safety
- Use explicit types for all function parameters and return values
- Avoid `any` type
- Use `const` assertions for constant objects
- Export types for public APIs
- Use TypeScript strict mode features

### Error Handling
- Validate input parameters where appropriate
- Use clear error messages
- Document valid input ranges in JSDoc comments
- Consider edge cases (zero, negative, infinity, NaN)

## Testing Requirements

### Test Structure
Tests are located in `tests/` mirroring the `src/` structure:
- `tests/formulas/` - Tests for formulas
- `tests/indices/` - Tests for indices
- `tests/phenomena/` - Tests for phenomena
- `tests/scales/` - Tests for scales

### Writing Tests
For every new formula, create comprehensive tests:

```typescript
import { formulaName } from '../../src/formulas/moduleName';

describe('formulaName', () => {
  it('should calculate correct value for standard conditions', () => {
    const result = formulaName(298.15, 60);
    expect(result).toBeCloseTo(290.15, 2); // 2 decimal places
  });

  it('should handle edge case: zero input', () => {
    const result = formulaName(0, 60);
    expect(result).toBeCloseTo(expectedValue, 2);
  });

  it('should use provided valuation set', () => {
    const customValuations = { a: 1, b: 2, c: 3 };
    const result = formulaName(298.15, 60, customValuations);
    expect(result).toBeCloseTo(expectedValue, 2);
  });

  it('should throw error for invalid input', () => {
    expect(() => formulaName(-1, 60)).toThrow();
  });
});
```

### Test Precision
- Use `toBeCloseTo()` for floating-point comparisons
- Specify appropriate decimal places based on formula precision
- Document source of expected values (scientific papers, validated calculators)

## Common Patterns

### Temperature Conversions
While the library uses Kelvin internally, you may need to reference conversions in documentation:
```typescript
// Celsius to Kelvin: K = °C + 273.15
// Fahrenheit to Kelvin: K = (°F - 32) × 5/9 + 273.15
```

### Humidity Calculations
Relative humidity formulas often use saturation vapor pressure:
```typescript
import { saturationVaporPressure } from './humidity';

const es = saturationVaporPressure(temperatureK);
const e = (relativeHumidity / 100) * es;
```

### Altitude and Pressure
Standard atmosphere calculations use barometric formulas:
```typescript
import { STANDARD_ATMOSPHERE } from '../constants';

const pressure = STANDARD_ATMOSPHERE.PRESSURE * Math.exp(-altitude / scaleHeight);
```

## Build and Distribution

### Dual Module Support
The library exports both ESM and CJS:
- ESM: `dist/esm/` (for modern bundlers and Node.js)
- CJS: `dist/cjs/` (for legacy Node.js)
- Types: `dist/types/` (for TypeScript)

### Package Exports
When adding new modules, they must be added to package.json exports:
```json
{
  "exports": {
    "./moduleName": {
      "require": "./dist/cjs/path/to/module.cjs",
      "import": "./dist/esm/path/to/module.js",
      "types": "./dist/types/path/to/module.d.ts"
    }
  }
}
```

The `scripts/generate-exports.cjs` script automates this process.

## Scientific Accuracy

### Formula Sources
- Prioritize peer-reviewed scientific sources
- Reference Wikipedia articles as supplementary documentation
- Cite original papers or standards where applicable
- Document any approximations or limitations

### Validation
- Compare results against established calculators
- Test with known reference values
- Document expected accuracy/precision
- Include boundary conditions in tests

## Dependencies

### Production Dependencies
- `regression` - For statistical calculations
- `suncalc` - For solar position calculations

### Development Dependencies
- `typescript` - Type system and compilation
- `jest` - Testing framework
- `ts-jest` - Jest TypeScript support

Keep dependencies minimal and well-justified.

## File Organization

### New Formula Checklist
When adding a new formula:

1. **Source Code**
   - [ ] Add function to appropriate module in `src/`
   - [ ] Include complete JSDoc documentation
   - [ ] Export function and any related types/constants
   - [ ] Use TypeScript strict typing

2. **Tests**
   - [ ] Create or update test file in `tests/`
   - [ ] Test standard conditions
   - [ ] Test edge cases
   - [ ] Test with custom valuation sets (if applicable)
   - [ ] Verify against known values

3. **Documentation**
   - [ ] Add entry to README.md feature table
   - [ ] Include Wikipedia or scientific reference link
   - [ ] Add usage example if needed

4. **Build**
   - [ ] Run `npm run build` to generate exports
   - [ ] Verify both ESM and CJS work
   - [ ] Check TypeScript types are exported

## Common Mistakes to Avoid

1. **Temperature Units**: Never mix Celsius/Fahrenheit with Kelvin without explicit conversion
2. **Floating Point**: Use `toBeCloseTo()` in tests, not exact equality
3. **Magic Numbers**: Define constants in `constants.ts` or as named variables
4. **Missing Tests**: All exported functions must have tests
5. **Documentation**: Always include JSDoc comments with parameter units
6. **Type Safety**: Don't use `any` - use proper types or `unknown` with validation

## Performance Considerations

- Formulas should be computationally efficient
- Avoid unnecessary object creation in hot paths
- Use lookup tables for complex calculations when appropriate
- Consider memoization for expensive repeated calculations

## Compatibility

- Target Node.js 18+
- Use standard JavaScript features (avoid proposals)
- Support both ESM and CJS module systems
- Ensure TypeScript 5+ compatibility

## Questions?

Refer to:
- README.md for usage examples
- CONTRIBUTING.md for contribution guidelines
- Existing code in `src/` for patterns and conventions
- Tests in `tests/` for testing patterns
