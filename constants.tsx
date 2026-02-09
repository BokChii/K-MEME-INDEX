
import React from 'react';
import { User } from './types';

export const COLORS = {
  PRIMARY: '#FF0000',
  BG: '#121212',
  WHITE: '#FFFFFF',
  SECONDARY: '#2A2A2A'
};

export const MOCK_USERS: Record<string, User> = {
  'user1': {
    id: 'user1',
    name: '뇌절박사',
    avatar: 'https://i.pravatar.cc/150?u=user1',
    tier: '작전 설계자',
    totalPower: 1250,
    followers: 420,
    postCount: 12,
    tendency: ['언어유희', '상한가컬렉터', '엔비디아전문'],
    badges: [
      { id: 'b1', name: '첫 뇌절', icon: '🐣', description: '연구소 첫 가설 등록' },
      { id: 'b2', name: '화력왕', icon: '🔥', description: '화력 1000 돌파' }
    ],
    isFollowing: false
  },
  'user2': {
    id: 'user2',
    name: '동해물과백두산이',
    avatar: 'https://i.pravatar.cc/150?u=user2',
    tier: '전설의 큰손',
    totalPower: 8900,
    followers: 1200,
    postCount: 45,
    tendency: ['정치테마', '석유찌라시', '성지순례자'],
    badges: [
      { id: 'b3', name: '성지 제조기', icon: '✨', description: '성지글 5개 이상 등록' },
      { id: 'b4', name: '여의도 스캐너', icon: '📡', description: '실시간 데이터 분석 50회' }
    ],
    isFollowing: true
  }
};

export const MOCK_MEME_RANKING = [
  { name: '삼성전자', code: '005930', memeIndex: 45, reason: '회장님 어록 분석 중' },
  { name: '샘표', code: '003410', memeIndex: 98, reason: '샘 알트먼 방한 수혜주' },
  { name: '하이브', code: '352820', memeIndex: 82, reason: '민희진 기자회견 착장 분석' },
  { name: '동양철관', code: '008970', memeIndex: 75, reason: '영일만 석유 시추 찌라시' },
  { name: '에코프로', code: '086520', memeIndex: 60, reason: '리튬 가격 반등 뇌절 중' },
];

export const KiyoungLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 90 L30 70 L40 85 L60 55 L70 75 L90 10" stroke="#FF0000" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M75 10 H90 V25" stroke="#FF0000" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
