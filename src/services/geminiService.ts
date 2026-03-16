import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SearchResult } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    objects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          boundingBox: { 
            type: Type.ARRAY, 
            items: { type: Type.NUMBER },
            description: "[ymin, xmin, ymax, xmax] in normalized coordinates 0-1000"
          },
          texture: { type: Type.STRING, enum: ["smooth", "rough", "wrinkled"] },
          moisture: { type: Type.STRING, enum: ["low", "medium", "high"] },
          volume_cm3: { type: Type.NUMBER },
          weight_g: { type: Type.NUMBER },
          nutrients: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              carbohydrates: { type: Type.NUMBER },
              fiber: { type: Type.NUMBER },
              sugar: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              vitaminA: { type: Type.NUMBER },
              vitaminC: { type: Type.NUMBER },
              vitaminK: { type: Type.NUMBER },
              potassium: { type: Type.NUMBER },
              magnesium: { type: Type.NUMBER },
            },
            required: ["calories", "carbohydrates", "fiber", "sugar", "protein", "vitaminA", "vitaminC", "vitaminK", "potassium", "magnesium"]
          }
        },
        required: ["name", "confidence", "boundingBox", "texture", "moisture", "volume_cm3", "weight_g", "nutrients"]
      }
    }
  },
  required: ["objects"]
};

const SEARCH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    nutrient: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING }
        },
        required: ["name", "amount"]
      }
    }
  },
  required: ["nutrient", "items"]
};

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult[]> => {
  const model = "gemini-3.1-pro-preview"; // Using pro for better spatial reasoning
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const prompt = `
    Analyze this image for fruits and vegetables. 
    Perform the following:
    1. Detect all fruits and vegetables. Provide bounding boxes in [ymin, xmin, ymax, xmax] format (0-1000).
    2. Classify each item.
    3. Analyze texture (smooth, rough, wrinkled) based on visual patterns (GLCM-like analysis).
    4. Estimate moisture level (low, medium, high) based on color saturation and glossiness (HSV-like analysis).
    5. Estimate volume in cm3 and weight in grams based on size relative to surroundings.
    6. Provide complete nutritional data for the estimated weight.
  `;

  const result = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  });

  const parsed = JSON.parse(result.text || '{"objects": []}');
  return parsed.objects;
};

export const searchByNutrient = async (nutrient: string): Promise<SearchResult> => {
  const model = "gemini-3-flash-preview";
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const prompt = `Find fruits and vegetables rich in ${nutrient}. Provide the typical amount per 100g.`;

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: SEARCH_SCHEMA
    }
  });

  return JSON.parse(result.text || '{"nutrient": "", "items": []}');
};
