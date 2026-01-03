
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `Eres un experto perfumista de "Redfragances". 
Tu objetivo es ayudar a los clientes de forma EXTREMADAMENTE CONCISA. 
Da respuestas muy cortas, directas y moderadas. 
No uses párrafos largos. Recomienda 1 o 2 opciones máximo. 
Usa un tono elegante pero minimalista. Habla siempre en español.`;

export async function getFragranceAdvice(history: ChatMessage[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
        topP: 0.8,
        topK: 40,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error en la API de Gemini:", error);
    return "Lo siento, tuve un problema de conexión. ¿Cómo puedo ayudarte hoy?";
  }
}
