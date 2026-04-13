'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  // TODO: 실제 데이터 연동
  const coupleData = {
    person1: '나',
    person2: '당신',
    startDate: '2024-01-15',
    todayMessage: '오늘도 사랑해 ♡',
  }

  const getDDay = () => {
    const start = new Date(coupleData.startDate)
    const today = new Date()
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const recentPosts = [
    { id: 1, title: '첫 번째 데이트 이야기', date: '2024.03.15', category: '데이트', author: '나' },
    { id: 2, title: '벚꽃 구경 다녀왔어요', date: '2024.04.02', category: '일상', author: '당신' },
    { id: 3, title: '100일 기념 여행', date: '2024.04.24', category: '여행', author: '나' },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* D+Day 섹션 */}
        <section className="card-pastel p-8 text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="font-handwriting text-xl text-pink-400">{coupleData.person1}</span>
            </div>
            <span className="font-handwriting text-3xl text-pink-300">♥</span>
            <div className="w-16 h-16 rounded-full bg-lavender-100 flex items-center justify-center">
              <span className="font-handwriting text-xl text-lavender-400">{coupleData.person2}</span>
            </div>
          </div>
          <p className="font-handwriting text-4xl text-pink-400 mb-1">
            D+{getDDay()}
          </p>
          <p className="text-sm text-gray-400">{coupleData.startDate} ~</p>
        </section>

        {/* 오늘의 한마디 */}
        <section className="card-pastel p-6 mb-8 bg-gradient-to-r from-pink-50 to-lavender-50">
          <p className="text-xs text-lavender-400 mb-2">오늘의 한마디</p>
          <p className="font-handwriting text-xl text-gray-600 text-center">
            &ldquo;{coupleData.todayMessage}&rdquo;
          </p>
        </section>

        {/* 빠른 메뉴 */}
        <section className="grid grid-cols-4 gap-3 mb-8">
          {[
            { href: '/posts/new', icon: '✏️', label: '글쓰기' },
            { href: '/diary/write', icon: '📖', label: '일기' },
            { href: '/calendar', icon: '📅', label: '캘린더' },
            { href: '/anniversary', icon: '💝', label: '기념일' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-pastel p-4 text-center hover:scale-105 transition-transform"
            >
              <span className="text-2xl block mb-1">{item.icon}</span>
              <span className="text-xs text-gray-500">{item.label}</span>
            </Link>
          ))}
        </section>

        {/* 최근 게시글 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-handwriting text-2xl text-gray-600">최근 이야기</h2>
            <Link href="/posts" className="text-sm text-pink-400 hover:text-pink-500">
              전체보기
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="block">
                <div className="card-pastel p-4 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-400 mr-2">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-600">{post.title}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{post.date}</p>
                      <p className="text-xs text-lavender-400">{post.author}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
