'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

const moods = [
  { emoji: '😊', label: '좋아' },
  { emoji: '🥰', label: '사랑' },
  { emoji: '😆', label: '신남' },
  { emoji: '🤗', label: '포근' },
  { emoji: '😌', label: '평온' },
  { emoji: '😢', label: '슬픔' },
  { emoji: '😤', label: '화남' },
  { emoji: '😴', label: '피곤' },
]

export default function DiaryWritePage() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const [alreadyWrote, setAlreadyWrote] = useState(false)
  const [form, setForm] = useState({
    mood: '',
    sadContent: '',
    specialContent: '',
    happyContent: '',
    etcContent: '',
    isShared: true,
  })

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || ''
    const diaries = JSON.parse(localStorage.getItem('momento_diaries') || '[]')
    const todayDiary = diaries.find((d: { diaryDate: string; authorEmail: string }) =>
      d.diaryDate === today && d.authorEmail === email
    )
    if (todayDiary) setAlreadyWrote(true)
  }, [today])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const email = localStorage.getItem('userEmail') || ''
    const name = localStorage.getItem('userName') || ''
    const diaries = JSON.parse(localStorage.getItem('momento_diaries') || '[]')
    const newDiary = {
      id: Date.now(),
      mood: form.mood,
      sadContent: form.sadContent,
      specialContent: form.specialContent,
      happyContent: form.happyContent,
      etcContent: form.etcContent,
      diaryDate: today,
      isShared: form.isShared,
      authorEmail: email,
      authorName: name,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('momento_diaries', JSON.stringify([newDiary, ...diaries]))
    router.push('/diary')
  }

  if (authLoading) {
    return <div className="min-h-screen bg-cream-50"><Navbar /><p className="text-center py-12 text-gray-400 font-ui">로딩 중...</p></div>
  }
  if (!isLoggedIn) return null

  if (alreadyWrote) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="card-pastel p-12 text-center">
            <p className="text-5xl mb-4">📖</p>
            <h2 className="font-handwriting text-2xl text-gray-600 mb-2">오늘 일기는 이미 썼어요!</h2>
            <p className="font-ui text-sm text-gray-400 mb-6">일기는 하루에 한 번만 쓸 수 있어요</p>
            <button onClick={() => router.push('/diary')} className="btn-primary !w-auto px-8">
              일기장으로
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-2">오늘의 일기</h1>
        <p className="font-ui text-sm text-gray-400 mb-6">{today.replaceAll('-', '.')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 오늘의 기분 */}
          <div className="card-pastel p-5">
            <label className="block text-sm text-lavender-400 mb-3 font-ui font-bold">오늘의 기분은?</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button key={mood.emoji} type="button" onClick={() => setForm({ ...form, mood: mood.emoji })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                    form.mood === mood.emoji ? 'bg-lavender-100 scale-110 shadow-md' : 'bg-white border border-lavender-100 hover:bg-lavender-50'
                  }`}>
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-gray-400">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 속상했던 일 */}
          <div className="card-pastel p-5">
            <label className="block text-sm mb-2 font-ui font-bold" style={{ color: '#e8687e' }}>
              😢 속상하거나 우울했던 일
            </label>
            <textarea
              className="input-pastel min-h-[100px] resize-y"
              placeholder="오늘 마음이 무거웠던 일이 있었나요? (없으면 비워도 돼요)"
              value={form.sadContent}
              onChange={(e) => setForm({ ...form, sadContent: e.target.value })}
            />
          </div>

          {/* 특별했던 일 */}
          <div className="card-pastel p-5">
            <label className="block text-sm mb-2 font-ui font-bold" style={{ color: '#8ec2ff' }}>
              ✨ 오늘 특별했던 일
            </label>
            <textarea
              className="input-pastel min-h-[100px] resize-y"
              placeholder="오늘 기억에 남는 특별한 순간이 있었나요? (없으면 비워도 돼요)"
              value={form.specialContent}
              onChange={(e) => setForm({ ...form, specialContent: e.target.value })}
            />
          </div>

          {/* 행복했던 일 */}
          <div className="card-pastel p-5">
            <label className="block text-sm mb-2 font-ui font-bold" style={{ color: '#f48da0' }}>
              🌸 오늘 행복했던 일
            </label>
            <textarea
              className="input-pastel min-h-[100px] resize-y"
              placeholder="오늘 기분 좋았던 일을 적어보세요 (없으면 비워도 돼요)"
              value={form.happyContent}
              onChange={(e) => setForm({ ...form, happyContent: e.target.value })}
            />
          </div>

          {/* 기타 */}
          <div className="card-pastel p-5">
            <label className="block text-sm text-gray-400 mb-2 font-ui font-bold">
              📝 기타
            </label>
            <textarea
              className="input-pastel min-h-[100px] resize-y"
              placeholder="그 밖에 하고 싶은 말을 자유롭게 적어보세요"
              value={form.etcContent}
              onChange={(e) => setForm({ ...form, etcContent: e.target.value })}
            />
          </div>

          {/* 공유 설정 */}
          <div className="card-pastel p-4 flex items-center gap-3">
            <button type="button" onClick={() => setForm({ ...form, isShared: !form.isShared })}
              className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${form.isShared ? 'bg-lavender-300' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.isShared ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-gray-500 font-ui">
              {form.isShared ? '💑 상대방과 공유' : '🔒 나만 보기'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
            <button type="submit" className="btn-primary" disabled={!form.mood}>
              {!form.mood ? '기분을 선택해주세요' : '저장하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
