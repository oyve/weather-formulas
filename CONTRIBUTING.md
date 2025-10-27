# Contributing to weather-formulas

Thank you for your interest in contributing to weather-formulas! This document provides guidelines and instructions for contributing to this project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project follows a standard code of conduct. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/weather-formulas.git
   cd weather-formulas
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/oyve/weather-formulas.git
   ```

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

## How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Check if the issue already exists before creating a new one
- Provide a clear description and steps to reproduce
- Include expected vs actual behavior
- Add relevant code samples or test cases

### Suggesting Features
- Use the GitHub issue tracker
- Clearly describe the feature and its use case
- Explain why this feature would be useful to the project
- Consider providing a rough implementation idea

### Adding New Formulas
When adding new weather formulas:

1. **Research**: Ensure the formula is scientifically valid and cite authoritative sources
2. **Implementation**: 
   - Add the formula to the appropriate module in `src/formulas/`, `src/indices/`, `src/phenomena/`, or `src/scales/`
   - Use TypeScript with proper type definitions
   - Follow the existing code structure and naming conventions
   - Add JSDoc comments with formula description and parameters
3. **Testing**:
   - Create comprehensive tests in the corresponding test file
   - Include edge cases and boundary conditions
   - Verify results against known values or authoritative sources
4. **Documentation**:
   - Update the README.md with the new formula in the appropriate table
   - Include a link to the Wikipedia article or authoritative source

## Coding Standards

### TypeScript
- Use TypeScript for all source code
- Enable strict type checking
- Provide explicit type annotations for public APIs
- Avoid using `any` type unless absolutely necessary

### Code Style
- Follow the existing code style in the repository
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Add comments for complex calculations

### Units and Conventions
- **Temperature**: Always use Kelvin (K) as the SI unit
- **Pressure**: Use Pascals (Pa) or hectopascals (hPa)
- **Distance**: Use meters (m) or kilometers (km)
- **Speed**: Use meters per second (m/s)
- Document any conversions clearly in comments

### Documentation
- Add JSDoc comments to all exported functions
- Include parameter descriptions and return value information
- Provide usage examples where helpful
- Reference scientific sources for formulas

## Testing

### Test Requirements
- All new formulas must have corresponding tests
- Tests should verify correctness against known values
- Include tests for:
  - Normal operating ranges
  - Edge cases
  - Boundary conditions
  - Invalid inputs (if applicable)

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run watch
```

### Writing Tests
- Use Jest testing framework
- Follow the existing test structure
- Use descriptive test names
- Group related tests using `describe` blocks

Example test structure:
```typescript
describe('formulaName', () => {
  it('should calculate correct value for standard conditions', () => {
    const result = formulaName(input);
    expect(result).toBeCloseTo(expectedValue, precision);
  });

  it('should handle edge case X', () => {
    // Test edge case
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write code following the coding standards
   - Add tests for your changes
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   npm run build
   npm test
   ```

4. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Reference issue numbers if applicable
   ```bash
   git commit -m "Add formula for calculating X (#123)"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template with:
     - Clear description of changes
     - Related issue numbers
     - Testing performed
     - Any breaking changes

### Pull Request Guidelines
- Keep PRs focused on a single feature or fix
- Ensure all tests pass
- Update documentation for any API changes
- Respond to code review feedback promptly
- Maintain backward compatibility when possible

### Code Review
- All submissions require review before merging
- Reviewers may request changes or improvements
- Be open to feedback and constructive criticism
- Address all review comments before merge

## Building for Distribution

The project supports both ES Modules (ESM) and CommonJS (CJS):

```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Generate both ESM and CJS outputs
3. Create type definition files
4. Update package.json exports

## Questions?

If you have questions or need help:
- Open an issue on GitHub
- Check existing issues and discussions
- Review the README.md for usage examples

Thank you for contributing to weather-formulas!
