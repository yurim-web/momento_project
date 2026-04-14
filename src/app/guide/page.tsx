'use client'

import Link from 'next/link'

const steps = [
  {
    emoji: '💑',
    title: '회원가입 & 커플 연결',
    desc: '각자 회원가입 후, 초대코드를 공유하여 커플로 연결해요.',
  },
  {
    emoji: '✏️',
    title: '우리의 이야기 작성',
    desc: '데이트, 여행, 기념일 등 둘만의 추억을 게시글로 남겨요.',
  },
  {
    emoji: '📖',
    title: '일기장',
    desc: '오늘의 기분과 하루를 기록하고, 상대방과 공유할 수 있어요.',
  },
  {
    emoji: '📅',
    title: '캘린더',
    desc: '데이트 일정, 기념일, 생일 등을 함께 관리해요.',
  },
  {
    emoji: '🖼',
    title: '갤러리',
    desc: '둘만의 사진을 모아 예쁜 갤러리를 만들어요.',
  },
  {
    emoji: '💝',
    title: '기념일 & D-Day',
    desc: '사귄 날부터 자동 계산! 다가오는 기념일도 한눈에 확인해요.',
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-cream-50 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-40 right-10 w-48 h-48 bg-lavender-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 right-20 w-32 h-32 bg-mint-100 rounded-full blur-3xl opacity-30" />

      <div className="max-w-lg mx-auto px-4 py-12 relative">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="font-handwriting text-5xl text-pink-400 mb-3">Momento</h1>
          <p className="font-handwriting text-xl text-pink-300 mb-2">둘만의 이야기를 시작해요</p>
          <p className="font-ui text-sm text-gray-400">커플을 위한 프라이빗 블로그</p>
        </div>

        {/* 소개 카드 */}
        <div className="card-pastel p-6 mb-8 text-center">
          <p className="text-4xl mb-3">♥</p>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-handwriting text-lg">Momento</span>
            <span className="font-ui text-sm">는 연인과 함께 쓰는 프라이빗 블로그예요.</span>
          </p>
          <p className="font-ui text-sm text-gray-400 mt-2">
            일상의 소소한 순간부터 특별한 기념일까지,<br />
            둘만의 공간에 예쁘게 기록해보세요.
          </p>
        </div>

        {/* 기능 가이드 */}
        <h2 className="font-handwriting text-2xl text-gray-600 text-center mb-6">이런 것들을 할 수 있어요</h2>

        <div className="space-y-4 mb-10">
          {steps.map((step, i) => (
            <div key={i} className="card-pastel p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <div>
                  <h3 className="font-ui text-sm font-bold text-gray-600 mb-1">{step.title}</h3>
                  <p className="font-ui text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 시작하기 */}
        <div className="text-center space-y-3">
          <Link href="/signup" className="btn-primary block py-3 text-center">
            시작하기
          </Link>
          <Link href="/login" className="btn-secondary block py-3 text-center">
            이미 계정이 있어요
          </Link>
          <p className="font-handwriting text-sm text-lavender-300 mt-6">
            사랑하는 사람과 함께, Momento ♡
          </p>
        </div>
      </div>
    </div>
  )
}
