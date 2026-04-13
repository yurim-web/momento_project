'use client'

import { useState } from 'react'

export default function ConnectPage() {
  const [inviteCode, setInviteCode] = useState('')
  const myCode = 'MOMENTO-A1B2C3' // TODO: 서버에서 생성

  const handleCopy = () => {
    navigator.clipboard.writeText(myCode)
    alert('초대 코드가 복사되었어요!')
  }

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 연동
    console.log('connect with code:', inviteCode)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream-50">
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-lavender-100 rounded-full blur-3xl opacity-60" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="font-handwriting text-5xl text-pink-400 mb-2">Momento</h1>
          <p className="text-sm text-pink-300">상대방과 연결해요</p>
        </div>

        <div className="card-pastel p-8">
          <h2 className="font-handwriting text-2xl text-center text-gray-600 mb-6">
            커플 연결하기 ♡
          </h2>

          {/* 내 초대 코드 */}
          <div className="mb-8">
            <p className="text-sm text-lavender-400 mb-2 ml-1">나의 초대 코드</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-3 text-center font-mono text-lavender-500 tracking-wider">
                {myCode}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 bg-lavender-100 text-lavender-500 rounded-xl hover:bg-lavender-200 transition-colors text-sm"
              >
                복사
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">
              이 코드를 상대방에게 보내주세요
            </p>
          </div>

          {/* 구분선 */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-pink-100" />
            <span className="text-sm text-pink-300">또는</span>
            <div className="flex-1 h-px bg-pink-100" />
          </div>

          {/* 상대방 코드 입력 */}
          <form onSubmit={handleConnect}>
            <p className="text-sm text-pink-400 mb-2 ml-1">상대방의 초대 코드</p>
            <input
              type="text"
              className="input-pastel mb-3 text-center tracking-wider"
              placeholder="MOMENTO-XXXXXX"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
            />
            <button type="submit" className="btn-primary">
              연결하기
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
