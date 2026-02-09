
import React, { useState } from 'react';
import { analyzeNewsWithGrounding } from '../services/geminiService';
import { AnalysisResult } from '../types';
import PriceChart from '../components/PriceChart';

const Analyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeNewsWithGrounding(input);
      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert('세력 형님들의 방해로 분석에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-meme bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">뇌절 회로 풀가동</h1>
        <p className="text-zinc-400">뉴스 URL이나 키워드를 던져주세요. 실시간 주가와 거래량 데이터를 긁어옵니다.</p>
      </div>

      <form onSubmit={handleAnalyze} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="뉴스 링크 또는 종목명 입력..."
          className="relative w-full bg-zinc-900/90 border-2 border-zinc-800 focus:border-red-600 outline-none rounded-3xl px-8 py-5 text-lg transition-all pr-20 shadow-2xl backdrop-blur-md"
        />
        <button
          disabled={loading}
          className="absolute right-4 top-4 bottom-4 aspect-square flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-2xl transition-all disabled:opacity-50 z-10 shadow-lg active:scale-95"
        >
          {loading ? (
             <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </button>
      </form>

      {loading && (
        <div className="text-center space-y-6 py-20">
          <div className="inline-block relative">
             <div className="w-24 h-24 border-8 border-red-900/30 border-t-red-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs font-black animate-pulse">TERMINAL</div>
          </div>
          <div className="space-y-2">
            <p className="text-red-500 font-meme text-xl italic">"실시간 거래소 데이터 동기화 중..."</p>
            <p className="text-zinc-500 text-sm">주가 추이 및 거래량 바 생성 중</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-slideUp">
          {/* News Context Card */}
          <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="text-red-500">📡</span> NEWS FEED
              </h2>
              <div className="bg-red-600/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-red-500/20">
                BRAINROT LEVEL: {result.overallBrainrotLevel}%
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xl font-bold italic leading-tight text-white">"{result.newsSummary}"</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{result.marketContext}</p>
            </div>
          </section>

          {/* Recommendations */}
          <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xl font-meme flex items-center gap-2 px-2">
              <span className="text-red-600">💹</span> 포착된 뇌절 시그널
            </h2>
            {result.recommendations.map((stock, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-600 transition-all group shadow-2xl">
                {/* Stock Header */}
                <div className="bg-zinc-800/40 p-5 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-black italic text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-xl text-white group-hover:text-red-500 transition-colors">
                          {stock.stockName}
                        </span>
                        <span className="px-2 py-0.5 bg-black/50 text-zinc-500 text-[10px] font-mono rounded border border-zinc-700">
                          {stock.stockCode}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
                        <span>시총: <span className="text-zinc-300">{stock.marketCap || '데이터없음'}</span></span>
                        <span>거래량: <span className="text-zinc-300">{stock.volume24h || '0주'}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${stock.expectedTrend === 'UP' ? 'text-red-500' : 'text-blue-500'} flex items-center justify-end gap-1`}>
                      {stock.expectedTrend === 'UP' ? '▲ 상한가' : '▼ 하한가'}
                    </div>
                    <div className="text-[12px] font-mono text-zinc-400 font-bold">{stock.currentPrice} KRW</div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Logic Description */}
                  <div className="relative">
                    <div className="absolute -left-2 top-0 bottom-0 w-1 bg-red-600 rounded-full"></div>
                    <div className="pl-4">
                       <div className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-widest">{stock.logicType} Strategy</div>
                       <p className="text-sm text-zinc-300 leading-relaxed italic">"{stock.logicDescription}"</p>
                    </div>
                  </div>

                  {/* Enhanced Chart Section */}
                  <div className="bg-black/50 p-4 rounded-2xl border border-zinc-800/80 shadow-inner">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Price & Volume Trend</span>
                      </div>
                      <div className="text-[9px] text-zinc-600 font-bold">1W CANDLE ESTIMATE</div>
                    </div>
                    <PriceChart data={stock.priceHistory || []} color={stock.expectedTrend === 'UP' ? '#ef4444' : '#3b82f6'} />
                  </div>

                  {/* Footer Stats */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold text-zinc-500 uppercase">광기지수</span>
                       <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(stock.memeIndex / 20) ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-zinc-800'}`}></div>
                        ))}
                      </div>
                    </div>
                    <button className="text-[11px] font-black text-white bg-red-600/20 hover:bg-red-600 hover:text-white px-4 py-1.5 rounded-lg border border-red-600/30 transition-all uppercase tracking-tighter">
                      종토방 가기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Master Commentary */}
          <div className="bg-gradient-to-r from-zinc-900 to-red-900/10 p-8 rounded-3xl border border-zinc-800 relative group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <KiyoungLogo />
             </div>
             <div className="text-red-600 font-meme text-xl mb-3 flex items-center gap-2">
               <span>💬</span> 수석 연구원의 한마디
             </div>
             <p className="text-xl leading-relaxed text-zinc-200 font-medium italic">"{result.commentary}"</p>
          </div>

          <footer className="pt-12 pb-8 text-center opacity-50">
            <p className="text-[10px] font-black tracking-[0.2em] mb-4 text-zinc-400">MARKET DATA DISCLAIMER</p>
            <p className="text-[10px] leading-relaxed max-w-lg mx-auto text-zinc-500">
              본 서비스에서 제공하는 주가 및 거래량 정보는 AI가 검색 정보를 바탕으로 생성한 예측치입니다.<br/>
              실제 투자 결정은 증권사 HTS를 통해 확인하시기 바라며, 뇌절 매매로 인한 손실은 세력도 모릅니다.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

// Helper components reused for logo
const KiyoungLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 90 L30 70 L40 85 L60 55 L70 75 L90 10" stroke="#FF0000" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M75 10 H90 V25" stroke="#FF0000" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Analyzer;
