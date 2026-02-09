
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DashboardData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const fetchRealtimeDashboardData = async (): Promise<DashboardData> => {
  const systemInstruction = `
    너는 대한민국 주식 시장(국장)의 실시간 트렌드를 분석하는 'K-Meme Index' AI 엔진이야.
    반드시 구글 검색을 통해 '오늘' 혹은 '최근 24시간' 내 한국 주식 시장에서 가장 화제가 된 테마, 뉴스, 종목 토론방 분위기를 파악해.

    [지표 산출 가이드]
    1. overallIndex: 전체 시장의 광기를 0~100 사이로 산출해.
    2. breakdown (0-100점):
       - logicLeap: 뉴스-종목 간의 연결이 얼마나 억지스러운가?
       - communityFever: 종토방, 갤러리 등의 화력이 얼마나 뜨거운가?
       - fomoLevel: 개미들이 못 사서 안달 난 정도는?
       - themeWeirdness: 테마가 얼마나 기괴하고 예상치 못한가?
       - marketAnomaly: 거래량이나 주가 변동이 상식 밖인가?
    3. ranking: 현재 가장 밈화 된 종목 5개를 선정하고, 그 이유를 '종토방' 감성으로 1문장 작성해.

    반드시 JSON 형식으로 응답해.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "현재 한국 주식 시장의 실시간 밈 트렌드와 화제의 종목 5개를 분석해서 대시보드 데이터를 만들어줘.",
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallIndex: { type: Type.INTEGER },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              logicLeap: { type: Type.INTEGER },
              communityFever: { type: Type.INTEGER },
              fomoLevel: { type: Type.INTEGER },
              themeWeirdness: { type: Type.INTEGER },
              marketAnomaly: { type: Type.INTEGER }
            },
            required: ["logicLeap", "communityFever", "fomoLevel", "themeWeirdness", "marketAnomaly"]
          },
          breakdownReason: { type: Type.STRING },
          ranking: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                code: { type: Type.STRING },
                memeIndex: { type: Type.INTEGER },
                reason: { type: Type.STRING }
              },
              required: ["name", "code", "memeIndex", "reason"]
            }
          }
        },
        required: ["overallIndex", "breakdown", "breakdownReason", "ranking"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as DashboardData;
};

export const analyzeNewsWithGrounding = async (input: string): Promise<AnalysisResult> => {
  const systemInstruction = `
    너는 대한민국 주식 시장(국장)의 'K-뇌절 엔진' 수석 연구원이야.
    사용자가 입력한 뉴스나 URL을 분석해 한국 주식 시장의 여러 종목과 '창의적이고 억지스럽게' 연결해.

    [Instruction]
    1. 반드시 구글 검색을 활용해 뉴스의 최신 맥락과 관련 기업의 '실제 주가', '거래량', '시가총액' 정보를 파악해.
    2. 분석 결과로 3~5개의 관련주를 추천해.
    3. 각 추천 종목에 대해 최근 7일간의 가격 및 거래량 추이를 priceHistory로 제공해.
    4. 말투는 '종토방' 감성으로 뻔뻔하고 당당하게 작성해.
    5. 결과는 반드시 JSON 형식으로 반환해.
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
          newsSummary: { type: Type.STRING },
          marketContext: { type: Type.STRING },
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
                marketCap: { type: Type.STRING },
                volume24h: { type: Type.STRING },
                expectedTrend: { type: Type.STRING, enum: ["UP", "DOWN"] },
                memeIndex: { type: Type.INTEGER },
                priceHistory: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      price: { type: Type.NUMBER },
                      volume: { type: Type.NUMBER }
                    },
                    required: ["time", "price", "volume"]
                  }
                }
              },
              required: ["stockName", "stockCode", "logicType", "logicDescription", "expectedTrend", "memeIndex", "priceHistory"],
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
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    result.sources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
  }

  return result;
};
