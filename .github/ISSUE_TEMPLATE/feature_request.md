---
name: Feature Request
about: Suggest a new formula or enhancement
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Type
- [ ] New weather formula
- [ ] New weather index
- [ ] New scale/classification
- [ ] Enhancement to existing formula
- [ ] Documentation improvement
- [ ] API improvement
- [ ] Other (please specify)

## Description
A clear and concise description of the feature you'd like to see added.

## Formula Details (for new formulas)
If requesting a new formula, please provide:

### Formula Name
What is the formula called?

### Scientific Background
What does this formula calculate? What is its purpose in meteorology/atmospheric science?

### Formula/Equation
Provide the mathematical formula (use LaTeX notation if possible):
```
Example: T_d = (b * α(T,RH)) / (a - α(T,RH))
```

### Input Parameters
List all required input parameters:
- Parameter 1: (description, units)
- Parameter 2: (description, units)
- ...

### Output
What does the formula return?
- Output: (description, units)

### Reference Sources
Provide authoritative sources for the formula:
- [ ] Wikipedia article: (link)
- [ ] Scientific paper: (citation and DOI if available)
- [ ] Meteorological standard: (specify)
- [ ] Other: (specify)

### Use Case
Explain the practical use case for this formula. When would someone need this calculation?

## Example Usage
How would you like to use this feature? Provide a code example:

```typescript
import { module } from 'weather-formulas';

const result = module.newFormula(param1, param2);
console.log(`Result: ${result}`);
```

## Expected Behavior
Describe what you expect this feature to do.

## Validation
How can the correctness of this formula be verified?
- [ ] Known reference values
- [ ] Online calculator (provide link)
- [ ] Scientific literature values
- [ ] Other (specify)

## Additional Context
Add any other context, screenshots, or examples about the feature request here.

## Alternative Solutions (Optional)
Have you considered any alternative approaches or workarounds?

## Priority
How important is this feature to you?
- [ ] Critical - Blocking my work
- [ ] High - Need it soon
- [ ] Medium - Would be nice to have
- [ ] Low - Just a suggestion

## Contribution
Are you willing to contribute this feature yourself?
- [ ] Yes, I can implement this with guidance
- [ ] Yes, I can implement this independently
- [ ] No, but I can help test
- [ ] No, just requesting
