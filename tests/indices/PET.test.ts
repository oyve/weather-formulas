import * as PET from "../../src/indices/PET";
import * as c from '../../src/constants';

describe('PET Tests', function() {
    describe("calculatePET - Basic functionality", function () {
        it("should calculate PET for standard conditions", function () {
            // Test case: 25°C, 60% RH, 2 m/s wind
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 60;
            const windSpeed = 2;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            // PET should be lower than air temp due to wind and humidity effects
            expect(result).toBeLessThan(temperature);
            expect(result).toBeGreaterThan(0);
        });

        it("should calculate PET with mean radiant temperature", function () {
            // Test case: 25°C air, 35°C MRT, 60% RH, 1 m/s wind
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const mrt = 35 + c.CELSIUS_TO_KELVIN;
            const humidity = 60;
            const windSpeed = 1;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed, mrt);
            
            // PET should be higher than air temp due to higher MRT
            expect(result).toBeGreaterThan(temperature);
        });

        it("should handle zero wind speed", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 50;
            const windSpeed = 0;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(temperature + 10); // reasonable range
        });

        it("should handle high humidity", function () {
            const temperature = 30 + c.CELSIUS_TO_KELVIN;
            const humidity = 90;
            const windSpeed = 1;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            // High humidity should reduce PET
            expect(result).toBeLessThan(temperature);
        });

        it("should handle low humidity", function () {
            const temperature = 30 + c.CELSIUS_TO_KELVIN;
            const humidity = 20;
            const windSpeed = 1;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            expect(result).toBeGreaterThan(0);
        });

        it("should handle high wind speed", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 50;
            const windSpeed = 10;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            // High wind should significantly reduce PET
            expect(result).toBeLessThan(temperature);
        });
    });

    describe("calculatePET - Input validation", function () {
        it("should throw error for humidity > 100", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 101;
            const windSpeed = 2;
            
            expect(() => PET.calculatePET(temperature, humidity, windSpeed))
                .toThrow("Humidity must be between 0 and 100");
        });

        it("should throw error for humidity < 0", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = -1;
            const windSpeed = 2;
            
            expect(() => PET.calculatePET(temperature, humidity, windSpeed))
                .toThrow("Humidity must be between 0 and 100");
        });

        it("should throw error for negative wind speed", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 60;
            const windSpeed = -1;
            
            expect(() => PET.calculatePET(temperature, humidity, windSpeed))
                .toThrow("Wind speed must be non-negative");
        });

        it("should accept boundary values for humidity", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const windSpeed = 2;
            
            // Should not throw for 0 and 100
            expect(() => PET.calculatePET(temperature, 0, windSpeed)).not.toThrow();
            expect(() => PET.calculatePET(temperature, 100, windSpeed)).not.toThrow();
        });
    });

    describe("petCategory - Thermal perception categories", function () {
        it("should categorize as 'Very hot' for extreme heat", function () {
            const petTemp = 42 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(41);
            expect(result?.perception).toBe("Very hot");
            expect(result?.stress).toBe("Extreme heat stress");
        });

        it("should categorize as 'Hot' for high temperature", function () {
            const petTemp = 36 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(35);
            expect(result?.perception).toBe("Hot");
            expect(result?.stress).toBe("Strong heat stress");
        });

        it("should categorize as 'Warm' for moderately high temperature", function () {
            const petTemp = 30 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(29);
            expect(result?.perception).toBe("Warm");
            expect(result?.stress).toBe("Moderate heat stress");
        });

        it("should categorize as 'Slightly warm' for mild warmth", function () {
            const petTemp = 24 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(23);
            expect(result?.perception).toBe("Slightly warm");
            expect(result?.stress).toBe("Slight heat stress");
        });

        it("should categorize as 'Comfortable' for ideal temperature", function () {
            const petTemp = 20 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(18);
            expect(result?.perception).toBe("Comfortable");
            expect(result?.stress).toBe("No thermal stress");
        });

        it("should categorize as 'Slightly cool' for mild cold", function () {
            const petTemp = 15 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(13);
            expect(result?.perception).toBe("Slightly cool");
            expect(result?.stress).toBe("Slight cold stress");
        });

        it("should categorize as 'Cool' for moderate cold", function () {
            const petTemp = 10 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(8);
            expect(result?.perception).toBe("Cool");
            expect(result?.stress).toBe("Moderate cold stress");
        });

        it("should categorize as 'Cold' for strong cold", function () {
            const petTemp = 5 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.lowerLimit).toBe(4);
            expect(result?.perception).toBe("Cold");
            expect(result?.stress).toBe("Strong cold stress");
        });

        it("should categorize as 'Very cold' for extreme cold", function () {
            const petTemp = 0 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result).not.toBeNull();
            expect(result?.perception).toBe("Very cold");
            expect(result?.stress).toBe("Extreme cold stress");
        });

        it("should handle boundary values correctly", function () {
            // Test exact boundary
            const petTemp = 23 + c.CELSIUS_TO_KELVIN;
            const result = PET.petCategory(petTemp);
            
            expect(result?.lowerLimit).toBe(23);
            expect(result?.perception).toBe("Slightly warm");
        });
    });

    describe("simplePET - Simplified calculation", function () {
        it("should calculate PET without mean radiant temperature", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 60;
            const windSpeed = 2;
            
            const result = PET.simplePET(temperature, humidity, windSpeed);
            
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(temperature + 10);
        });

        it("should produce same result as calculatePET without MRT", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 60;
            const windSpeed = 2;
            
            const simple = PET.simplePET(temperature, humidity, windSpeed);
            const full = PET.calculatePET(temperature, humidity, windSpeed);
            
            expect(simple).toBe(full);
        });

        it("should handle various conditions", function () {
            const testCases = [
                { temp: 10, humidity: 80, wind: 5 },
                { temp: 20, humidity: 50, wind: 2 },
                { temp: 30, humidity: 70, wind: 1 },
                { temp: 35, humidity: 40, wind: 3 },
            ];

            testCases.forEach(tc => {
                const result = PET.simplePET(
                    tc.temp + c.CELSIUS_TO_KELVIN,
                    tc.humidity,
                    tc.wind
                );
                expect(result).toBeGreaterThan(0);
            });
        });
    });

    describe("Integration - Calculate PET and categorize", function () {
        it("should calculate and categorize hot summer day", function () {
            // Hot summer day: 35°C, 50% RH, light wind
            const temperature = 35 + c.CELSIUS_TO_KELVIN;
            const humidity = 50;
            const windSpeed = 1;
            
            const pet = PET.calculatePET(temperature, humidity, windSpeed);
            const category = PET.petCategory(pet);
            
            expect(category).not.toBeNull();
            // Should indicate heat stress
            expect(category?.stress).toContain("heat stress");
        });

        it("should calculate and categorize comfortable spring day", function () {
            // Pleasant spring day: 20°C, 50% RH, light breeze
            const temperature = 20 + c.CELSIUS_TO_KELVIN;
            const humidity = 50;
            const windSpeed = 2;
            
            const pet = PET.calculatePET(temperature, humidity, windSpeed);
            const category = PET.petCategory(pet);
            
            expect(category).not.toBeNull();
            // Should be comfortable or slightly cool
            expect(['No thermal stress', 'Slight cold stress']).toContain(category?.stress);
        });

        it("should calculate and categorize cold winter day", function () {
            // Cold winter day: 0°C, 80% RH, strong wind
            const temperature = 0 + c.CELSIUS_TO_KELVIN;
            const humidity = 80;
            const windSpeed = 8;
            
            const pet = PET.calculatePET(temperature, humidity, windSpeed);
            const category = PET.petCategory(pet);
            
            expect(category).not.toBeNull();
            // Should indicate cold stress
            expect(category?.stress).toContain("cold stress");
        });

        it("should show effect of high mean radiant temperature", function () {
            // Same air temp, but higher MRT (sunny day)
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const mrt = 35 + c.CELSIUS_TO_KELVIN;
            const humidity = 50;
            const windSpeed = 1;
            
            const petWithMrt = PET.calculatePET(temperature, humidity, windSpeed, mrt);
            const petNoMrt = PET.calculatePET(temperature, humidity, windSpeed);
            
            // PET with higher MRT should be higher (warmer perceived temperature)
            expect(petWithMrt).toBeGreaterThan(petNoMrt);
        });
    });

    describe("Edge cases and special scenarios", function () {
        it("should handle very low temperature", function () {
            const temperature = -20 + c.CELSIUS_TO_KELVIN;
            const humidity = 70;
            const windSpeed = 5;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            expect(result).toBeGreaterThan(0); // Still in Kelvin
            expect(result).toBeLessThan(c.CELSIUS_TO_KELVIN); // Below 0°C
        });

        it("should handle very high temperature", function () {
            const temperature = 45 + c.CELSIUS_TO_KELVIN;
            const humidity = 30;
            const windSpeed = 2;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            // PET should be in a reasonable range (not too far from air temp)
            expect(result).toBeGreaterThan(temperature - 15);
            expect(result).toBeLessThan(temperature + 5);
        });

        it("should handle calm air (zero wind)", function () {
            const temperature = 25 + c.CELSIUS_TO_KELVIN;
            const humidity = 60;
            const windSpeed = 0;
            
            expect(() => PET.calculatePET(temperature, humidity, windSpeed)).not.toThrow();
        });

        it("should handle very high wind", function () {
            const temperature = 20 + c.CELSIUS_TO_KELVIN;
            const humidity = 50;
            const windSpeed = 20;
            
            const result = PET.calculatePET(temperature, humidity, windSpeed);
            
            // Very high wind should create significant cooling
            expect(result).toBeLessThan(temperature);
        });
    });
});
