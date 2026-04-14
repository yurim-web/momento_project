'use client'

import Navbar from '@/components/Navbar'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { diaryApi } from '@/lib/api'
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
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    mood: '',
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isShared: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const email = localStorage.getItem('userEmail') || ''
      const name = localStorage.getItem('userName') || ''
      await diaryApi.create({
        title: form.title,
        content: form.content,
        mood: form.mood,
        diaryDate: form.date,
        isShared: form.isShared,
        authorEmail: email,
        authorName: name,
      })
      router.push('/diary')
    } catch {
      alert('일기 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !isLoggedIn) {
    return <div className="min-h-screen bg-cream-50"><Navbar /><p className="text-center py-12 text-gray-400">로딩 중...</p></div>
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">오늘의 일기</h1>

        <form onSubmit={handleSubmit} className="card-pastel p-6 space-y-5">
          <div>
            <label className="block text-sm text-lavender-400 mb-3 ml-1">오늘의 기분은?</label>
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

          <div>
            <label className="block text-sm text-lavender-400 mb-1.5 ml-1">날짜</label>
            <input type="date" className="input-pastel" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm text-lavender-400 mb-1.5 ml-1">제목</label>
            <input type="text" className="input-pastel" placeholder="오늘 하루를 한 줄로" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm text-lavender-400 mb-1.5 ml-1">일기</label>
            <textarea className="input-pastel min-h-[250px] resize-y" placeholder="오늘 하루는 어땠나요?" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>

          <div className="flex items-center gap-3 p-3 bg-lavender-50 rounded-xl">
            <button type="button" onClick={() => setForm({ ...form, isShared: !form.isShared })}
              className={`w-12 h-6 rounded-full transition-all relative ${form.isShared ? 'bg-lavender-300' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.isShared ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-gray-500">
              {form.isShared ? '💑 상대방과 공유' : '🔒 나만 보기'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
