import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSculptingIdea = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a creative director for a 3D sculpting artist. 
      The user is asking for a sculpting idea or feedback.
      User Prompt: "${prompt}"
      Keep the response concise, inspiring, and focused on visual descriptions.`,
    });
    return response.text || "Could not generate an idea at this time.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Error connecting to AI Assistant.";
  }
};

export const generateReferenceImage = async (description: string): Promise<{ imageUrl: string | null, text: string }> => {
  try {
    const ai = getAiClient();
    
    // We use the image generation model for references
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Generate a reference image for a 3D sculpture based on this description: ${description}.`,
      config: {
        // @ts-ignore - imageConfig types might be strict in some versions, but this is the correct 2.5 usage
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    let imageUrl = null;
    let text = "";

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          text += part.text;
        }
      }
    }
    
    return { imageUrl, text: text || "Here is a reference image." };
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return { imageUrl: null, text: "Failed to generate image. Please try again." };
  }
};