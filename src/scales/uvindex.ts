/**
 * Returns the UV index category for a given UV index value.
 * @param {number} uvIndex - The UV index value
 * @returns {{ index: string, lowerLimit: number, upperLimit: number, category: string, color: string, advice: string }}
 */
export function getCategory(uvIndex: number) {
    const categories = [
        { index: "Low", lowerLimit: 0, upperLimit: 2, category: "Low", color: "#3EA72D", advice: "No protection needed." },
        { index: "Moderate", lowerLimit: 3, upperLimit: 5, category: "Moderate", color: "#FFF300", advice: "Seek shade during midday hours, cover up and wear sunscreen." },
        { index: "High", lowerLimit: 6, upperLimit: 7, category: "High", color: "#F18B00", advice: "Reduce time in the sun between 10 a.m. and 4 p.m., cover up, wear a hat and sunglasses, and use sunscreen." },
        { index: "Very High", lowerLimit: 8, upperLimit: 10, category: "Very High", color: "#E53210", advice: "Minimize sun exposure between 10 a.m. and 4 p.m., apply SPF 30+ sunscreen, wear protective clothing." },
        { index: "Extreme", lowerLimit: 11, upperLimit: Infinity, category: "Extreme", color: "#B567A4", advice: "Avoid sun exposure, seek shade, wear protective clothing and sunglasses, use SPF 50+ sunscreen." }
    ];

    return categories.find(cat => uvIndex >= cat.lowerLimit && uvIndex <= cat.upperLimit) || categories[0];
}