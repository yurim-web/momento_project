'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { diaryApi, DiaryData } from '@/lib/api'

export default function DiaryPage() {
  const [filter, setFilter] = useState<'all' | 'mine'>('all')
  const [diaries, setDiaries] = useState<DiaryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDiaries()
  }, [filter])

  const loadDiaries = async () => {
    setLoading(true)
    try {
      const email = localStorage.getItem('userEmail') || ''
      const data = filter === 'mine'
        ? await diaryApi.getAll(email)
        : await diaryApi.getAll()
      setDiaries(data)
    } catch {
      console.error('일기를 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'))
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  const recentMoods = diaries.slice(0, 5).map(d => d.mood).filter(Boolean)

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-handwriting text-3xl text-gray-600">일기장</h1>
          <Link href="/diary/write" className="btn-primary !w-auto px-5 py-2 text-sm">
            일기 쓰기
          </Link>
        </div>

        {recentMoods.length > 0 && (
          <div className="card-pastel p-4 mb-6 flex items-center justify-center gap-3">
            <span className="text-sm text-gray-400">최근 기분:</span>
            {recentMoods.map((mood, i) => (
              <span key={i} className="text-xl">{mood}</span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {([['all', '전체'], ['mine', '내 일기']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                filter === key
                  ? 'bg-lavender-300 text-white'
                  : 'bg-white text-gray-400 border border-lavender-100 hover:border-lavender-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8">불러오는 중...</p>
        ) : diaries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">📖</p>
            <p className="text-gray-400">아직 일기가 없어요</p>
            <Link href="/diary/write" className="text-sm text-lavender-400 hover:text-lavender-500 mt-2 inline-block">
              오늘의 일기를 작성해보세요
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {diaries.map((diary) => (
              <Link key={diary.id} href={`/diary/${diary.id}`} className="block">
                <div className="card-pastel p-5 hover:scale-[1.01] transition-transform">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{diary.mood}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-gray-600 truncate">{diary.title}</h3>
                        {!diary.isShared && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">🔒</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{diary.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{formatDate(diary.diaryDate)}</span>
                        <span className="text-xs text-lavender-400">{diary.authorName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
