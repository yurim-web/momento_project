'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import Modal from '@/components/Modal'

function generateCode() {
  return 'MOMENTO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function ConnectPage() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [inviteCode, setInviteCode] = useState('')
  const [myCode, setMyCode] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState('')
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) return
    const savedCode = localStorage.getItem('myInviteCode') || ''
    const connected = localStorage.getItem('coupleConnected') === 'true'
    const partner = localStorage.getItem('partnerEmail') || ''
    setMyCode(savedCode)
    setIsConnected(connected)
    setPartnerEmail(partner)
  }, [isLoggedIn])

  const handleGenerate = () => {
    const code = generateCode()
    setMyCode(code)
    localStorage.setItem('myInviteCode', code)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(myCode)
    setShowCopied(true)
  }

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setConnecting(true)

    if (inviteCode.length < 6) {
      setError('올바른 초대 코드를 입력해주세요.')
      setConnecting(false)
      return
    }

    // 상대방 코드를 파트너 이메일로 저장하고 연결 처리
    const partner = inviteCode
    localStorage.setItem('partnerEmail', partner)
    localStorage.setItem('coupleConnected', 'true')
    setPartnerEmail(partner)
    setIsConnected(true)
    setConnecting(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-cream-50">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-lavender-100 rounded-full blur-3xl opacity-60" />

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <h1 className="font-handwriting text-5xl text-pink-400 mb-2">Momento</h1>
          </div>
          <div className="card-pastel p-8 text-center">
            <span className="text-5xl block mb-4">💑</span>
            <h2 className="font-handwriting text-2xl text-gray-600 mb-2">연결 완료!</h2>
            <p className="text-sm text-gray-400 mb-6">
              <span className="text-pink-400">{localStorage.getItem('userEmail')}</span>
              {' ♥ '}
              <span className="text-lavender-400">{partnerEmail}</span>
            </p>
            <button onClick={() => router.push('/')} className="btn-primary">홈으로 가기</button>
          </div>
        </div>
      </div>
    )
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

          <div className="mb-8">
            <p className="text-sm text-lavender-400 mb-2 ml-1">나의 초대 코드</p>
            {myCode ? (
              <>
                <div className="flex gap-2">
                  <div className="flex-1 bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-3 text-center font-mono text-lavender-500 tracking-wider">
                    {myCode}
                  </div>
                  <button onClick={handleCopy} className="px-4 bg-lavender-100 text-lavender-500 rounded-xl hover:bg-lavender-200 transition-colors text-sm">
                    복사
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">이 코드를 상대방에게 보내주세요</p>
              </>
            ) : (
              <button onClick={handleGenerate} className="btn-secondary w-full">
                초대 코드 생성하기
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-pink-100" />
            <span className="text-sm text-pink-300">또는</span>
            <div className="flex-1 h-px bg-pink-100" />
          </div>

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
            {error && <p className="text-xs text-red-400 mb-3 ml-1">{error}</p>}
            <button type="submit" className="btn-primary" disabled={connecting}>
              {connecting ? '연결 중...' : '연결하기'}
            </button>
          </form>
        </div>
      </div>

      {showCopied && (
        <Modal
          type="alert"
          title="복사 완료! 📋"
          message="초대 코드를 상대방에게 보내주세요"
          confirmText="확인"
          onConfirm={() => setShowCopied(false)}
        />
      )}
    </div>
  )
}
