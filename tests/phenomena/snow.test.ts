import { 
    snowToLiquidRatio, 
    snowfallEquivalent, 
    snowToLiquidRatioContinuous,
    snowfallEquivalentContinuous,
    snowToLiquidEquivalent
} from '../../src/phenomena/snow';

describe('snowToLiquidRatio', () => {
    it('returns 5 for temperatures at or above freezing', () => {
        // At freezing point (0°C = 273.15K)
        expect(snowToLiquidRatio(273.15)).toBe(5);
        // Above freezing
        expect(snowToLiquidRatio(275)).toBe(5);
        expect(snowToLiquidRatio(280)).toBe(5);
    });

    it('returns 10 for wet snow temperatures (-5°C to 0°C)', () => {
        // -1°C
        expect(snowToLiquidRatio(272.15)).toBe(10);
        // -3°C
        expect(snowToLiquidRatio(270.15)).toBe(10);
        // -5°C
        expect(snowToLiquidRatio(268.15)).toBe(10);
    });

    it('returns 15 for typical snow temperatures (-10°C to -5°C)', () => {
        // -6°C
        expect(snowToLiquidRatio(267.15)).toBe(15);
        // -8°C
        expect(snowToLiquidRatio(265.15)).toBe(15);
        // -10°C
        expect(snowToLiquidRatio(263.15)).toBe(15);
    });

    it('returns 20 for dry snow temperatures (-15°C to -10°C)', () => {
        // -11°C
        expect(snowToLiquidRatio(262.15)).toBe(20);
        // -13°C
        expect(snowToLiquidRatio(260.15)).toBe(20);
        // -15°C
        expect(snowToLiquidRatio(258.15)).toBe(20);
    });

    it('returns 30 for very cold temperatures (below -15°C)', () => {
        // -16°C
        expect(snowToLiquidRatio(257.15)).toBe(30);
        // -20°C
        expect(snowToLiquidRatio(253.15)).toBe(30);
        // -30°C
        expect(snowToLiquidRatio(243.15)).toBe(30);
    });
});

describe('snowfallEquivalent', () => {
    it('calculates snow depth from liquid precipitation at various temperatures', () => {
        // 10mm liquid at 0°C (ratio 5:1) = 50mm snow
        expect(snowfallEquivalent(10, 273.15)).toBe(50);
        
        // 10mm liquid at -3°C (ratio 10:1) = 100mm snow
        expect(snowfallEquivalent(10, 270.15)).toBe(100);
        
        // 10mm liquid at -8°C (ratio 15:1) = 150mm snow
        expect(snowfallEquivalent(10, 265.15)).toBe(150);
        
        // 10mm liquid at -12°C (ratio 20:1) = 200mm snow
        expect(snowfallEquivalent(10, 261.15)).toBe(200);
        
        // 10mm liquid at -20°C (ratio 30:1) = 300mm snow
        expect(snowfallEquivalent(10, 253.15)).toBe(300);
    });

    it('returns 0 for 0mm liquid precipitation', () => {
        expect(snowfallEquivalent(0, 270)).toBe(0);
        expect(snowfallEquivalent(0, 260)).toBe(0);
    });

    it('handles small amounts of precipitation', () => {
        // 1mm liquid at -10°C (ratio 15:1) = 15mm snow
        expect(snowfallEquivalent(1, 263.15)).toBe(15);
        
        // 0.5mm liquid at -8°C (ratio 15:1) = 7.5mm snow
        expect(snowfallEquivalent(0.5, 265.15)).toBe(7.5);
    });

    it('handles large amounts of precipitation', () => {
        // 100mm liquid at -10°C (ratio 15:1) = 1500mm snow
        expect(snowfallEquivalent(100, 263.15)).toBe(1500);
    });
});

describe('snowToLiquidRatioContinuous', () => {
    it('returns 5 for temperatures at or above freezing', () => {
        expect(snowToLiquidRatioContinuous(273.15)).toBe(5);
        expect(snowToLiquidRatioContinuous(275)).toBe(5);
    });

    it('returns 30 for very cold temperatures', () => {
        expect(snowToLiquidRatioContinuous(253.15)).toBeCloseTo(30, 2); // -20°C exactly
        expect(snowToLiquidRatioContinuous(243.15)).toBe(30); // -30°C
    });

    it('provides continuous values in the transition range', () => {
        // -2°C should be 7.5
        const ratio1 = snowToLiquidRatioContinuous(271.15);
        expect(ratio1).toBeCloseTo(7.5, 1);
        
        // -10°C should be 17.5
        const ratio2 = snowToLiquidRatioContinuous(263.15);
        expect(ratio2).toBeCloseTo(17.5, 1);
        
        // -20°C boundary (exactly 30, with floating point tolerance)
        const ratio3 = snowToLiquidRatioContinuous(253.15);
        expect(ratio3).toBeCloseTo(30, 2);
    });

    it('increases ratio as temperature decreases', () => {
        const ratio1 = snowToLiquidRatioContinuous(271.15); // -2°C
        const ratio2 = snowToLiquidRatioContinuous(268.15); // -5°C
        const ratio3 = snowToLiquidRatioContinuous(263.15); // -10°C
        const ratio4 = snowToLiquidRatioContinuous(258.15); // -15°C
        
        expect(ratio2).toBeGreaterThan(ratio1);
        expect(ratio3).toBeGreaterThan(ratio2);
        expect(ratio4).toBeGreaterThan(ratio3);
    });
});

describe('snowfallEquivalentContinuous', () => {
    it('calculates snow depth using continuous ratio', () => {
        // Test at various temperatures
        const snow1 = snowfallEquivalentContinuous(10, 273.15); // 0°C
        expect(snow1).toBe(50); // ratio is 5
        
        const snow2 = snowfallEquivalentContinuous(10, 253.15); // -20°C
        expect(snow2).toBeCloseTo(300, 2); // ratio is 30 (with floating point tolerance)
    });

    it('provides smoother transitions than step function', () => {
        // The continuous version should give different values for close temperatures
        const snow1 = snowfallEquivalentContinuous(10, 267.15); // -6°C
        const snow2 = snowfallEquivalentContinuous(10, 266.15); // -7°C
        
        // Both should be positive and snow2 should be >= snow1
        expect(snow1).toBeGreaterThan(0);
        expect(snow2).toBeGreaterThanOrEqual(snow1);
    });

    it('returns 0 for 0mm liquid precipitation', () => {
        expect(snowfallEquivalentContinuous(0, 270)).toBe(0);
        expect(snowfallEquivalentContinuous(0, 260)).toBe(0);
    });
});

describe('snowToLiquidEquivalent', () => {
    it('converts snow depth to liquid precipitation', () => {
        // 50mm snow at 0°C (ratio 5:1) = 10mm liquid
        expect(snowToLiquidEquivalent(50, 273.15)).toBe(10);
        
        // 150mm snow at -8°C (ratio 15:1) = 10mm liquid
        expect(snowToLiquidEquivalent(150, 265.15)).toBe(10);
        
        // 300mm snow at -20°C (ratio 30:1) = 10mm liquid
        expect(snowToLiquidEquivalent(300, 253.15)).toBe(10);
    });

    it('is the inverse of snowfallEquivalent', () => {
        const liquid = 25;
        const temp = 265.15; // -8°C
        
        // Convert liquid to snow and back
        const snow = snowfallEquivalent(liquid, temp);
        const liquidBack = snowToLiquidEquivalent(snow, temp);
        
        expect(liquidBack).toBeCloseTo(liquid, 10);
    });

    it('returns 0 for 0mm snow depth', () => {
        expect(snowToLiquidEquivalent(0, 270)).toBe(0);
        expect(snowToLiquidEquivalent(0, 260)).toBe(0);
    });

    it('handles fractional values', () => {
        // 75mm snow at -10°C (ratio 15:1) = 5mm liquid
        expect(snowToLiquidEquivalent(75, 263.15)).toBe(5);
    });
});

describe('Integration tests', () => {
    it('round trip conversion preserves values', () => {
        const temperatures = [273.15, 270.15, 265.15, 260.15, 253.15];
        const liquidAmounts = [1, 5, 10, 25, 50];
        
        temperatures.forEach(temp => {
            liquidAmounts.forEach(liquid => {
                const snow = snowfallEquivalent(liquid, temp);
                const liquidBack = snowToLiquidEquivalent(snow, temp);
                expect(liquidBack).toBeCloseTo(liquid, 10);
            });
        });
    });

    it('handles realistic weather scenarios', () => {
        // Light snow: 2mm liquid at -5°C
        const lightSnow = snowfallEquivalent(2, 268.15);
        expect(lightSnow).toBe(20); // 10:1 ratio
        
        // Moderate snow: 10mm liquid at -10°C
        const moderateSnow = snowfallEquivalent(10, 263.15);
        expect(moderateSnow).toBe(150); // 15:1 ratio
        
        // Heavy snow: 25mm liquid at -15°C
        const heavySnow = snowfallEquivalent(25, 258.15);
        expect(heavySnow).toBe(500); // 20:1 ratio
    });
});
