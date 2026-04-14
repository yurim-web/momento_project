'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userApi } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await userApi.login({ email, password })
      if (res.status === 'success') {
        localStorage.setItem('userEmail', email)
        localStorage.setItem('userName', email.split('@')[0])
        router.push('/')
      } else {
        setError(res.message)
      }
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream-50">
      {/* 배경 장식 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-lavender-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-mint-100 rounded-full blur-3xl opacity-40" />

      <div className="w-full max-w-md relative">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="font-handwriting text-5xl text-pink-400 mb-2">Momento</h1>
          <p className="font-handwriting text-lg text-pink-300">우리의 특별한 순간들</p>
        </div>

        {/* 로그인 카드 */}
        <div className="card-pastel p-8">
          <h2 className="font-handwriting text-2xl text-center text-gray-600 mb-6">
            다시 만나서 반가워요 ♡
          </h2>

          {error && (
            <div className="font-ui mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">이메일</label>
              <input
                type="email"
                className="input-pastel"
                placeholder="hello@momento.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">비밀번호</label>
              <input
                type="password"
                className="input-pastel"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="font-ui text-sm text-gray-400">
              아직 계정이 없나요?{' '}
              <Link href="/signup" className="text-pink-400 hover:text-pink-500 font-bold">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 장식 → 가이드 링크 */}
        <Link href="/guide" className="block text-center mt-6 font-handwriting text-lg text-lavender-300 hover:text-lavender-400 transition-colors">
          둘만의 이야기를 시작해요 →
        </Link>
      </div>
    </div>
  )
}
