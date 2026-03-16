export interface NutrientData {
  calories: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  protein: number;
  vitaminA: number;
  vitaminC: number;
  vitaminK: number;
  potassium: number;
  magnesium: number;
}

export interface AnalysisResult {
  name: string;
  confidence: number;
  boundingBox: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  texture: 'smooth' | 'rough' | 'wrinkled';
  moisture: 'low' | 'medium' | 'high';
  volume_cm3: number;
  weight_g: number;
  nutrients: NutrientData;
}

export interface SearchResult {
  nutrient: string;
  items: {
    name: string;
    amount: string;
  }[];
}
