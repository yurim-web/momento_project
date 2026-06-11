'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface DiaryEntry {
  id: number
  mood: string
  sadContent: string
  specialContent: string
  happyContent: string
  etcContent: string
  diaryDate: string
  isShared: boolean
  authorEmail: string
  authorName: string
  createdAt: string
}

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

export default function EditDiaryPage() {
  const params = useParams()
  const router = useRouter()
  const diaryId = Number(params.id)
  const [form, setForm] = useState({
    mood: '',
    sadContent: '',
    specialContent: '',
    happyContent: '',
    etcContent: '',
    isShared: true,
  })

  useEffect(() => {
    const diaries: DiaryEntry[] = JSON.parse(localStorage.getItem('momento_diaries') || '[]')
    const diary = diaries.find(d => d.id === diaryId)
    if (!diary) { router.back(); return }
    setForm({
      mood: diary.mood,
      sadContent: diary.sadContent || '',
      specialContent: diary.specialContent || '',
      happyContent: diary.happyContent || '',
      etcContent: diary.etcContent || '',
      isShared: diary.isShared,
    })
  }, [diaryId, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const diaries: DiaryEntry[] = JSON.parse(localStorage.getItem('momento_diaries') || '[]')
    const updated = diaries.map(d =>
      d.id === diaryId ? { ...d, ...form } : d
    )
    localStorage.setItem('momento_diaries', JSON.stringify(updated))
    router.push(`/diary/${diaryId}`)
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">일기 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

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

          <div className="card-pastel p-5">
            <label className="block text-sm mb-2 font-ui font-bold" style={{ color: '#e8687e' }}>😢 속상하거나 우울했던 일</label>
            <textarea className="input-pastel min-h-[100px] resize-y" placeholder="없으면 비워도 돼요" value={form.sadContent} onChange={(e) => setForm({ ...form, sadContent: e.target.value })} />
          </div>

          <div className="card-pastel p-5">
            <label className="block text-sm mb-2 font-ui font-bold" style={{ color: '#8ec2ff' }}>✨ 오늘 특별했던 일</label>
            <textarea className="input-pastel min-h-[100px] resize-y" placeholder="없으면 비워도 돼요" value={form.specialContent} onChange={(e) => setForm({ ...form, specialContent: e.target.value })} />
          </div>

          <div className="card-pastel p-5">
            <label className="block text-sm mb-2 font-ui font-bold" style={{ color: '#f48da0' }}>🌸 오늘 행복했던 일</label>
            <textarea className="input-pastel min-h-[100px] resize-y" placeholder="없으면 비워도 돼요" value={form.happyContent} onChange={(e) => setForm({ ...form, happyContent: e.target.value })} />
          </div>

          <div className="card-pastel p-5">
            <label className="block text-sm text-gray-400 mb-2 font-ui font-bold">📝 기타</label>
            <textarea className="input-pastel min-h-[100px] resize-y" placeholder="자유롭게 적어보세요" value={form.etcContent} onChange={(e) => setForm({ ...form, etcContent: e.target.value })} />
          </div>

          <div className="card-pastel p-4 flex items-center gap-3">
            <button type="button" onClick={() => setForm({ ...form, isShared: !form.isShared })}
              className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${form.isShared ? 'bg-lavender-300' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.isShared ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className="text-sm text-gray-500 font-ui">{form.isShared ? '💑 상대방과 공유' : '🔒 나만 보기'}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
            <button type="submit" className="btn-primary">수정하기</button>
          </div>
        </form>
      </main>
    </div>
  )
}
