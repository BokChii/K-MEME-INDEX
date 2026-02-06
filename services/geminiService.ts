
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeNewsWithGrounding = async (input: string): Promise<AnalysisResult> => {
  const systemInstruction = `
    너는 대한민국 주식 시장(국장)의 'K-뇌절 엔진' 수석 연구원이야.
    사용자가 입력한 뉴스나 URL의 내용을 분석하고, 이를 한국 주식 시장의 여러 종목과 '창의적이고 억지스럽게' 연결해.

    [Instruction]
    1. 반드시 구글 검색을 활용해 해당 뉴스에 대한 최신 맥락과 관련 인물, 기업의 현재 상황(주가 등)을 파악해.
    2. 분석 결과로 3~5개의 관련주를 추천해. 각 종목은 '3-K Logic' 중 하나를 메인으로 사용해야 해:
       - K-Phonetic (언어유희): 발음 유사성.
       - K-Network (인맥/지연): 학연, 지연, 종친회.
       - K-Butterfly (나비효과): 억지 경제 시나리오.
    3. 말투는 주식 커뮤니티(종토방, 디시) 감성으로 뻔뻔하게 작성해.
    4. 결과는 반드시 JSON 형식으로 반환해.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `분석할 뉴스/키워드: "${input}"`,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          newsSummary: { type: Type.STRING, description: "뉴스의 한줄 요약" },
          marketContext: { type: Type.STRING, description: "현재 시장 상황이나 뉴스 배경 설명" },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stockName: { type: Type.STRING },
                stockCode: { type: Type.STRING },
                logicType: { type: Type.STRING, enum: ["K-Phonetic", "K-Network", "K-Butterfly"] },
                logicDescription: { type: Type.STRING },
                currentPrice: { type: Type.STRING },
                expectedTrend: { type: Type.STRING, enum: ["UP", "DOWN"] },
                memeIndex: { type: Type.INTEGER },
              },
              required: ["stockName", "stockCode", "logicType", "logicDescription", "expectedTrend", "memeIndex"],
            },
          },
          overallBrainrotLevel: { type: Type.INTEGER },
          commentary: { type: Type.STRING },
        },
        required: ["newsSummary", "marketContext", "recommendations", "overallBrainrotLevel", "commentary"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}") as AnalysisResult;
  
  // Extract grounding sources if available
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    result.sources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
  }

  return result;
};
