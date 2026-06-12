'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    birthday: '',
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

    users.push({
      email: form.email,
      password: form.password,
      name: form.name,
      nickname: form.nickname,
      phone: form.phone,
      birthday: form.birthday,
    })
    localStorage.setItem('momento_users', JSON.stringify(users))

    // 생일을 캘린더에 기념일로 저장
    if (form.birthday) {
      const calendar = JSON.parse(localStorage.getItem('momento_calendar') || '[]')
      const displayName = form.nickname || form.name
      calendar.push({
        id: Date.now(),
        date: form.birthday,
        title: `🎂 ${displayName}의 생일`,
        category: 'birthday',
      })
      localStorage.setItem('momento_calendar', JSON.stringify(calendar))
    }

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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-pink-400 mb-1.5 ml-1">이름</label>
                <input
                  type="text"
                  name="name"
                  className="input-pastel"
                  placeholder="실명"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-pink-400 mb-1.5 ml-1">
                  애칭 <span className="text-gray-300 text-xs">(선택)</span>
                </label>
                <input
                  type="text"
                  name="nickname"
                  className="input-pastel"
                  placeholder="별명"
                  value={form.nickname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-pink-400 mb-1.5 ml-1">
                생년월일 <span className="text-gray-300 text-xs">(선택 · 캘린더에 생일 등록)</span>
              </label>
              <input
                type="date"
                name="birthday"
                className="input-pastel"
                value={form.birthday}
                onChange={handleChange}
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

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-400">
              이미 계정이 있나요?{' '}
              <Link href="/login" className="text-pink-400 hover:text-pink-500 font-bold">
                로그인
              </Link>
            </p>
            <div className="border-t border-pink-50 pt-3">
              <Link
                href="/about"
                className="font-ui text-xs text-lavender-400 hover:text-lavender-500 transition-colors"
              >
                🌸 Momento가 처음이라면? 앱 소개 보기
              </Link>
            </div>
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
