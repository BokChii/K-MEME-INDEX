
import React, { useState } from 'react';
import BrainrotGauge from '../components/BrainrotGauge';
import BrainrotDiagnosis from '../components/BrainrotDiagnosis';
import { DashboardData } from '../types';

interface Props {
  data: DashboardData | null;
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const Home: React.FC<Props> = ({ data, lastUpdated, isRefreshing, onRefresh }) => {
  const [showDiagnosis, setShowDiagnosis] = useState(false);

  // 데이터가 아예 없을 때만 풀스크린 로딩 표시
  if (!data && isRefreshing) {
    return (
      <div className="space-y-10 animate-fadeIn">
        <section className="bg-zinc-900/40 p-12 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-48 h-48 rounded-full border-8 border-zinc-800 border-t-red-600 animate-spin mb-6"></div>
          <p className="text-red-500 font-meme text-xl italic animate-bounce">
            "실시간 세력 움직임 포착 중..."
          </p>
        </section>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 bg-zinc-900/60 rounded-2xl border border-zinc-800 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-10 transition-opacity duration-500 ${isRefreshing ? 'opacity-80' : 'opacity-100'}`}>
      {/* Brainrot Index Section */}
      <section 
        className="group bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 shadow-2xl backdrop-blur-sm relative overflow-hidden cursor-pointer hover:border-red-600/50 transition-all active:scale-[0.99]"
        onClick={() => setShowDiagnosis(true)}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50 group-hover:opacity-100"></div>
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-meme flex items-center gap-2">
              <span className="text-red-600">📊</span> 오늘의 K-뇌절 지수
            </h2>
            <p className="text-[10px] text-zinc-600 font-bold ml-8">최근 업데이트: {lastUpdated}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest flex items-center gap-1">
              <span className={`w-1.5 h-1.5 bg-red-600 rounded-full ${isRefreshing ? 'animate-ping' : ''}`}></span> LIVE SYNCED
            </span>
            <span className="text-[8px] text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">CLICK FOR DIAGNOSIS</span>
          </div>
        </div>
        <div className="flex justify-center py-2">
          <BrainrotGauge value={data?.overallIndex || 0} />
        </div>
      </section>

      {/* Diagnosis Modal */}
      {showDiagnosis && data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setShowDiagnosis(false)}
          ></div>
          <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] animate-slideUp">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-2xl font-meme text-white">🩺 K-뇌절 정밀 진단서</h3>
                  <p className="text-[10px] text-zinc-500 font-bold tracking-widest">DIAGNOSIS TIME: {lastUpdated}</p>
                </div>
                <button onClick={() => setShowDiagnosis(false)} className="text-zinc-500 hover:text-white transition-colors p-2 bg-zinc-800/50 rounded-full hover:bg-zinc-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <BrainrotDiagnosis data={data.breakdown} reason={data.breakdownReason} />
              <button 
                onClick={() => setShowDiagnosis(false)}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Meme Ranking */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-meme flex items-center gap-2">
              <span className="text-red-600">🔥</span> 실시간 밈 랭킹 (HOT)
            </h2>
            <p className="text-[10px] text-zinc-600 font-bold ml-8">마지막 동기화: {lastUpdated}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onRefresh(); }}
            disabled={isRefreshing}
            className="text-xs text-zinc-500 hover:text-red-500 transition-colors font-medium flex items-center gap-1.5 group disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            수동 갱신
          </button>
        </div>
        
        <div className="space-y-4">
          {data?.ranking.map((stock, idx) => (
            <div 
              key={stock.code} 
              className="group relative flex items-center justify-between bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/50 hover:border-red-600/50 hover:bg-zinc-800/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-900/10"
            >
              <div className="flex items-center gap-5">
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
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-mono rounded-md border border-zinc-700 uppercase tracking-tight">
                      {stock.code}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 line-clamp-1 group-hover:text-zinc-400 transition-colors italic">
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
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-red-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Best Twist (Maintained) */}
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
