'use client'

import Link from 'next/link'

const features = [
  {
    emoji: '✍️',
    title: '우리의 이야기',
    desc: '데이트, 여행, 기념일을 게시글로 남기고, 메모 탭에서 할 말·맛집·기억할 것들을 스티커처럼 저장해요.',
    color: 'bg-pink-50 border-pink-100',
    dot: 'bg-pink-200',
  },
  {
    emoji: '🌸',
    title: '일기장',
    desc: '오늘의 기분, 속상한 일, 행복한 순간을 섹션별로 기록해요. 상대방과 공유하거나 나만 볼 수 있어요.',
    color: 'bg-lavender-50 border-lavender-100',
    dot: 'bg-lavender-200',
  },
  {
    emoji: '🗓️',
    title: '캘린더',
    desc: '데이트, 기념일, 생일 일정을 함께 관리하고, 가입할 때 입력한 생일은 자동으로 등록돼요.',
    color: 'bg-mint-50 border-mint-100',
    dot: 'bg-mint-200',
  },
  {
    emoji: '🌷',
    title: '갤러리',
    desc: '둘만의 사진을 모아 예쁜 갤러리를 만들어요. 소중한 순간들을 한눈에 볼 수 있어요.',
    color: 'bg-peach-50 border-peach-100',
    dot: 'bg-peach-200',
  },
  {
    emoji: '🗺️',
    title: '여행 & 버킷리스트',
    desc: '일별 여행 일정을 세우고, 가고 싶은 맛집·카페·장소를 버킷리스트로 저장해 완료 체크까지!',
    color: 'bg-pink-50 border-pink-100',
    dot: 'bg-pink-200',
  },
  {
    emoji: '🫧',
    title: '둘만의 채팅',
    desc: '비밀 채팅으로 언제든 달콤한 대화를 나눠요. 우리만의 프라이빗 공간이에요.',
    color: 'bg-lavender-50 border-lavender-100',
    dot: 'bg-lavender-200',
  },
]

const steps = [
  { num: '01', title: '회원가입', desc: '이름, 애칭, 생일을 입력하고 가입해요' },
  { num: '02', title: '커플 연결', desc: '초대코드를 공유해 연인과 연결해요' },
  { num: '03', title: '기록 시작', desc: '일상의 소소한 순간부터 특별한 기억까지' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50 overflow-hidden">
      {/* 배경 블러 오브 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-lavender-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 left-10 w-56 h-56 bg-mint-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-peach-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-2xl mx-auto px-5">

        {/* ── Hero ── */}
        <section className="pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-50 border border-pink-100 rounded-full mb-6">
            <span className="text-xs font-ui text-pink-400">커플을 위한 프라이빗 블로그</span>
          </div>
          <h1 className="font-handwriting text-6xl sm:text-7xl text-pink-400 mb-4 leading-tight">
            Momento
          </h1>
          <p className="font-handwriting text-2xl text-gray-500 mb-3">
            우리의 특별한 순간들
          </p>
          <p className="font-ui text-sm text-gray-400 leading-relaxed max-w-sm mx-auto mb-10">
            일상의 소소한 순간부터 특별한 기념일까지,<br />
            연인과 함께 기록하는 둘만의 공간이에요.
          </p>

          {/* 플로팅 카드 미리보기 */}
          <div className="relative h-52 mb-12 select-none">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-52 bg-white/90 rounded-3xl border border-pink-100 shadow-lg p-4 rotate-[-3deg]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-sm">🌸</div>
                <div>
                  <p className="font-ui text-xs font-bold text-gray-600">오늘의 한마디</p>
                </div>
              </div>
              <p className="font-handwriting text-sm text-pink-400 leading-relaxed">
                &quot;오늘도 네가 있어서 좋아 🌷&quot;
              </p>
            </div>
            <div className="absolute left-1/2 -translate-x-[30%] top-6 w-48 bg-white/90 rounded-3xl border border-lavender-100 shadow-lg p-4 rotate-[4deg]">
              <p className="font-ui text-xs text-lavender-400 mb-1">🗓️ D-200</p>
              <p className="font-ui text-xs font-bold text-gray-600">사귄 날</p>
              <p className="font-handwriting text-lg text-lavender-400 mt-1">2024. 11. 25</p>
            </div>
            <div className="absolute left-1/2 -translate-x-[70%] top-8 w-44 bg-white/90 rounded-3xl border border-mint-100 shadow-lg p-4 rotate-[-1deg]">
              <p className="font-ui text-xs text-mint-400 mb-1.5">📍 홍대 맛집</p>
              <p className="font-ui text-xs font-bold text-gray-600">파스타 먹으러 가기</p>
              <p className="font-ui text-xs text-gray-300 mt-1">버킷리스트</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-primary !w-auto px-8 py-3 text-base">
              무료로 시작하기
            </Link>
            <Link href="/login" className="btn-secondary !w-auto px-8 py-3 text-base">
              로그인
            </Link>
          </div>
        </section>

        {/* ── 시작 방법 ── */}
        <section className="py-10">
          <h2 className="font-handwriting text-3xl text-gray-600 text-center mb-8">
            이렇게 시작해요
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-200 to-lavender-200 flex items-center justify-center mx-auto mb-3">
                  <span className="font-handwriting text-sm text-white font-bold">{step.num}</span>
                </div>
                <p className="font-ui text-sm font-bold text-gray-600 mb-1">{step.title}</p>
                <p className="font-ui text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 기능 소개 ── */}
        <section className="py-10">
          <h2 className="font-handwriting text-3xl text-gray-600 text-center mb-2">
            이런 것들을 할 수 있어요
          </h2>
          <p className="font-ui text-sm text-gray-400 text-center mb-8">
            연인과 함께하는 모든 순간을 담아요
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className={`rounded-3xl border-2 p-5 ${f.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/70 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                    {f.emoji}
                  </div>
                  <h3 className="font-ui text-sm font-bold text-gray-600">{f.title}</h3>
                </div>
                <p className="font-ui text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 특징 하이라이트 ── */}
        <section className="py-10">
          <div className="card-pastel p-8 text-center">
            <p className="text-4xl mb-4">🔒</p>
            <h3 className="font-handwriting text-2xl text-gray-600 mb-3">
              우리 둘만의 공간
            </h3>
            <p className="font-ui text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              Momento는 커플 전용 프라이빗 블로그예요.<br />
              외부에 공개되지 않는 둘만의 비밀 공간에서<br />
              소중한 기억들을 함께 쌓아가요.
            </p>
            <div className="flex justify-center gap-6 mt-6">
              {['🌸 일기', '🗓️ 캘린더', '🌷 갤러리', '🫧 채팅'].map(item => (
                <span key={item} className="font-ui text-xs text-gray-400">{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-12 text-center">
          <p className="text-5xl mb-5">🌿</p>
          <h2 className="font-handwriting text-3xl text-gray-600 mb-3">
            지금 시작해볼까요?
          </h2>
          <p className="font-ui text-sm text-gray-400 mb-8">
            가입은 무료예요. 지금 바로 우리의 이야기를 기록해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/signup" className="btn-primary !w-auto px-10 py-3 text-base">
              무료로 시작하기 →
            </Link>
          </div>
          <Link href="/guide" className="font-ui text-xs text-lavender-400 hover:text-lavender-500 transition-colors">
            자세한 사용 가이드 보기
          </Link>
        </section>

        {/* ── 푸터 ── */}
        <footer className="py-8 text-center border-t border-pink-50">
          <p className="font-handwriting text-2xl text-pink-300 mb-2">Momento</p>
          <p className="font-ui text-xs text-gray-300">
            사랑하는 사람과 함께, 소중한 순간들을
          </p>
        </footer>

      </div>
    </div>
  )
}
