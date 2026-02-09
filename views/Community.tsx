
import React, { useState, useMemo, useRef } from 'react';
import { MemePost, Comment } from '../types';

const MOCK_POSTS: MemePost[] = [
  { 
    id: '1', 
    title: '샘 알트먼과 샘표의 연결고리를 찾았습니다.', 
    content: '샘 알트먼의 "샘"은 사실 샘표의 브랜드 아이덴티티를 동경해서 지은 이름입니다. 팩트체크 완료.', 
    author: '뇌절박사',
    authorId: 'user1',
    votes: 152, 
    timestamp: '10분 전',
    images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'],
    comments: [
      { 
        id: 'c1', 
        author: '개미1', 
        text: '이거 진짜인듯 ㄷㄷ', 
        timestamp: '5분 전', 
        votes: 12, 
        replies: [
          { id: 'r1', author: '샘표주주', text: '이미 선반영 됐습니다.', timestamp: '3분 전', votes: 5, replies: [] }
        ] 
      }
    ]
  },
  { 
    id: '2', 
    title: '성지순례 왔습니다. 동양철관 풀매수했던 놈입니다.', 
    content: '영일만 앞바다에 석유가 콸콸 나올거라 말했을 때 아무도 안 믿었죠? 이제 제가 세력입니다.', 
    author: '동해물과백두산이',
    authorId: 'user2',
    votes: 890, 
    timestamp: '1시간 전', 
    isHolyGrail: true,
    comments: [
      { 
        id: 'c2', 
        author: '구조대', 
        text: '형님 저 8층인데 데리러 오시나요?', 
        timestamp: '30분 전', 
        votes: 45, 
        replies: [] 
      }
    ]
  },
  { 
    id: '3', 
    title: '내일 비 오면 제습기 관련주 가나요?', 
    content: '비가 오면 습함 -> 불쾌지수 상승 -> 싸움 발생 -> 병원 치료 -> 제약주 급등? 이거 맞냐?', 
    author: '의식의흐름', 
    votes: -12, 
    timestamp: '2시간 전',
    comments: []
  }
];

type FilterType = 'latest' | 'power' | 'holygrail' | 'buzz';

interface CommunityProps {
  onUserClick?: (userId: string) => void;
}

const Community: React.FC<CommunityProps> = ({ onUserClick }) => {
  const [posts, setPosts] = useState<MemePost[]>(MOCK_POSTS);
  const [isWriting, setIsWriting] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [formError, setFormError] = useState<{title?: boolean, content?: boolean}>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [replyTarget, setReplyTarget] = useState<{ postId: string, commentId: string } | null>(null);
  const [newReply, setNewReply] = useState<string>('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('latest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_TITLE = 50;
  const MAX_CONTENT = 500;

  const countTotalComments = (post: MemePost) => {
    let count = post.comments.length;
    post.comments.forEach(c => count += c.replies.length);
    return count;
  };

  const handleFilterClick = (filter: FilterType) => {
    if (activeFilter === filter) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setActiveFilter(filter);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q) || 
        p.author.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (activeFilter) {
        case 'power':
          comparison = b.votes - a.votes;
          break;
        case 'holygrail':
          comparison = (b.isHolyGrail ? 1 : 0) - (a.isHolyGrail ? 1 : 0);
          break;
        case 'buzz':
          comparison = countTotalComments(b) - countTotalComments(a);
          break;
        case 'latest':
        default:
          comparison = b.id.localeCompare(a.id);
          break;
      }
      return sortDirection === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [posts, searchQuery, activeFilter, sortDirection]);

  const handleVote = (id: string, delta: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + delta } : p));
  };

  const handleVoteComment = (postId: string, commentId: string, delta: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: p.comments.map(c => {
        if (c.id === commentId) return { ...c, votes: c.votes + delta };
        return {
          ...c,
          replies: c.replies.map(r => r.id === commentId ? { ...r, votes: r.votes + delta } : r)
        };
      })
    } : p));
  };

  // Fixed handleImageUpload to explicitly cast files to File[] to avoid 'unknown' inference
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 2 - selectedImages.length;
    // Explicitly cast to File[] to ensure 'file' in forEach is treated as a Blob/File
    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result as string]);
      };
      // reader.readAsDataURL expects a Blob; File is a subclass of Blob.
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {title?: boolean, content?: boolean} = {};
    if (!newPost.title.trim()) errors.title = true;
    if (!newPost.content.trim()) errors.content = true;

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    const post: MemePost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: newPost.author || '익명의 연구원',
      votes: 0,
      timestamp: '방금 전',
      comments: [],
      images: selectedImages.length > 0 ? selectedImages : undefined
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', author: '' });
    setSelectedImages([]);
    setFormError({});
    setIsWriting(false);
  };

  const handleAddComment = (postId: string) => {
    const text = newComment[postId];
    if (!text?.trim()) return;

    const comment: Comment = {
      id: 'c-' + Date.now().toString(),
      author: '나그네',
      text: text,
      timestamp: '방금 전',
      votes: 0,
      replies: []
    };

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
    setNewComment({ ...newComment, [postId]: '' });
  };

  const handleAddReply = (postId: string, commentId: string) => {
    if (!newReply.trim()) return;

    const reply: Comment = {
      id: 'r-' + Date.now().toString(),
      author: '대댓글연구원',
      text: newReply,
      timestamp: '방금 전',
      votes: 0,
      replies: []
    };

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: p.comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c)
    } : p));

    setNewReply('');
    setReplyTarget(null);
  };

  const toggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-meme bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">뇌절 연구소</h2>
          <p className="text-zinc-500 text-sm mt-1">집단지성으로 완성하는 국장식 억지 논리의 장</p>
        </div>
        {!isWriting && (
          <button 
            onClick={() => setIsWriting(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-2xl transition-all shadow-lg shadow-red-900/20 active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            가설 등록
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text"
            placeholder="가설 제목, 내용, 또는 연구원 검색..."
            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-zinc-700 shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['latest', 'power', 'holygrail', 'buzz'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterClick(f)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5 ${
                activeFilter === f 
                  ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {f === 'latest' && '최신순'}
              {f === 'power' && '화력순'}
              {f === 'holygrail' && '성지순례'}
              {f === 'buzz' && '토론순'}
              {activeFilter === f && (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Post Editor */}
      {isWriting && (
        <div className="bg-zinc-900/80 border-2 border-red-600/30 rounded-3xl p-6 shadow-2xl animate-slideDown backdrop-blur-md relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                New Hypothesis
              </span>
              <button type="button" onClick={() => setIsWriting(false)} className="text-zinc-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-1">
              <input 
                autoFocus
                maxLength={MAX_TITLE}
                placeholder="창의적인 뇌절 제목을 입력하세요"
                className={`w-full bg-black/40 border ${formError.title ? 'border-red-600' : 'border-zinc-800'} focus:border-red-600 rounded-xl px-4 py-3 outline-none transition-all font-bold text-lg`}
                value={newPost.title}
                onChange={e => setNewPost({...newPost, title: e.target.value})}
              />
            </div>

            <textarea 
              maxLength={MAX_CONTENT}
              placeholder="근거 있는(사실은 억지인) 논리를 펼쳐주세요..."
              className={`w-full bg-black/40 border ${formError.content ? 'border-red-600' : 'border-zinc-800'} focus:border-red-600 rounded-xl px-4 py-3 outline-none transition-all min-h-[120px] text-zinc-300`}
              value={newPost.content}
              onChange={e => setNewPost({...newPost, content: e.target.value})}
            />

            {/* Image Upload UI */}
            <div className="space-y-3">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-700 flex-shrink-0 group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeSelectedImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {selectedImages.length < 2 && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-800 hover:border-red-600 hover:bg-red-600/5 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-600 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] text-zinc-600 group-hover:text-red-500 font-bold">이미지 (최대 2장)</span>
                  </button>
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>

            <div className="flex gap-4">
              <input 
                placeholder="연구원 활동명 (미입력 시 익명)"
                className="flex-grow bg-black/40 border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-3 outline-none transition-all text-sm"
                value={newPost.author}
                onChange={e => setNewPost({...newPost, author: e.target.value})}
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg active:scale-95">가설 등록</button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
            <p className="text-zinc-500 text-sm">조건에 맞는 가설이 없습니다.</p>
          </div>
        ) : (
          filteredAndSortedPosts.map(post => (
            <div key={post.id} className={`group relative bg-zinc-900 rounded-3xl border ${post.isHolyGrail ? 'border-yellow-600/40 bg-gradient-to-br from-zinc-900 to-yellow-900/5' : 'border-zinc-800'} transition-all hover:border-zinc-700 shadow-xl overflow-hidden`}>
              {post.isHolyGrail && (
                <div className="absolute top-0 right-0 bg-yellow-600 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter shadow-lg z-10">✨ Holy Grail</div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start gap-6 relative z-10">
                  <div className="flex-grow space-y-3">
                    <div className="flex items-center gap-2">
                      <div 
                        onClick={() => post.authorId && onUserClick?.(post.authorId)}
                        className="flex items-center gap-2 cursor-pointer group/author"
                      >
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-700 group-hover/author:border-red-500 transition-colors">
                          {post.author[0]}
                        </div>
                        <span className="text-zinc-400 text-xs font-bold group-hover/author:text-red-500 transition-colors">{post.author}</span>
                      </div>
                      <span className="text-zinc-700 text-xs">•</span>
                      <span className="text-zinc-600 text-xs">{post.timestamp}</span>
                    </div>
                    <h3 onClick={() => toggleExpand(post.id)} className="text-xl font-bold leading-tight group-hover:text-red-500 transition-colors cursor-pointer hover:underline underline-offset-4">{post.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    
                    {/* Render Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className={`grid gap-2 pt-2 ${post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.images.map((img, i) => (
                          <div key={i} className="rounded-2xl overflow-hidden border border-zinc-800 shadow-md">
                            <img src={img} alt="post-img" className="w-full h-auto max-h-[400px] object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                      <button onClick={() => toggleExpand(post.id)} className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-xs font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        댓글 {countTotalComments(post)}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-black/40 rounded-2xl p-2.5 min-w-[70px] border border-zinc-800/50">
                    <button onClick={() => handleVote(post.id, 1)} className="text-zinc-600 hover:text-red-500 transition-all active:scale-125"><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg></button>
                    <div className="flex flex-col items-center -my-1">
                      <span className={`font-meme text-2xl ${post.votes >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{post.votes}</span>
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Power</span>
                    </div>
                    <button onClick={() => handleVote(post.id, -1)} className="text-zinc-600 hover:text-blue-500 transition-all active:scale-125"><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></button>
                  </div>
                </div>
              </div>
              {expandedPostId === post.id && (
                <div className="bg-black/30 border-t border-zinc-800 p-6 space-y-6 animate-slideDown">
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="space-y-3">
                        <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700/30 flex gap-4">
                           <div className="flex flex-col items-center gap-1 bg-black/20 rounded-xl px-2 py-1 h-fit">
                             <button onClick={() => handleVoteComment(post.id, comment.id, 1)} className="text-zinc-500 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                             <span className="text-xs font-bold text-zinc-300">{comment.votes}</span>
                             <button onClick={() => handleVoteComment(post.id, comment.id, -1)} className="text-zinc-500 hover:text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                           </div>
                           <div className="flex-grow">
                             <div className="flex justify-between items-center mb-1">
                               <span className="text-xs font-black text-red-500 uppercase">{comment.author}</span>
                               <span className="text-[10px] text-zinc-600">{comment.timestamp}</span>
                             </div>
                             <p className="text-sm text-zinc-300 mb-2">{comment.text}</p>
                             <button onClick={() => setReplyTarget(replyTarget?.commentId === comment.id ? null : { postId: post.id, commentId: comment.id })} className="text-[10px] font-bold text-zinc-500 hover:text-white flex items-center gap-1">대댓글 달기</button>
                           </div>
                        </div>
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="ml-10 bg-zinc-800/20 p-3 rounded-xl border border-zinc-700/20 flex gap-3">
                            <div className="flex flex-col items-center gap-1 bg-black/10 rounded-lg px-1.5 py-0.5 h-fit">
                              <button onClick={() => handleVoteComment(post.id, reply.id, 1)} className="text-zinc-600 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                              <span className="text-[10px] font-bold text-zinc-400">{reply.votes}</span>
                              <button onClick={() => handleVoteComment(post.id, reply.id, -1)} className="text-zinc-600 hover:text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                            </div>
                            <div className="flex-grow"><span className="text-[10px] font-black text-blue-400 uppercase">{reply.author}</span><p className="text-xs text-zinc-400">{reply.text}</p></div>
                          </div>
                        ))}
                        {replyTarget?.commentId === comment.id && (
                          <div className="ml-10 flex gap-2 animate-fadeIn">
                             <input autoFocus placeholder="대댓글 내용을 입력하세요..." className="flex-grow bg-zinc-900 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs outline-none" value={newReply} onChange={e => setNewReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddReply(post.id, comment.id)}/>
                             <button onClick={() => handleAddReply(post.id, comment.id)} className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-4 rounded-xl text-xs font-bold border border-blue-600/30">대댓글</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-zinc-800/50 mt-4">
                    <input placeholder="뇌절 한마디 거들기..." className="flex-grow bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-2 text-xs outline-none" value={newComment[post.id] || ''} onChange={e => setNewComment({ ...newComment, [post.id]: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}/>
                    <button onClick={() => handleAddComment(post.id)} className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl text-xs font-bold shadow-lg shadow-red-900/20">등록</button>
                  </div>
                </div>
              )}
              <div className="absolute -left-10 top-0 bottom-0 w-1 bg-red-600 opacity-0 group-hover:opacity-100 group-hover:left-0 transition-all duration-300"></div>
            </div>
          ))
        )}
      </div>
      <footer className="pt-10 pb-6 text-center">
        <p className="text-zinc-600 text-xs font-medium">현재 1,245명의 연구원이 뇌절 회로를 가동 중입니다.</p>
      </footer>
    </div>
  );
};

export default Community;
