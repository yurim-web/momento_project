'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않아요!')
      return
    }

    setLoading(true)

    const users = JSON.parse(localStorage.getItem('momento_users') || '[]')
    const exists = users.some((u: { email: string }) => u.email === form.email)

    if (exists) {
      setError('이미 사용 중인 이메일이에요.')
      setLoading(false)
      return
    }

    users.push({ email: form.email, password: form.password, name: form.name, phone: form.phone })
    localStorage.setItem('momento_users', JSON.stringify(users))
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-cream-50">
      <div className="absolute top-10 right-16 w-36 h-36 bg-lavender-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-10 left-16 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/2 left-10 w-28 h-28 bg-mint-100 rounded-full blur-3xl opacity-40" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="font-handwriting text-5xl text-pink-400 mb-2">Momento</h1>
          <p className="font-handwriting text-lg text-pink-300">우리의 특별한 순간들</p>
        </div>

        <div className="card-pastel p-8">
          <h2 className="font-handwriting text-2xl text-center text-gray-600 mb-6">
            새로운 이야기를 시작해요 ✿
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">이름</label>
              <input
                type="text"
                name="name"
                className="input-pastel"
                placeholder="이름을 알려주세요"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">이메일</label>
              <input
                type="email"
                name="email"
                className="input-pastel"
                placeholder="hello@momento.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">비밀번호</label>
              <input
                type="password"
                name="password"
                className="input-pastel"
                placeholder="비밀번호를 만들어주세요"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                className="input-pastel"
                placeholder="한 번 더 입력해주세요"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">전화번호</label>
              <input
                type="tel"
                name="phone"
                className="input-pastel"
                placeholder="010-0000-0000"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '가입 중...' : '가입하기'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              이미 계정이 있나요?{' '}
              <Link href="/login" className="text-pink-400 hover:text-pink-500 font-bold">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <Modal
          type="alert"
          title="가입 완료! 🎉"
          message="로그인해서 우리의 이야기를 시작해요"
          confirmText="로그인하러 가기"
          onConfirm={() => router.push('/login')}
        />
      )}
    </div>
  )
}
