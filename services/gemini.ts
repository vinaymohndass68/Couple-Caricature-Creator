
import { GoogleGenAI } from "@google/genai";
import { GenerationResult, ImageSource } from "../types";

export const generateCaricature = async (
  wifeImage: ImageSource,
  husbandImage: ImageSource
): Promise<GenerationResult> => {
  // Always create a fresh instance before calling to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use the Pro model for high-quality facial likeness
  const model = 'gemini-3-pro-image-preview';

  const wifePart = {
    inlineData: {
      data: wifeImage.data,
      mimeType: wifeImage.mimeType,
    },
  };

  const husbandPart = {
    inlineData: {
      data: husbandImage.data,
      mimeType: husbandImage.mimeType,
    },
  };

  const promptPart = {
    text: `Create a single, professional digital caricature of a husband and wife based on these two source photos.
    
    CORE REQUIREMENT: UNCOMPROMISING FACIAL LIKENESS.
    - The face of the woman in the caricature must be an exact artistic rendition of the 'Wife' photo provided.
    - The face of the man in the caricature must be an exact artistic rendition of the 'Husband' photo provided.
    - It is critical to preserve their unique identifying features: hair color and style, eye shape, facial structure, and any accessories like glasses.
    - They should be instantly recognizable as the specific individuals in the photos.
    
    ART STYLE:
    - High-quality digital painting with professional lighting and vibrant colors.
    - Exaggerated proportions: large heads on small, expressive bodies.
    - Clean, modern caricature style (avoiding generic or uncanny faces).
    
    SCENE:
    - Place them in a funny, relatable marital situation.
    
    CAPTIONS:
    - Provide a one-line hilarious caption about their relationship dynamic in your text response.`
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [wifePart, husbandPart, promptPart],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    let imageUrl = '';
    let caption = 'The secret to a happy marriage is... still being a secret!';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          caption = part.text.trim();
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Model failed to generate an image.");
    }

    return { imageUrl, caption };
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // If the error indicates a missing project/billing, we pass it up to trigger a re-selection
    throw error;
  }
};
