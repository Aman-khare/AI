
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

async function createErrorStream(message: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    async function* generator(): AsyncGenerator<GenerateContentResponse> {
        // The consumer expects an object with a .text property.
        // We cast to satisfy typing, as this is a mock response.
        yield { text: message } as any as GenerateContentResponse;
    }
    return generator();
}

export const getAIResponseStream = async (
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    newMessage: string,
    diaryEntries?: string,
    therapyAnalysis?: string
): Promise<AsyncGenerator<GenerateContentResponse>> => {
    if (!ai) {
        return createErrorStream("AI service is not configured. An API key is required to use this feature.");
    }
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let systemInstruction = `You are a friendly and empathetic AI mental wellness companion for young people. Your goal is to provide supportive, helpful, and safe conversations. Today is ${formattedDate}. Be aware of common festivals or holidays that might be occurring. You are not a licensed therapist, so do not provide medical advice. Instead, offer encouragement, coping strategies, and a listening ear. Keep responses concise and easy to understand.`;

    if (diaryEntries) {
        systemInstruction += `\n\nThe user has shared their diary with you. Here are their recent entries:\n${diaryEntries}`;
    }
    if (therapyAnalysis) {
        systemInstruction += `\n\nThe user has shared an analysis from a therapy session recording:\n${therapyAnalysis}`;
    }

    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history,
    });
    
    return chat.sendMessageStream({ message: newMessage });
};

export const getSimpleAIResponse = async (prompt: string): Promise<string> => {
    if (!ai) {
        return "AI service is not configured. An API key is required to use this feature.";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching simple AI response:", error);
        return "Sorry, I couldn't process that request right now.";
    }
};