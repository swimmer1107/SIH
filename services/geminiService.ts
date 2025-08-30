
import { GoogleGenAI, Chat, GenerateContentResponse, Type, Modality } from "@google/genai";
import { DiseaseResult, ChatMessage, Scheme } from '../types';

let ai: GoogleGenAI;
let chat: Chat | null = null;

const getAI = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const getChatbotResponse = async (history: ChatMessage[], message: string): Promise<string> => {
    try {
        const aiInstance = getAI();
        if (!chat) {
            chat = aiInstance.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are CropGuru, an AI assistant for Indian farmers. Answer questions about crops, government schemes, fertilizers, and modern farming techniques. Be helpful, concise, and support English and Hindi. If asked something unrelated to farming, politely decline to answer.",
                },
            });
        }

        const response: GenerateContentResponse = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.";
    }
};


export const analyzeCropImage = async (base64Image: string, mimeType: string): Promise<DiseaseResult> => {
    try {
        const aiInstance = getAI();
        const prompt = "You are a plant disease expert. Identify the disease from this image of a plant leaf. If a disease is found, provide the disease name, a confidence percentage (e.g., 95), and a recommended treatment plan for farmers in India. If no disease is detected, state that the plant appears healthy. Respond only in the requested JSON format.";

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        diseaseName: { type: Type.STRING, description: "Name of the detected disease. 'N/A' if healthy." },
                        confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100." },
                        treatment: { type: Type.STRING, description: "Recommended treatment plan. 'N/A' if healthy." },
                        isHealthy: { type: Type.BOOLEAN, description: "True if the plant appears healthy, otherwise false." },
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as DiseaseResult;
        return result;

    } catch (error) {
        console.error("Error analyzing crop image:", error);
        throw new Error("Failed to analyze image. The AI model might be unavailable or the image could not be processed.");
    }
};

export const getGovernmentSchemes = async (): Promise<Scheme[]> => {
    try {
        const aiInstance = getAI();
        const prompt = "List 7 major and currently active government schemes for farmers in India. For each scheme, provide a real, official government link where farmers can get more information. Ensure the links are accurate and lead to the scheme's official page. Also provide a title, a brief description, eligibility criteria, and a relevant category (e.g., 'Insurance', 'Financial Support', 'Credit', 'Soil Health', 'Market Prices', 'Irrigation').";

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            eligibility: { type: Type.STRING },
                            link: { type: Type.STRING },
                            category: { type: Type.STRING }
                        },
                        required: ['title', 'description', 'eligibility', 'link', 'category']
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const schemes = JSON.parse(jsonText) as Scheme[];
        return schemes;

    } catch (error) {
        console.error("Error fetching government schemes:", error);
        throw new Error("Failed to fetch government schemes. The AI model might be unavailable or there was a network issue.");
    }
};
