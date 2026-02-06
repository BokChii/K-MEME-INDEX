
export interface StockRecommendation {
  stockName: string;
  stockCode: string;
  logicType: 'K-Phonetic' | 'K-Network' | 'K-Butterfly';
  logicDescription: string;
  currentPrice?: string;
  expectedTrend: 'UP' | 'DOWN';
  memeIndex: number;
}

export interface AnalysisResult {
  newsSummary: string;
  marketContext: string;
  recommendations: StockRecommendation[];
  overallBrainrotLevel: number;
  commentary: string;
  sources?: { title: string; uri: string }[];
}

export interface MemePost {
  id: string;
  title: string;
  content: string;
  author: string;
  votes: number;
  timestamp: string;
  isHolyGrail?: boolean;
}

export enum Page {
  HOME = 'HOME',
  ANALYZER = 'ANALYZER',
  COMMUNITY = 'COMMUNITY'
}
