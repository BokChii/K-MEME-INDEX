
export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  votes: number;
  replies: Comment[];
}

export interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

export interface StockRecommendation {
  stockName: string;
  stockCode: string;
  logicType: 'K-Phonetic' | 'K-Network' | 'K-Butterfly';
  logicDescription: string;
  currentPrice?: string;
  expectedTrend: 'UP' | 'DOWN';
  memeIndex: number;
  marketCap?: string;
  volume24h?: string;
  priceHistory?: PricePoint[];
}

export interface AnalysisResult {
  newsSummary: string;
  marketContext: string;
  recommendations: StockRecommendation[];
  overallBrainrotLevel: number;
  commentary: string;
  sources?: { title: string; uri: string }[];
}

export interface BrainrotBreakdown {
  logicLeap: number;
  communityFever: number;
  fomoLevel: number;
  themeWeirdness: number;
  marketAnomaly: number;
}

export interface DashboardData {
  overallIndex: number;
  breakdown: BrainrotBreakdown;
  breakdownReason: string;
  ranking: {
    name: string;
    code: string;
    memeIndex: number;
    reason: string;
  }[];
}

export interface MemePost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
  votes: number;
  timestamp: string;
  isHolyGrail?: boolean;
  comments: Comment[];
  images?: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  tier: '개미 연구원' | '상한가 사냥꾼' | '작전 설계자' | '전설의 큰손';
  totalPower: number;
  followers: number;
  postCount: number;
  tendency: string[];
  badges: Badge[];
  isFollowing?: boolean;
}

export enum Page {
  HOME = 'HOME',
  ANALYZER = 'ANALYZER',
  COMMUNITY = 'COMMUNITY',
  PROFILE = 'PROFILE'
}
