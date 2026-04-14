'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [startDate, setStartDate] = useState('2024-01-15')
  const [todayMessage, setTodayMessage] = useState('오늘도 사랑해 ♡')
  const [editingMessage, setEditingMessage] = useState(false)
  const [person1, setPerson1] = useState({ name: '나', email: '' })
  const [person2, setPerson2] = useState({ name: '당신', email: '' })
  const [toast, setToast] = useState<string | null>(null)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false)
  const [notifSettings, setNotifSettings] = useState({
    anniversary: true,
    schedule: true,
    diary: false,
  })

  useEffect(() => {
    const savedStartDate = localStorage.getItem('coupleStartDate')
    const savedMessage = localStorage.getItem('todayMessage')
    const userEmail = localStorage.getItem('userEmail') || ''
    const userName = localStorage.getItem('userName') || '나'
    const partnerName = localStorage.getItem('partnerName') || '당신'
    const partnerEmail = localStorage.getItem('partnerEmail') || ''
    const savedNotif = localStorage.getItem('notifSettings')

    if (savedStartDate) setStartDate(savedStartDate)
    if (savedMessage) setTodayMessage(savedMessage)
    if (savedNotif) setNotifSettings(JSON.parse(savedNotif))
    setPerson1({ name: userName, email: userEmail })
    setPerson2({ name: partnerName, email: partnerEmail })
  }, [])

  const getDDay = () => {
    const start = new Date(startDate)
    const today = new Date()
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleSaveDate = () => {
    localStorage.setItem('coupleStartDate', startDate)
    setIsEditing(false)
  }

  const handleSaveMessage = () => {
    localStorage.setItem('todayMessage', todayMessage)
    setEditingMessage(false)
  }

  const handleLogout = () => {
    if (!confirm('로그아웃 하시겠어요?')) return
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    router.push('/login')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleSaveNotif = () => {
    localStorage.setItem('notifSettings', JSON.stringify(notifSettings))
    setShowNotifModal(false)
    showToast('알림 설정이 저장되었어요')
  }

  const handleExportData = () => {
    const data = {
      profile: { person1, person2, startDate, todayMessage },
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `momento-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('데이터가 다운로드되었어요')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">프로필</h1>

        {/* 커플 프로필 카드 */}
        <div className="card-pastel p-8 text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200">
                <span className="font-handwriting text-2xl text-pink-400">
                  {person1.name[0]}
                </span>
              </div>
              <span className="font-ui text-sm text-gray-600 font-bold">{person1.name}</span>
              <span className="font-ui text-xs text-gray-400">{person1.email}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl">♥</span>
              <span className="font-handwriting text-xl text-pink-400 mt-1">D+{getDDay()}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-lavender-100 flex items-center justify-center border-2 border-lavender-200">
                <span className="font-handwriting text-2xl text-lavender-400">
                  {person2.name[0]}
                </span>
              </div>
              <span className="font-ui text-sm text-gray-600 font-bold">{person2.name}</span>
              <span className="font-ui text-xs text-gray-400">{person2.email}</span>
            </div>
          </div>

          {/* 사귄 날짜 */}
          <div className="bg-cream-50 rounded-2xl p-4 mb-4">
            <p className="font-ui text-xs text-gray-400 mb-1">사귄 날</p>
            {isEditing ? (
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="date"
                  className="input-pastel !w-auto"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <button onClick={handleSaveDate} className="font-ui text-sm text-pink-400 hover:text-pink-500">
                  저장
                </button>
                <button onClick={() => setIsEditing(false)} className="font-ui text-sm text-gray-400">
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="font-ui text-sm text-gray-600 hover:text-pink-400 transition-colors"
              >
                {startDate} ✎
              </button>
            )}
          </div>

          {/* 오늘의 한마디 */}
          <div className="bg-gradient-to-r from-pink-50 to-lavender-50 rounded-2xl p-4">
            <p className="font-ui text-xs text-lavender-400 mb-1">오늘의 한마디</p>
            {editingMessage ? (
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="text"
                  className="input-pastel !w-auto text-center"
                  value={todayMessage}
                  onChange={(e) => setTodayMessage(e.target.value)}
                  placeholder="한마디를 남겨주세요"
                />
                <button onClick={handleSaveMessage} className="font-ui text-sm text-pink-400 hover:text-pink-500">
                  저장
                </button>
                <button onClick={() => setEditingMessage(false)} className="font-ui text-sm text-gray-400">
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingMessage(true)}
                className="font-handwriting text-lg text-gray-600 hover:text-pink-400 transition-colors"
              >
                &ldquo;{todayMessage}&rdquo; ✎
              </button>
            )}
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="card-pastel divide-y divide-pink-50">
          <button
            onClick={() => setShowNotifModal(true)}
            className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors text-left"
          >
            <span className="text-xl">🔔</span>
            <div>
              <p className="font-ui text-sm text-gray-600">알림 설정</p>
              <p className="font-ui text-xs text-gray-400">기념일, 일정 알림</p>
            </div>
          </button>
          <button
            onClick={() => setShowThemeModal(true)}
            className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors text-left"
          >
            <span className="text-xl">🎨</span>
            <div>
              <p className="font-ui text-sm text-gray-600">테마 변경</p>
              <p className="font-ui text-xs text-gray-400">색상 테마 선택</p>
            </div>
          </button>
          <button
            onClick={handleExportData}
            className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors text-left"
          >
            <span className="text-xl">💾</span>
            <div>
              <p className="font-ui text-sm text-gray-600">데이터 내보내기</p>
              <p className="font-ui text-xs text-gray-400">일기, 게시글 백업</p>
            </div>
          </button>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="font-ui w-full mt-4 p-3 text-center text-sm text-red-300 hover:text-red-400 transition-colors"
        >
          로그아웃
        </button>
      </main>

      {/* 알림 설정 모달 */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setShowNotifModal(false)}>
          <div className="card-pastel p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-4">알림 설정</h3>
            <div className="space-y-3">
              {([
                { key: 'anniversary' as const, label: '기념일 알림', desc: 'D-day 알림' },
                { key: 'schedule' as const, label: '일정 알림', desc: '캘린더 일정 알림' },
                { key: 'diary' as const, label: '일기 알림', desc: '매일 일기 쓰기 리마인더' },
              ]).map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                  <div>
                    <p className="font-ui text-sm text-gray-600">{item.label}</p>
                    <p className="font-ui text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifSettings({ ...notifSettings, [item.key]: !notifSettings[item.key] })}
                    className={`w-12 h-6 rounded-full transition-all relative ${notifSettings[item.key] ? 'bg-pink-300' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifSettings[item.key] ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNotifModal(false)} className="btn-secondary">취소</button>
              <button onClick={handleSaveNotif} className="btn-primary">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 테마 변경 모달 */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setShowThemeModal(false)}>
          <div className="card-pastel p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-4">테마 변경</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: '벚꽃', colors: ['#f8b4c0', '#fbd5dc', '#fef7f7'], active: true },
                { name: '라벤더', colors: ['#b8a9d4', '#d4c8e8', '#f0ecf7'], active: false },
                { name: '민트', colors: ['#8ecfc0', '#b8e0d5', '#ecf7f3'], active: false },
                { name: '피치', colors: ['#f5c0a0', '#f8d8c0', '#fef3eb'], active: false },
                { name: '하늘', colors: ['#8ec2ff', '#b8d8ff', '#ecf3ff'], active: false },
                { name: '레몬', colors: ['#f5e6a0', '#f8edc0', '#fefaeb'], active: false },
              ].map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => { setShowThemeModal(false); showToast(theme.active ? '현재 적용 중인 테마예요' : `${theme.name} 테마는 준비 중이에요`) }}
                  className={`p-3 rounded-2xl border-2 transition-all ${theme.active ? 'border-pink-300 bg-pink-50' : 'border-gray-100 hover:border-pink-200'}`}
                >
                  <div className="flex gap-1 mb-2 justify-center">
                    {theme.colors.map((c, i) => (
                      <span key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <p className="font-ui text-xs text-gray-500">{theme.name}</p>
                  {theme.active && <p className="font-ui text-xs text-pink-400 mt-0.5">적용 중</p>}
                </button>
              ))}
            </div>
            <button onClick={() => setShowThemeModal(false)} className="btn-secondary mt-4">닫기</button>
          </div>
        </div>
      )}

      {/* 토스트 메시지 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-700 text-white text-sm px-5 py-2.5 rounded-full shadow-lg font-ui animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}
