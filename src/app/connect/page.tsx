'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { coupleApi } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'

export default function ConnectPage() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [inviteCode, setInviteCode] = useState('')
  const [myCode, setMyCode] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) return
    loadStatus()
  }, [isLoggedIn])

  const loadStatus = async () => {
    const email = localStorage.getItem('userEmail') || ''
    try {
      const status = await coupleApi.getStatus(email)
      if (status.connected) {
        setIsConnected(true)
        setMyCode(status.inviteCode)
        const partner = status.ownerEmail === email ? status.partnerEmail || '' : status.ownerEmail
        setPartnerEmail(partner)
      } else if (status.inviteCode) {
        setMyCode(status.inviteCode)
      }
    } catch {
      // 아직 코드 없음
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    const email = localStorage.getItem('userEmail') || ''
    try {
      const data = await coupleApi.generateCode(email)
      setMyCode(data.inviteCode)
    } catch {
      alert('코드 생성에 실패했습니다.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(myCode)
    alert('초대 코드가 복사되었어요!')
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setConnecting(true)
    const email = localStorage.getItem('userEmail') || ''
    try {
      const data = await coupleApi.connect(inviteCode, email)
      setIsConnected(true)
      const partner = data.ownerEmail === email ? data.partnerEmail || '' : data.ownerEmail
      setPartnerEmail(partner)
      localStorage.setItem('partnerEmail', partner)
    } catch {
      setError('유효하지 않은 초대 코드이거나 이미 연결된 코드입니다.')
    } finally {
      setConnecting(false)
    }
  }

  if (authLoading || loading) {
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
            <p className="text-sm text-gray-400 mb-4">
              <span className="text-pink-400">{localStorage.getItem('userEmail')}</span>
              {' ♥ '}
              <span className="text-lavender-400">{partnerEmail}</span>
            </p>
            <button onClick={() => router.push('/')} className="btn-primary">
              홈으로 가기
            </button>
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

          {/* 내 초대 코드 */}
          <div className="mb-8">
            <p className="text-sm text-lavender-400 mb-2 ml-1">나의 초대 코드</p>
            {myCode ? (
              <>
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
              </>
            ) : (
              <button onClick={handleGenerate} className="btn-secondary w-full">
                초대 코드 생성하기
              </button>
            )}
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
            {error && (
              <p className="text-xs text-red-400 mb-3 ml-1">{error}</p>
            )}
            <button type="submit" className="btn-primary" disabled={connecting}>
              {connecting ? '연결 중...' : '연결하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
