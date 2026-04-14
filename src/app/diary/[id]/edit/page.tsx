'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { diaryApi } from '@/lib/api'

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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    mood: '',
    title: '',
    content: '',
    date: '',
    isShared: true,
  })

  useEffect(() => {
    const loadDiary = async () => {
      try {
        const diary = await diaryApi.getById(diaryId)
        setForm({
          mood: diary.mood,
          title: diary.title,
          content: diary.content,
          date: diary.diaryDate,
          isShared: diary.isShared,
        })
      } catch {
        alert('일기를 불러올 수 없습니다.')
        router.back()
      } finally {
        setLoading(false)
      }
    }
    loadDiary()
  }, [diaryId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await diaryApi.update(diaryId, {
        title: form.title,
        content: form.content,
        mood: form.mood,
        diaryDate: form.date,
        isShared: form.isShared,
      })
      router.push(`/diary/${diaryId}`)
    } catch {
      alert('수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <p className="text-center py-12 text-gray-400">불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">일기 수정</h1>

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
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
