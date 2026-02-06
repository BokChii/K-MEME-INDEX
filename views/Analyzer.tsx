
import React, { useState } from 'react';
import { analyzeNewsWithGrounding } from '../services/geminiService';
import { AnalysisResult } from '../types';

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
        <p className="text-zinc-400">뉴스 URL이나 키워드를 던져주세요. 국장식 억지 논리 나갑니다.</p>
      </div>

      <form onSubmit={handleAnalyze} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://news... 또는 키워드 입력"
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
             <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs font-black animate-pulse">SEARCHING</div>
          </div>
          <div className="space-y-2">
            <p className="text-red-500 font-meme text-xl italic">"세력들 찌라시 긁어모으는 중..."</p>
            <p className="text-zinc-500 text-sm">뉴스 맥락 파악 및 억지 논리 생성 중</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-slideUp">
          {/* Market Overview */}
          <section className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="text-red-500">📡</span> 뉴스 분석 리포트
              </h2>
              <div className="bg-red-600/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-red-500/20">
                BRAINROT LEVEL: {result.overallBrainrotLevel}%
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xl font-bold italic leading-tight text-white">"{result.newsSummary}"</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{result.marketContext}</p>
            </div>
            {result.sources && result.sources.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {result.sources.slice(0, 3).map((source, i) => (
                  <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-zinc-500 bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 rounded transition-colors flex items-center gap-1">
                    🔗 {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-xl font-meme flex items-center gap-2 px-2">
              <span className="text-red-600">🚀</span> 예상 뇌절 관련주
            </h2>
            {result.recommendations.map((stock, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-600 transition-all group">
                <div className="bg-zinc-800/50 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black italic text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {stock.stockName} 
                        <span className="text-[10px] font-mono opacity-50">{stock.stockCode}</span>
                      </div>
                      <div className="text-[10px] uppercase font-bold text-red-500 tracking-tighter">
                        {stock.logicType} Logic
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-black ${stock.expectedTrend === 'UP' ? 'text-red-500' : 'text-blue-500'} flex items-center justify-end gap-1`}>
                      {stock.expectedTrend === 'UP' ? '▲ 상한가각' : '▼ 하한가각'}
                      {stock.currentPrice && <span className="text-xs text-zinc-400 font-normal ml-2">{stock.currentPrice}</span>}
                    </div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Prediction</div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                    {stock.logicDescription}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(stock.memeIndex / 20) ? 'bg-red-500' : 'bg-zinc-800'}`}></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">MEME INDEX: {stock.memeIndex}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black/40 p-6 rounded-3xl border-l-8 border-red-600 italic text-red-400 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
             </div>
             <p className="text-lg leading-relaxed relative z-10">"{result.commentary}"</p>
          </div>

          <footer className="pt-8 pb-4 text-center border-t border-zinc-800">
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-widest font-bold mb-2">
              ⚠️ DANGER: HIGH VOLATILITY ZONE
            </p>
            <p className="text-[10px] text-zinc-600 leading-relaxed max-w-lg mx-auto">
              본 분석은 뇌절 엔진의 억지 논리로 생성된 유머 데이터입니다. 실제 투자는 본인의 판단이며, <br/>이 결과로 인해 발생한 손실은 세력 형님들도 책임져주지 않습니다.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
