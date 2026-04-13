'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { diaryApi, DiaryData } from '@/lib/api'

export default function DiaryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const diaryId = Number(params.id)
  const [diary, setDiary] = useState<DiaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDiary()
  }, [diaryId])

  const loadDiary = async () => {
    try {
      const data = await diaryApi.getById(diaryId)
      setDiary(data)
    } catch {
      console.error('일기를 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제할까요?')) return
    try {
      await diaryApi.delete(diaryId)
      router.push('/diary')
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'))
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  if (loading) return <div className="min-h-screen bg-cream-50"><Navbar /><p className="text-center py-12 text-gray-400">불러오는 중...</p></div>
  if (!diary) return <div className="min-h-screen bg-cream-50"><Navbar /><p className="text-center py-12 text-gray-400">일기를 찾을 수 없습니다.</p></div>

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <Link href="/diary" className="inline-block text-sm text-lavender-400 hover:text-lavender-500 mb-4">
          ← 일기장으로
        </Link>

        <article className="card-pastel p-6 md:p-8">
          <div className="text-center mb-6">
            <span className="text-5xl block mb-3">{diary.mood}</span>
            <p className="text-sm text-gray-400">{formatDate(diary.diaryDate)}</p>
          </div>

          <h1 className="font-handwriting text-3xl text-gray-600 text-center mb-6">{diary.title}</h1>

          <div className="bg-cream-50 rounded-2xl p-6">
            {diary.content.split('\n').map((line, i) => (
              <p key={i} className="text-gray-600 leading-loose mb-2">
                {line || <br />}
              </p>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-lavender-400">by {diary.authorName}</span>
            <span className="text-gray-400">
              {diary.isShared ? '💑 공유됨' : '🔒 나만 보기'}
            </span>
          </div>

          <div className="mt-6 pt-4 border-t border-pink-100 flex gap-3">
            <button className="btn-secondary text-sm">수정하기</button>
            <button onClick={handleDelete} className="btn-secondary text-sm text-red-300 border-red-100 hover:bg-red-50 hover:border-red-200">
              삭제하기
            </button>
          </div>
        </article>
      </main>
    </div>
  )
}
