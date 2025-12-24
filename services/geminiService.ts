
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getSantaRecommendation(productName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Santa Claus. Someone is looking at a snack called "${productName}" from "Berry Merry Bites". 
      Give them a very short, jolly, 2-sentence holiday recommendation on why they should try it. Be festive!`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "Ho ho ho! It looks delicious, my friend!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ho ho ho! This treat is on my nice list this year!";
  }
}
