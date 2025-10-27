import { 
    snowToLiquidRatio, 
    snowfallEquivalent, 
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

    it('returns 30 for very cold temperatures', () => {
        expect(snowToLiquidRatio(253.15)).toBeCloseTo(30, 2); // -20°C exactly
        expect(snowToLiquidRatio(243.15)).toBe(30); // -30°C
    });

    it('provides continuous values in the transition range', () => {
        // -2°C should be 7.5
        const ratio1 = snowToLiquidRatio(271.15);
        expect(ratio1).toBeCloseTo(7.5, 1);
        
        // -10°C should be 17.5
        const ratio2 = snowToLiquidRatio(263.15);
        expect(ratio2).toBeCloseTo(17.5, 1);
        
        // -20°C boundary (exactly 30, with floating point tolerance)
        const ratio3 = snowToLiquidRatio(253.15);
        expect(ratio3).toBeCloseTo(30, 2);
    });

    it('increases ratio as temperature decreases', () => {
        const ratio1 = snowToLiquidRatio(271.15); // -2°C
        const ratio2 = snowToLiquidRatio(268.15); // -5°C
        const ratio3 = snowToLiquidRatio(263.15); // -10°C
        const ratio4 = snowToLiquidRatio(258.15); // -15°C
        
        expect(ratio2).toBeGreaterThan(ratio1);
        expect(ratio3).toBeGreaterThan(ratio2);
        expect(ratio4).toBeGreaterThan(ratio3);
    });
});

describe('snowfallEquivalent', () => {
    it('calculates snow depth from liquid precipitation at various temperatures', () => {
        // 10mm liquid at 0°C (ratio 5:1) = 50mm snow
        expect(snowfallEquivalent(10, 273.15)).toBe(50);
        
        // 10mm liquid at -3°C (ratio ~8.75:1) 
        const snow1 = snowfallEquivalent(10, 270.15);
        expect(snow1).toBeCloseTo(87.5, 1);
        
        // 10mm liquid at -8°C (ratio ~15:1) 
        const snow2 = snowfallEquivalent(10, 265.15);
        expect(snow2).toBeCloseTo(150, 1);
        
        // 10mm liquid at -12°C (ratio ~20:1) 
        const snow3 = snowfallEquivalent(10, 261.15);
        expect(snow3).toBeCloseTo(200, 1);
        
        // 10mm liquid at -20°C (ratio 30:1) = 300mm snow
        const snow4 = snowfallEquivalent(10, 253.15);
        expect(snow4).toBeCloseTo(300, 1);
    });

    it('returns 0 for 0mm liquid precipitation', () => {
        expect(snowfallEquivalent(0, 270)).toBe(0);
        expect(snowfallEquivalent(0, 260)).toBe(0);
    });

    it('handles small amounts of precipitation', () => {
        // 1mm liquid at -10°C (ratio ~17.5:1)
        const snow1 = snowfallEquivalent(1, 263.15);
        expect(snow1).toBeCloseTo(17.5, 1);
        
        // 0.5mm liquid at -8°C (ratio ~15:1)
        const snow2 = snowfallEquivalent(0.5, 265.15);
        expect(snow2).toBeCloseTo(7.5, 1);
    });

    it('handles large amounts of precipitation', () => {
        // 100mm liquid at -10°C (ratio ~17.5:1)
        const snow = snowfallEquivalent(100, 263.15);
        expect(snow).toBeCloseTo(1750, 1);
    });
    
    it('provides smoother transitions than step function', () => {
        // The continuous version should give different values for close temperatures
        const snow1 = snowfallEquivalent(10, 267.15); // -6°C
        const snow2 = snowfallEquivalent(10, 266.15); // -7°C
        
        // Both should be positive and snow2 should be >= snow1
        expect(snow1).toBeGreaterThan(0);
        expect(snow2).toBeGreaterThanOrEqual(snow1);
    });
});


describe('snowToLiquidEquivalent', () => {
    it('converts snow depth to liquid precipitation', () => {
        // 50mm snow at 0°C (ratio 5:1) = 10mm liquid
        expect(snowToLiquidEquivalent(50, 273.15)).toBe(10);
        
        // 150mm snow at -8°C (ratio ~15:1) = ~10mm liquid
        const liquid1 = snowToLiquidEquivalent(150, 265.15);
        expect(liquid1).toBeCloseTo(10, 1);
        
        // 300mm snow at -20°C (ratio 30:1) = 10mm liquid
        const liquid2 = snowToLiquidEquivalent(300, 253.15);
        expect(liquid2).toBeCloseTo(10, 1);
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
        // At -10°C, ratio is ~17.5:1
        // So 87.5mm snow should give ~5mm liquid
        const liquid = snowToLiquidEquivalent(87.5, 263.15);
        expect(liquid).toBeCloseTo(5, 1);
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
        // Light snow: 2mm liquid at -5°C (ratio ~11.25:1)
        const lightSnow = snowfallEquivalent(2, 268.15);
        expect(lightSnow).toBeCloseTo(22.5, 1);
        
        // Moderate snow: 10mm liquid at -10°C (ratio ~17.5:1)
        const moderateSnow = snowfallEquivalent(10, 263.15);
        expect(moderateSnow).toBeCloseTo(175, 1);
        
        // Heavy snow: 25mm liquid at -15°C (ratio ~23.75:1)
        const heavySnow = snowfallEquivalent(25, 258.15);
        expect(heavySnow).toBeCloseTo(593.75, 1);
    });
});
