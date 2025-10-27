import { getCategory } from '../../src/scales/uvindex';

describe('UV Index Category', () => {
    it('should return Low for UV index 0', () => {
        const result = getCategory(0);
        expect(result.category).toBe("Low");
    });

    it('should return Low for UV index 2', () => {
        const result = getCategory(2);
        expect(result.category).toBe("Low");
    });

    it('should return Moderate for UV index 3', () => {
        const result = getCategory(3);
        expect(result.category).toBe("Moderate");
    });

    it('should return Moderate for UV index 5', () => {
        const result = getCategory(5);
        expect(result.category).toBe("Moderate");
    });

    it('should return High for UV index 6', () => {
        const result = getCategory(6);
        expect(result.category).toBe("High");
    });

    it('should return High for UV index 7', () => {
        const result = getCategory(7);
        expect(result.category).toBe("High");
    });

    it('should return Very High for UV index 8', () => {
        const result = getCategory(8);
        expect(result.category).toBe("Very High");
    });

    it('should return Very High for UV index 10', () => {
        const result = getCategory(10);
        expect(result.category).toBe("Very High");
    });

    it('should return Extreme for UV index 11', () => {
        const result = getCategory(11);
        expect(result.category).toBe("Extreme");
    });

    it('should return Extreme for UV index 15', () => {
        const result = getCategory(15);
        expect(result.category).toBe("Extreme");
    });
});