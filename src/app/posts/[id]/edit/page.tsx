'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostData } from '@/lib/api'

const categories = ['데이트', '여행', '기념일', '일상', '맛집']

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.id)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    date: '',
    location: '',
  })

  useEffect(() => {
    const posts: PostData[] = JSON.parse(localStorage.getItem('momento_posts') || '[]')
    const post = posts.find(p => p.id === postId)
    if (!post) { router.back(); return }
    setForm({ title: post.title, content: post.content, category: post.category, date: post.eventDate || '', location: post.location || '' })
  }, [postId, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const posts: PostData[] = JSON.parse(localStorage.getItem('momento_posts') || '[]')
    const updated = posts.map(p =>
      p.id === postId ? { ...p, title: form.title, content: form.content, category: form.category, location: form.location || undefined, eventDate: form.date } : p
    )
    localStorage.setItem('momento_posts', JSON.stringify(updated))
    setSaving(false)
    router.push(`/posts/${postId}`)
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">이야기 수정</h1>

        <form onSubmit={handleSubmit} className="card-pastel p-6 space-y-5">
          <div>
            <label className="block text-sm text-pink-400 mb-2 ml-1">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    form.category === cat
                      ? 'bg-pink-300 text-white'
                      : 'bg-pink-50 text-pink-300 border border-pink-100 hover:border-pink-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-pink-400 mb-1.5 ml-1">제목</label>
            <input type="text" className="input-pastel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">날짜</label>
              <input type="date" className="input-pastel" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">장소</label>
              <input type="text" className="input-pastel" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-pink-400 mb-1.5 ml-1">내용</label>
            <textarea className="input-pastel min-h-[200px] resize-y" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
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
