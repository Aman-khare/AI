import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = ai.chats.create({
  model: 'gemini-2.5-flash',
});


export const getAIResponseStream = async (
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    newMessage: string,
    diaryEntries?: string,
    therapyAnalysis?: string
) => {
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