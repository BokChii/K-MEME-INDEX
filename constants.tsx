
import React from 'react';

export const COLORS = {
  PRIMARY: '#FF0000', // 상한가 레드
  BG: '#121212',
  WHITE: '#FFFFFF',
  SECONDARY: '#2A2A2A'
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
