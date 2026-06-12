'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { PostData } from '@/lib/api'

interface MemoData {
  id: string
  title: string
  content: string
  color: 'pink' | 'lavender' | 'mint' | 'yellow'
  authorName: string
  createdAt: string
  pinned?: boolean
}

interface CalendarEvent {
  id: number
  title: string
  date: string
  color?: string
}

const memoColors = {
  pink:     { bg: 'bg-pink-50',     border: 'border-pink-200',     dot: 'bg-pink-300' },
  lavender: { bg: 'bg-lavender-50', border: 'border-lavender-200', dot: 'bg-lavender-300' },
  mint:     { bg: 'bg-mint-50',     border: 'border-mint-200',     dot: 'bg-mint-300' },
  yellow:   { bg: 'bg-yellow-50',   border: 'border-yellow-200',   dot: 'bg-yellow-300' },
}

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const DAILY_QUOTES = [
  '오늘도 네 옆에 있어서 행복해 🌸',
  '같이 있으면 모든 순간이 특별해져 ✨',
  '너랑 함께라면 평범한 하루도 소중해 💌',
  '오늘 하루도 수고했어, 잘 버텨줘서 고마워 🌿',
  '네가 있어서 내 세상이 더 따뜻해 🌷',
  '같이 밥 먹는 것도 다 추억이 되는 것 같아 🍚',
  '오늘도 내 곁에 있어줘서 고마워 🫧',
  '너의 웃음이 오늘 하루를 버티게 해줬어 🌙',
  '우리가 함께한 모든 순간을 기억하고 싶어 📔',
  '네 생각 하면 저절로 웃음이 나와 🌸',
  '오늘도 잘 자, 좋은 꿈 꿔 🌙',
  '함께라서 든든해, 고마워 💕',
  '어떤 하루였어도 너랑 끝내면 괜찮아 🍃',
  '보고 싶다 이 말이 항상 맴돌아 🫶',
  '오늘도 건강하게, 밥 잘 챙겨 먹어 🌿',
  '네 손 잡으면 다 괜찮아지는 것 같아 🌷',
  '우리 앞으로도 이렇게 오래오래 함께하자 ✨',
  '오늘 하루 중 네가 제일 좋은 부분이었어 💌',
  '작은 것도 함께하면 특별해지잖아 🌸',
  '네가 웃을 때가 제일 예뻐 🌙',
  '오늘도 나한테 와줘서 고마워 🫧',
  '같이 늙어가는 것도 설레는 일이야 🌿',
  '너랑 있으면 시간 가는 게 아쉬워 💕',
  '힘든 날도 네가 있으면 버틸 수 있어 🍃',
  '오늘도 사랑해, 내일도 사랑할 거야 🌷',
  '네 목소리 듣고 싶다 🌸',
  '우리 오늘 뭐 먹을까? 같이 먹으면 다 맛있어 🍀',
  '세상에서 제일 좋아하는 사람이야 ✨',
  '네가 행복하면 나도 행복해 💌',
  '오늘 하루도 고생했어, 이제 푹 쉬어 🌙',
]

const getDailyQuote = () => {
  const now = new Date()
  const dayIndex = Math.floor(
    (now.getFullYear() * 366 + Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000))
  ) % DAILY_QUOTES.length
  return DAILY_QUOTES[dayIndex]
}

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [memos, setMemos] = useState<MemoData[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [calMonth, setCalMonth] = useState(new Date())

  const [coupleData, setCoupleData] = useState({
    person1: '나',
    person2: '당신',
    startDate: '2024-01-15',
  })
  const [myPhoto, setMyPhoto] = useState<string | null>(null)
  const [partnerPhoto, setPartnerPhoto] = useState<string | null>(null)

  const dailyQuote = getDailyQuote()

  useEffect(() => {
    const savedStartDate = localStorage.getItem('coupleStartDate')
    const savedPerson1 = localStorage.getItem('userName') || '나'
    const savedPerson2 = localStorage.getItem('partnerName') || '당신'
    setCoupleData(prev => ({
      ...prev,
      person1: savedPerson1,
      person2: savedPerson2,
      startDate: savedStartDate || prev.startDate,
    }))

    setMyPhoto(localStorage.getItem('myProfilePhoto'))
    setPartnerPhoto(localStorage.getItem('partnerProfilePhoto'))

    const posts = JSON.parse(localStorage.getItem('momento_posts') || '[]')
    setRecentPosts(posts.slice(0, 5))

    const allMemos: MemoData[] = JSON.parse(localStorage.getItem('momento_memos') || '[]')
    const pinned = allMemos.filter(m => m.pinned)
    const latest = allMemos.filter(m => !m.pinned)
    setMemos([...pinned, ...latest].slice(0, 4))

    setCalendarEvents(JSON.parse(localStorage.getItem('momento_calendar') || '[]'))

    setLoading(false)
  }, [])

  const getDDay = () => {
    const start = new Date(coupleData.startDate)
    const today = new Date()
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  // ── 미니 캘린더 계산 ──────────────────────────────────────
  const buildCalendar = () => {
    const year = calMonth.getFullYear()
    const month = calMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length < 42) cells.push(null)
    return cells
  }

  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() &&
    calMonth.getMonth() === today.getMonth() &&
    calMonth.getFullYear() === today.getFullYear()

  const eventDaysInMonth = new Set(
    calendarEvents
      .filter(e => {
        const d = new Date(e.date)
        return d.getFullYear() === calMonth.getFullYear() && d.getMonth() === calMonth.getMonth()
      })
      .map(e => new Date(e.date).getDate())
  )

  const prevMonth = () => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const cells = buildCalendar()

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* D+Day 섹션 */}
        <Link href="/anniversary" className="block">
          <section className="card-pastel p-8 text-center mb-6 hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden border-2 border-pink-200">
                {myPhoto
                  ? <img src={myPhoto} alt="내 프로필" className="w-full h-full object-cover" />
                  : <span className="font-handwriting text-xl text-pink-400">{coupleData.person1}</span>}
              </div>
              <span className="font-handwriting text-3xl text-pink-300">♥</span>
              <div className="w-16 h-16 rounded-full bg-lavender-100 flex items-center justify-center overflow-hidden border-2 border-lavender-200">
                {partnerPhoto
                  ? <img src={partnerPhoto} alt="상대방 프로필" className="w-full h-full object-cover" />
                  : <span className="font-handwriting text-xl text-lavender-400">{coupleData.person2}</span>}
              </div>
            </div>
            <p className="font-handwriting text-4xl text-pink-400 mb-1">D+{getDDay()}</p>
            <p className="text-sm text-gray-400 font-ui">{coupleData.startDate} ~</p>
          </section>
        </Link>

        {/* 오늘의 한마디 + 미니 캘린더 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* 왼쪽: 두 박스 */}
          <div className="flex flex-col gap-4 h-[320px]">
            {/* 오늘의 한마디 */}
            <section className="card-pastel p-5 bg-gradient-to-br from-pink-50 to-lavender-50 flex-1 flex flex-col">
              <p className="font-ui text-sm font-bold text-lavender-400 mb-3">오늘의 한마디 ✨</p>
              <div className="flex-1 flex items-center justify-center">
                <p className="font-handwriting text-lg text-gray-600 text-center leading-relaxed">
                  &ldquo;{dailyQuote}&rdquo;
                </p>
              </div>
            </section>

            {/* 오늘 일정 */}
            <section className="card-pastel p-5 flex-1 flex flex-col">
              <p className="font-ui text-sm font-bold text-pink-400 mb-3">오늘 일정 🗓️</p>
              {(() => {
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                const todayEvents = calendarEvents.filter(e => e.date === todayStr)
                return todayEvents.length > 0 ? (
                  <div className="space-y-1.5">
                    {todayEvents.slice(0, 3).map(e => (
                      <div key={e.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-300 flex-shrink-0" />
                        <p className="font-ui text-xs text-gray-500 truncate">{e.title}</p>
                      </div>
                    ))}
                    {todayEvents.length > 3 && (
                      <p className="font-ui text-xs text-gray-300 ml-3.5">+{todayEvents.length - 3}개 더</p>
                    )}
                  </div>
                ) : (
                  <p className="font-ui text-xs text-gray-300">오늘은 일정이 없어요 🌿</p>
                )
              })()}
            </section>
          </div>

          {/* 미니 캘린더 */}
          <Link href="/calendar">
            <section className="card-pastel p-4 hover:scale-[1.01] transition-transform h-[320px] flex flex-col">
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-2">
                <button onClick={e => { e.preventDefault(); prevMonth() }} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-pink-400 text-lg">‹</button>
                <p className="font-ui text-sm font-bold text-gray-500">{calMonth.getFullYear()}년 {calMonth.getMonth() + 1}월</p>
                <button onClick={e => { e.preventDefault(); nextMonth() }} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-pink-400 text-lg">›</button>
              </div>

              {/* 요일 */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map((d, i) => (
                  <div key={d} className={`text-center font-ui text-xs py-1 ${i === 0 ? 'text-red-300' : i === 6 ? 'text-blue-300' : 'text-gray-400'}`}>{d}</div>
                ))}
              </div>

              {/* 날짜 그리드 — 항상 6행 고정 */}
              <div className="grid grid-cols-7 flex-1">
                {Array.from({ length: 42 }, (_, idx) => {
                  const day = cells[idx] ?? null
                  return (
                    <div key={idx} className="flex flex-col items-center justify-start pt-0.5">
                      {day !== null ? (
                        <>
                          <span className={`font-ui text-xs w-6 h-6 flex items-center justify-center rounded-full
                            ${isToday(day) ? 'bg-pink-300 text-white font-bold'
                              : idx % 7 === 0 ? 'text-red-300'
                              : idx % 7 === 6 ? 'text-blue-300'
                              : 'text-gray-500'}`}>
                            {day}
                          </span>
                          {eventDaysInMonth.has(day) && <span className="w-1 h-1 rounded-full bg-lavender-300 mt-0.5" />}
                        </>
                      ) : <span className="w-6 h-6" />}
                    </div>
                  )
                })}
              </div>
            </section>
          </Link>
        </div>

        {/* 메모 섹션 */}
        {memos.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-handwriting text-2xl text-gray-600">메모 🌙</h2>
              <Link href="/posts" className="text-sm text-pink-400 hover:text-pink-500 font-ui">더보기</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {memos.map(memo => {
                const c = memoColors[memo.color] ?? memoColors.pink
                const commentCount = JSON.parse(localStorage.getItem('momento_memo_comments') || '[]')
                  .filter((cc: { memoId: string }) => cc.memoId === memo.id).length
                return (
                  <Link key={memo.id} href="/posts" className={`rounded-2xl border-2 p-4 ${c.bg} ${c.border} hover:scale-[1.02] transition-transform`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                      {memo.pinned && <span className="text-xs">📌</span>}
                    </div>
                    {memo.title && (
                      <p className="font-ui text-sm font-bold text-gray-600 mb-1.5">{memo.title}</p>
                    )}
                    <p className="font-ui text-sm text-gray-500 leading-relaxed line-clamp-3 whitespace-pre-wrap">{memo.content}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-ui text-xs text-gray-300">{formatDateTime(memo.createdAt)}</p>
                      {commentCount > 0 && <span className="font-ui text-xs text-gray-300">💬 {commentCount}</span>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* 빠른 메뉴 */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { href: '/posts/new', icon: '✍️', label: '글쓰기' },
            { href: '/diary/write', icon: '🌸', label: '일기' },
            { href: '/calendar', icon: '🗓️', label: '캘린더' },
            { href: '/anniversary', icon: '💌', label: '기념일' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="card-pastel p-4 text-center hover:scale-105 transition-transform">
              <span className="text-2xl block mb-1">{item.icon}</span>
              <span className="text-xs text-gray-500 font-ui">{item.label}</span>
            </Link>
          ))}
        </section>

        {/* 최근 게시글 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-handwriting text-2xl text-gray-600">최근 이야기</h2>
            <Link href="/posts" className="text-sm text-pink-400 hover:text-pink-500 font-ui">전체보기</Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="card-pastel p-8 text-center">
                <p className="text-gray-400 text-sm font-ui">불러오는 중...</p>
              </div>
            ) : recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} className="block">
                  <div className="card-pastel p-4 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-400 mr-2">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-600">{post.title}</span>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="card-pastel p-8 text-center">
                <p className="text-gray-400 text-sm mb-3">아직 작성된 글이 없어요</p>
                <Link href="/posts/new" className="text-sm text-pink-400 hover:text-pink-500">
                  첫 번째 이야기 쓰러 가기 →
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
