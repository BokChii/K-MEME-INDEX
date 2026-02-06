
import React, { useState } from 'react';
import { MemePost } from '../types';

const MOCK_POSTS: MemePost[] = [
  { id: '1', title: '샘 알트먼과 샘표의 연결고리를 찾았습니다.', content: '샘 알트먼의 "샘"은 사실 샘표의 브랜드 아이덴티티를 동경해서 지은 이름입니다. 팩트체크 완료.', author: '뇌절박사', votes: 152, timestamp: '10분 전' },
  { id: '2', title: '성지순례 왔습니다. 동양철관 풀매수했던 놈입니다.', content: '영일만 앞바다에 석유가 콸콸 나올거라 말했을 때 아무도 안 믿었죠? 이제 제가 세력입니다.', author: '동해물과백두산이', votes: 890, timestamp: '1시간 전', isHolyGrail: true },
  { id: '3', title: '내일 비 오면 제습기 관련주 가나요?', content: '비가 오면 습함 -> 불쾌지수 상승 -> 싸움 발생 -> 병원 치료 -> 제약주 급등? 이거 맞냐?', author: '의식의흐름', votes: -12, timestamp: '2시간 전' },
];

const Community: React.FC = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleVote = (id: string, delta: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + delta } : p));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-meme">뇌절 연구소</h2>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-all">
          가설 등록하기
        </button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className={`bg-zinc-900 p-5 rounded-2xl border ${post.isHolyGrail ? 'border-yellow-600/50 ring-1 ring-yellow-600/20' : 'border-zinc-800'} relative`}>
            {post.isHolyGrail && (
              <span className="absolute -top-3 left-4 bg-yellow-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Holy Grail (성지)</span>
            )}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-xs">{post.author}</span>
                  <span className="text-zinc-600 text-xs">•</span>
                  <span className="text-zinc-600 text-xs">{post.timestamp}</span>
                </div>
                <h3 className="text-lg font-bold leading-tight">{post.title}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2">{post.content}</p>
              </div>
              <div className="flex flex-col items-center bg-black/30 rounded-xl p-2 min-w-[60px]">
                <button onClick={() => handleVote(post.id, 1)} className="text-zinc-500 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className={`font-meme text-lg ${post.votes >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{post.votes}</span>
                <button onClick={() => handleVote(post.id, -1)} className="text-zinc-500 hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">#뇌절가설</span>
              <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">#국장광기</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
