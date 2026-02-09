
import React, { useState } from 'react';
import { User, MemePost } from '../types';

interface ProfileViewProps {
  user: User;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Navigation Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        연구소로 돌아가기
      </button>

      {/* Identity Card */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl">
        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-600 to-black opacity-40 ${user.totalPower > 5000 ? 'animate-pulse' : ''}`}></div>
        
        <div className="relative p-8 pt-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
            <div className="relative group">
              <div className={`absolute -inset-2 bg-red-600 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-1000 ${user.totalPower > 2000 ? 'opacity-30' : ''}`}></div>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="relative w-32 h-32 rounded-full border-4 border-zinc-900 shadow-2xl object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center border-4 border-zinc-900">
                <span className="text-white text-[10px] font-black">LV</span>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h2 className="text-3xl font-meme text-white tracking-tighter">{user.name}</h2>
                <span className="px-3 py-1 bg-red-600/20 text-red-500 text-[10px] font-black rounded-full border border-red-500/30 uppercase tracking-widest">
                  {user.tier}
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {user.tendency.map(t => (
                  <span key={t} className="text-[10px] font-bold text-zinc-500">#{t}</span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                isFollowing 
                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' 
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20'
              }`}
            >
              {isFollowing ? '세력 탈퇴' : '세력 합류'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-black/40 rounded-3xl border border-zinc-800/50">
            <div className="text-center space-y-1">
              <div className="text-2xl font-meme text-red-500">{user.totalPower.toLocaleString()}</div>
              <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Total Power</div>
            </div>
            <div className="text-center space-y-1 border-x border-zinc-800">
              <div className="text-2xl font-meme text-white">{user.followers.toLocaleString()}</div>
              <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Followers</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-meme text-white">{user.postCount}</div>
              <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Hypotheses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Market Achievements</h3>
        <div className="flex flex-wrap gap-4">
          {user.badges.map(badge => (
            <div key={badge.id} className="group relative flex flex-col items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-red-600 transition-all cursor-help">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-[9px] font-bold text-zinc-400">{badge.name}</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-[10px] rounded-xl border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-zinc-800">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'posts' ? 'text-red-500' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            과거 가설
            {activeTab === 'posts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('comments')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'comments' ? 'text-red-500' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            참여 토론
            {activeTab === 'comments' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>}
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'posts' ? (
             <div className="text-center py-12 text-zinc-600 italic text-sm">
                최근 등록한 가설이 로딩 중이거나 없습니다.
             </div>
          ) : (
            <div className="text-center py-12 text-zinc-600 italic text-sm">
                토론 참여 기록을 불러오고 있습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
