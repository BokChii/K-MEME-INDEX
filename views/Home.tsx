
import React from 'react';
import BrainrotGauge from '../components/BrainrotGauge';
import { MOCK_MEME_RANKING, COLORS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Brainrot Index Section */}
      <section className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-meme flex items-center gap-2">
            <span className="text-red-600">📊</span> 오늘의 K-뇌절 지수
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest">REAL-TIME FEED</span>
        </div>
        <div className="flex justify-center py-2">
          <BrainrotGauge value={92} />
        </div>
      </section>

      {/* Real-time Meme Ranking */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-meme flex items-center gap-2">
            <span className="text-red-600">🔥</span> 실시간 밈 랭킹 (HOT)
          </h2>
          <span className="text-xs text-zinc-500 hover:text-red-500 cursor-pointer transition-colors font-medium underline underline-offset-4">전체보기</span>
        </div>
        
        <div className="space-y-4">
          {MOCK_MEME_RANKING.map((stock, idx) => (
            <div 
              key={stock.code} 
              className="group relative flex items-center justify-between bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/50 hover:border-red-600/50 hover:bg-zinc-800/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-900/10"
            >
              <div className="flex items-center gap-5">
                {/* Rank Number with Indicator */}
                <div className="relative flex flex-col items-center justify-center min-w-[24px]">
                  <span className={`text-lg font-black italic ${idx < 3 ? 'text-red-600' : 'text-zinc-600'}`}>
                    {idx + 1}
                  </span>
                  {idx < 3 && <div className="absolute -bottom-1 w-4 h-0.5 bg-red-600/50 rounded-full"></div>}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg group-hover:text-red-500 transition-colors">
                      {stock.name}
                    </span>
                    {/* Distinct Stock Code Label */}
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-mono rounded-md border border-zinc-700 group-hover:border-red-900/50 group-hover:text-red-400 transition-colors uppercase tracking-tight">
                      {stock.code}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 line-clamp-1 group-hover:text-zinc-400 transition-colors">
                    {stock.reason}
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-red-500 font-meme text-xl">
                    {stock.memeIndex}%
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  Brainrot Index
                </div>
              </div>
              
              {/* Subtle side glow on hover */}
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-red-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Best Twist */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-900/10 p-8 rounded-3xl border border-zinc-800 group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
           </svg>
        </div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h2 className="text-xl font-meme text-red-500 italic flex items-center gap-2">
            <span className="not-italic">💡</span> Today's Best Twist
          </h2>
          <span className="bg-red-600/20 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-widest">
            AI Pick
          </span>
        </div>
        
        <p className="text-xl leading-relaxed font-medium relative z-10 text-zinc-200">
          "삼성전자와 엔비디아가 만났는데 왜 <span className="text-red-500 font-meme underline underline-offset-8 decoration-red-600/50 decoration-2">엔비텍</span>이 오르는가? <br className="hidden md:block" /> 이름에 '엔비' 들어가면 다 한식구라는 세력 형님들의 따뜻한 정(情) 논리."
        </p>
      </section>
    </div>
  );
};

export default Home;
