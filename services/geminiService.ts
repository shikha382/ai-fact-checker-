
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, ClaimAnalysis, GroundingSource } from "../types";

export const verifyText = async (text: string): Promise<VerificationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Step 1: Analyze text and extract claims with grounding
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following AI-generated text for factual accuracy and potential hallucinations. 
    1. Identify key testable claims.
    2. Cross-reference them with current search results.
    3. Evaluate if any citations provided in the text are legitimate or fake.
    
    TEXT TO VERIFY:
    "${text}"`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER, description: "A score from 0-100 representing overall reliability." },
          claims: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['verified', 'uncertain', 'hallucination'] },
                explanation: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                supportingEvidence: { type: Type.STRING }
              },
              required: ["text", "status", "explanation"]
            }
          }
        },
        required: ["overallScore", "claims"]
      }
    },
  });

  const rawJson = response.text;
  const parsed = JSON.parse(rawJson);
  
  // Extract grounding sources from metadata
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: GroundingSource[] = groundingChunks
    .map((chunk: any) => ({
      title: chunk.web?.title || 'External Source',
      uri: chunk.web?.uri || ''
    }))
    .filter((s: GroundingSource) => s.uri !== '');

  return {
    originalText: text,
    overallScore: parsed.overallScore,
    claims: parsed.claims.map((c: any, i: number) => ({ ...c, id: `claim-${i}` })),
    sources: sources
  };
};
