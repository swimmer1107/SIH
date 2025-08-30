import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
// FIX: Added CropRecommendationResult to imports to support the new crop recommendation feature.
import { DiseaseResult, ChatMessage, Scheme, CropRecommendationResult, SatelliteAnalysisResult } from '../types';
import { supabase } from './supabaseClient';

// --- VERY IMPORTANT SECURITY WARNING ---
// For demonstration purposes, the API key is placed directly in the code.
// In a real-world application, this is extremely insecure.
// Anyone who can see your code can steal your API key and use it,
// potentially causing you to be charged for their usage.
//
// For a production application, you MUST:
// 1. Create a backend server (e.g., a simple Node.js server or a serverless function).
// 2. Store your API key securely on the server as an environment variable.
// 3. Have your frontend app make requests to YOUR server.
// 4. Have YOUR server make the actual requests to the Gemini API using the key.
//
// This approach is ONLY for a short-term, non-public demo.
const API_KEY = "AIzaSyBh32P70N9chptemsEBBkF4PFUq2dIWXJo";

let ai: GoogleGenAI;

const getAI = (): GoogleGenAI => {
    if (!ai) {
        // The check for a placeholder key has been removed to use the key provided above.
        // Ensure the API_KEY constant is valid.
        if (!API_KEY) {
            throw new Error("Gemini API key is not set in services/geminiService.ts.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};

export const getChatbotResponse = async (history: ChatMessage[], message: string): Promise<string> => {
    try {
        const aiInstance = getAI();
        
        // The first message is a greeting from the AI. Exclude it from the history sent to the model.
        const conversationHistory = history.slice(1).map(msg => ({
            role: msg.sender === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...conversationHistory,
                { role: 'user', parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: "You are CropGuru, an AI assistant for Indian farmers. Answer questions about crops, government schemes, fertilizers, and modern farming techniques. Be helpful, concise, and support English and Hindi. If asked something unrelated to farming, politely decline to answer.",
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        if (error instanceof Error && error.message.includes("API key")) {
            return "service.gemini.apiKeyError";
        }
        return "service.gemini.connectError";
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
        if (error instanceof Error && error.message.includes("API key")) {
             throw new Error("service.gemini.imageAnalysisConfigError");
        }
        throw new Error("service.gemini.imageAnalysisGeneralError");
    }
};

const SCHEMES_CACHE_STALE_MS = 24 * 60 * 60 * 1000; // 24 hours

export const getGovernmentSchemes = async (): Promise<Scheme[]> => {
    let isCacheTableMissing = false;

    // 1. Check for schemes in the Supabase database cache
    try {
        // Fetches the most recent cache entry. Assumes a table `cached_schemes` exists
        // with `data` (jsonb) and `created_at` (timestamp with default now()) columns.
        const { data: cachedData, error: cacheError } = await supabase
            .from('cached_schemes')
            .select('data, created_at')
            .order('created_at', { ascending: false })
            .limit(1);

        if (cacheError) {
             // Check if the error is because the table doesn't exist.
            if (cacheError.message.includes("Could not find the table")) {
                console.warn("Supabase cache table 'cached_schemes' not found. Caching is disabled. To enable it, create the table in your Supabase project. The AI will be queried directly.");
                isCacheTableMissing = true;
            } else {
                // For other errors, log it but still fall back to the AI.
                console.error("Error fetching schemes from DB cache, will fallback to AI:", cacheError.message);
            }
        } else if (cachedData && cachedData.length > 0) {
            const cache = cachedData[0];
            const isCacheStale = (new Date().getTime() - new Date(cache.created_at).getTime()) > SCHEMES_CACHE_STALE_MS;
            if (!isCacheStale) {
                console.log("Returning schemes from Supabase DB cache.");
                return cache.data as Scheme[];
            }
             console.log("DB cache is stale, fetching fresh data from AI.");
        }
    } catch (e) {
        console.error("Failed to read schemes from DB cache, fetching fresh data.", e);
    }

    // 2. If cache is stale or missing, fetch from the AI model
    try {
        console.log("Fetching fresh government schemes from AI.");
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

        // 3. Store the new data in the Supabase DB cache for future requests, but only if the table exists.
        if (!isCacheTableMissing) {
            try {
                const { error: insertError } = await supabase
                    .from('cached_schemes')
                    .insert({ data: schemes });

                if (insertError) {
                    // This error shouldn't be "table not found" now, but could be something else (e.g., RLS policy violation)
                    console.error("Failed to write schemes to DB cache:", insertError.message);
                }
            } catch (e) {
                console.error("Failed to write schemes to DB cache.", e);
            }
        }
        
        return schemes;

    } catch (error) {
        console.error("Error fetching government schemes from AI:", error);
        if (error instanceof Error && error.message.includes("API key")) {
            throw new Error("service.gemini.schemesConfigError");
        }
        throw new Error("service.gemini.schemesGeneralError");
    }
};

export interface CropRecommendationParams {
    state: string;
    district: string;
    soilColor: string;
    soilTexture: string;
    rainfall: string;
}

export const getCropRecommendation = async (params: CropRecommendationParams): Promise<CropRecommendationResult> => {
    try {
        const aiInstance = getAI();
        const prompt = `As an expert agronomist for Indian farming conditions, recommend the best crop to plant based on the following information provided by a farmer.
- Location: ${params.district}, ${params.state}, India
- Soil Color: ${params.soilColor}
- Soil Texture: ${params.soilTexture} (how it feels)
- Annual Rainfall Pattern: ${params.rainfall}

From this information, infer the likely soil nutrient profile (Nitrogen, Phosphorus, Potassium levels), soil pH, average temperature, and humidity typical for that region and soil type. Use this inferred data to make your recommendation.
For example, black, sticky soil in a high rainfall area like Maharashtra is likely rich in nutrients and good for cotton or sugarcane. Red, gritty soil in a low rainfall area of Rajasthan would be better for millets or pulses.

Provide one primary recommendation, detailed reasoning for why it's suitable, 2-3 alternative crops with brief reasons, and actionable soil management tips based on the described soil type.
Finally, provide a comparative analysis of all recommended crops (the primary one and the alternatives). For each crop, rate its Market Value, Water Requirement, and Pest Resistance on a scale of 'High', 'Moderate', or 'Low'. Also, include brief notes summarizing the pros and cons for each.
Respond only in the requested JSON format.`;

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendedCrop: { type: Type.STRING, description: "The single best crop to plant based on the inputs." },
                        reasoning: { type: Type.STRING, description: "A detailed explanation for why the recommended crop is suitable." },
                        alternativeCrops: {
                            type: Type.ARRAY,
                            description: "A list of 2-3 alternative suitable crops.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "The name of the alternative crop." },
                                    reason: { type: Type.STRING, description: "A brief reason why this alternative is also suitable." }
                                },
                                required: ['name', 'reason']
                            }
                        },
                        soilManagementTips: {
                            type: Type.ARRAY,
                            description: "A list of actionable tips for managing the soil based on the provided data.",
                            items: {
                                type: Type.STRING
                            }
                        },
                        comparativeAnalysis: {
                            type: Type.ARRAY,
                            description: "A comparative analysis of the recommended and alternative crops.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    cropName: { type: Type.STRING, description: "The name of the crop being analyzed." },
                                    marketValue: { type: Type.STRING, description: "The potential market value or profitability.", enum: ['High', 'Moderate', 'Low'] },
                                    waterRequirement: { type: Type.STRING, description: "The amount of water required.", enum: ['High', 'Moderate', 'Low'] },
                                    pestResistance: { type: Type.STRING, description: "The natural resistance to common pests and diseases.", enum: ['High', 'Moderate', 'Low'] },
                                    notes: { type: Type.STRING, description: "A brief summary of pros and cons for this crop." }
                                },
                                required: ['cropName', 'marketValue', 'waterRequirement', 'pestResistance', 'notes']
                            }
                        }
                    },
                    required: ['recommendedCrop', 'reasoning', 'alternativeCrops', 'soilManagementTips', 'comparativeAnalysis']
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as CropRecommendationResult;
        return result;

    } catch (error) {
        console.error("Error getting crop recommendation:", error);
        if (error instanceof Error && error.message.includes("API key")) {
             throw new Error("service.gemini.cropRecConfigError");
        }
        throw new Error("service.gemini.cropRecGeneralError");
    }
};

export const getSatelliteAnalysis = async (location: string): Promise<SatelliteAnalysisResult> => {
    try {
        const aiInstance = getAI();
        const prompt = `You are an advanced agricultural satellite imagery analysis system. Based on the provided location in India ("${location}"), generate a plausible and realistic analysis for a typical mid-sized farm (around 25-35 hectares) in that area. Consider the typical crops, climate, and geography of the location. Provide the analysis in JSON format. The JSON should include: a health score (an integer percentage from 60 to 98), an NDVI value (a float between 0.5 and 0.9), a soil moisture index (a float between 0.4 and 0.9), an array of 2-3 potential stress areas as strings (e.g., 'Slight water logging possible in the eastern fields due to soil type', 'Lower vegetation density on the northern boundary suggests potential nutrient deficiency'), and an analyzed area in hectares (a float between 25.0 and 35.0).`;

        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        healthScore: { type: Type.INTEGER, description: "Overall farm health as a percentage from 60 to 98." },
                        ndvi: { type: Type.NUMBER, description: "Normalized Difference Vegetation Index, from 0.5 to 0.9." },
                        moisture: { type: Type.NUMBER, description: "Soil moisture index, from 0.4 to 0.9." },
                        stressAreas: {
                            type: Type.ARRAY,
                            description: "A list of 2-3 potential stress areas.",
                            items: { type: Type.STRING }
                        },
                        area: { type: Type.NUMBER, description: "Analyzed area in hectares, from 25.0 to 35.0." }
                    },
                    required: ['healthScore', 'ndvi', 'moisture', 'stressAreas', 'area']
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as SatelliteAnalysisResult;
        return result;

    } catch (error) {
        console.error("Error getting satellite analysis:", error);
        if (error instanceof Error && error.message.includes("API key")) {
             throw new Error("service.gemini.satelliteConfigError");
        }
        throw new Error("service.gemini.satelliteGeneralError");
    }
};
