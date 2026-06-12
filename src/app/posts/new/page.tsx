'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

const DEFAULT_CATEGORIES = ['데이트', '여행', '기념일', '일상', '맛집']

export default function NewPostPage() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)

  useEffect(() => {
    const custom: string[] = JSON.parse(localStorage.getItem('momento_custom_categories') || '[]')
    setCategories([...DEFAULT_CATEGORIES, ...custom])
  }, [])
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const email = localStorage.getItem('userEmail') || ''
    const name = localStorage.getItem('userName') || ''
    const posts = JSON.parse(localStorage.getItem('momento_posts') || '[]')
    const newPost = {
      id: Date.now(),
      title: form.title,
      content: form.content,
      category: form.category,
      location: form.location || undefined,
      eventDate: form.date,
      authorEmail: email,
      authorName: name,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('momento_posts', JSON.stringify([newPost, ...posts]))
    router.push('/posts')
  }

  if (authLoading) {
    return <div className="min-h-screen bg-cream-50"><Navbar /><p className="text-center py-12 text-gray-400 font-ui">로딩 중...</p></div>
  }
  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">새로운 이야기</h1>

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
            <input type="text" className="input-pastel" placeholder="오늘의 이야기 제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">날짜</label>
              <input type="date" className="input-pastel" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">장소</label>
              <input type="text" className="input-pastel" placeholder="어디서?" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-pink-400 mb-1.5 ml-1">내용</label>
            <textarea className="input-pastel min-h-[200px] resize-y" placeholder="우리의 이야기를 적어주세요..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
            <button type="submit" className="btn-primary">작성하기</button>
          </div>
        </form>
      </main>
    </div>
  )
}
