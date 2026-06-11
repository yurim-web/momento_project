'use client'

import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import Link from 'next/link'
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

export default function DiaryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const diaryId = Number(params.id)
  const [diary, setDiary] = useState<DiaryEntry | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const diaries: DiaryEntry[] = JSON.parse(localStorage.getItem('momento_diaries') || '[]')
    setDiary(diaries.find(d => d.id === diaryId) || null)
  }, [diaryId])

  const handleDelete = () => {
    const diaries: DiaryEntry[] = JSON.parse(localStorage.getItem('momento_diaries') || '[]')
    localStorage.setItem('momento_diaries', JSON.stringify(diaries.filter(d => d.id !== diaryId)))
    router.push('/diary')
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'))
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  if (!diary) return <div className="min-h-screen bg-cream-50"><Navbar /><p className="text-center py-12 text-gray-400">일기를 찾을 수 없습니다.</p></div>

  const sections = [
    { label: '😢 속상하거나 우울했던 일', content: diary.sadContent, color: '#e8687e' },
    { label: '✨ 오늘 특별했던 일', content: diary.specialContent, color: '#8ec2ff' },
    { label: '🌸 오늘 행복했던 일', content: diary.happyContent, color: '#f48da0' },
    { label: '📝 기타', content: diary.etcContent, color: '#a0a0a0' },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <Link href="/diary" className="inline-block text-sm text-lavender-400 hover:text-lavender-500 mb-4">
          ← 일기장으로
        </Link>

        <article className="space-y-4">
          {/* 헤더 */}
          <div className="card-pastel p-6 text-center">
            <span className="text-5xl block mb-3">{diary.mood}</span>
            <p className="font-handwriting text-2xl text-gray-600">{formatDate(diary.diaryDate)}</p>
            <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-400 font-ui">
              <span>by {diary.authorName}</span>
              <span>{diary.isShared ? '💑 공유됨' : '🔒 나만 보기'}</span>
            </div>
          </div>

          {/* 섹션들 */}
          {sections.map((section) => (
            section.content ? (
              <div key={section.label} className="card-pastel p-5">
                <p className="font-ui text-sm font-bold mb-3" style={{ color: section.color }}>
                  {section.label}
                </p>
                <div className="bg-cream-50 rounded-xl p-4">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className="font-ui text-gray-600 leading-loose text-sm">
                      {line || <br />}
                    </p>
                  ))}
                </div>
              </div>
            ) : null
          ))}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Link href={`/diary/${diary.id}/edit`} className="btn-secondary text-sm text-center">수정하기</Link>
            <button onClick={() => setShowDeleteModal(true)} className="btn-secondary text-sm text-red-300 border-red-100 hover:bg-red-50 hover:border-red-200">
              삭제하기
            </button>
          </div>
        </article>
      </main>

      {showDeleteModal && (
        <Modal
          type="confirm"
          title="일기를 삭제할까요?"
          message="삭제하면 되돌릴 수 없어요"
          confirmText="삭제하기"
          cancelText="취소"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}
