import * as wind from "../phenomena/wind";

export interface SaffirSimpsonScale  {
    min: number;
    max: number;
    category: number;
}

export function getSaffirSimpsonScaleByWindSpeed(windSpeed: number): SaffirSimpsonScale | null {
  if(windSpeed < 0) throw new Error('Wind speed cannot be negative.');
  windSpeed = Math.round(windSpeed); //to nearest integer

  const categories = [
    { min: 33, max: 42, category: 1 },
    { min: 43, max: 49, category: 2 },
    { min: 50, max: 58, category: 3 },
    { min: 59, max: 69, category: 4 },
    { min: 70, max: Infinity, category: 5 }
  ];

  if(windSpeed < categories[0].min) return null;

  return categories.find(cat => windSpeed >= cat.min && windSpeed <= cat.max) || null;
}