
import React, { useState } from 'react';
import { Page } from './types';
import Home from './views/Home';
import Analyzer from './views/Analyzer';
import Community from './views/Community';
import { KiyoungLogo, COLORS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <Home />;
      case Page.ANALYZER: return <Analyzer />;
      case Page.COMMUNITY: return <Community />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-zinc-800 py-4 px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setCurrentPage(Page.HOME)}
        >
          <KiyoungLogo />
          <h1 className="text-2xl font-meme tracking-tighter">K-밈 인덱스</h1>
        </div>
        <div className="text-[10px] text-red-500 font-bold border border-red-500/30 px-2 py-1 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 px-6 py-4 z-50">
        <div className="container mx-auto max-w-lg flex justify-between items-center">
          <button 
            onClick={() => setCurrentPage(Page.HOME)}
            className={`flex flex-col items-center gap-1 transition-all ${currentPage === Page.HOME ? 'text-red-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-bold">대시보드</span>
          </button>
          
          <button 
            onClick={() => setCurrentPage(Page.ANALYZER)}
            className={`flex flex-col items-center gap-1 transition-all ${currentPage === Page.ANALYZER ? 'text-red-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
             <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
             </div>
            <span className="text-[10px] font-bold">뇌절분석</span>
          </button>

          <button 
            onClick={() => setCurrentPage(Page.COMMUNITY)}
            className={`flex flex-col items-center gap-1 transition-all ${currentPage === Page.COMMUNITY ? 'text-red-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <span className="text-[10px] font-bold">연구소</span>
          </button>
        </div>
      </nav>

      {/* Aesthetic Overlay Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-red-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-red-900/10 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
