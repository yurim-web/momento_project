'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { postApi, PostData } from '@/lib/api'

const categories = ['전체', '데이트', '여행', '기념일', '일상', '맛집']

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = selectedCategory === '전체'
        ? await postApi.getAll()
        : await postApi.getAll(selectedCategory)
      setPosts(data)
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-handwriting text-3xl text-gray-600">우리의 이야기</h1>
          <Link href="/posts/new" className="btn-primary !w-auto px-5 py-2 text-sm font-ui">
            글쓰기
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-ui whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-300 text-white'
                  : 'bg-white text-gray-400 border border-pink-100 hover:border-pink-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8 font-ui">불러오는 중...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">✏️</p>
            <p className="text-gray-400">아직 이야기가 없어요</p>
            <Link href="/posts/new" className="text-sm text-pink-400 hover:text-pink-500 mt-2 inline-block">
              첫 번째 이야기를 작성해보세요
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="block">
                <article className="card-pastel p-5 hover:scale-[1.01] transition-transform">
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-400">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-600 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{post.content}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-lavender-400">by {post.authorName}</span>
                    {post.location && (
                      <span className="text-xs text-mint-400">📍 {post.location}</span>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
