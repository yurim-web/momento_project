'use client'

import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import Link from 'next/link'
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
  const [modal, setModal] = useState<{ title: string; message?: string; onConfirm: () => void } | null>(null)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('blossom')   // 저장된 테마
  const [previewTheme, setPreviewTheme] = useState('blossom')   // 미리보기 중인 테마
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPartnerName, setEditPartnerName] = useState('')
  const [notifSettings, setNotifSettings] = useState({
    anniversary: true,
    schedule: true,
    diary: false,
  })
  const [myPhoto, setMyPhoto] = useState<string | null>(null)
  const [partnerPhoto, setPartnerPhoto] = useState<string | null>(null)

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
    setCurrentTheme(localStorage.getItem('momento_theme') || 'blossom')
    setPerson1({ name: userName, email: userEmail })
    setPerson2({ name: partnerName, email: partnerEmail })
    setMyPhoto(localStorage.getItem('myProfilePhoto'))
    setPartnerPhoto(localStorage.getItem('partnerProfilePhoto'))
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
    setModal({
      title: '로그아웃 할까요?',
      message: '다음에 또 만나요 👋',
      onConfirm: () => {
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        router.push('/login')
      },
    })
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

  const openProfileModal = () => {
    setEditName(person1.name)
    setEditPartnerName(person2.name)
    setShowProfileModal(true)
  }

  const handleSaveProfile = () => {
    localStorage.setItem('userName', editName)
    localStorage.setItem('partnerName', editPartnerName)
    setPerson1({ ...person1, name: editName })
    setPerson2({ ...person2, name: editPartnerName })
    setShowProfileModal(false)
    showToast('별명이 변경되었어요')
  }

  const handlePhotoChange = (who: 'me' | 'partner', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      if (who === 'me') {
        setMyPhoto(base64)
        localStorage.setItem('myProfilePhoto', base64)
      } else {
        setPartnerPhoto(base64)
        localStorage.setItem('partnerProfilePhoto', base64)
      }
      showToast('프로필 사진이 변경되었어요')
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoDelete = (who: 'me' | 'partner') => {
    if (who === 'me') {
      setMyPhoto(null)
      localStorage.removeItem('myProfilePhoto')
    } else {
      setPartnerPhoto(null)
      localStorage.removeItem('partnerProfilePhoto')
    }
    showToast('프로필 사진이 삭제됐어요')
  }

  const openThemeModal = () => {
    setPreviewTheme(currentTheme)
    setShowThemeModal(true)
  }

  const handleThemePreview = (themeId: string) => {
    document.documentElement.setAttribute('data-theme', themeId)
    setPreviewTheme(themeId)
  }

  const handleThemeSave = () => {
    localStorage.setItem('momento_theme', previewTheme)
    setCurrentTheme(previewTheme)
    setShowThemeModal(false)
    const themeNames: Record<string, string> = {
      blossom: '벚꽃', lavender: '라벤더', mint: '민트',
      peach: '피치', sky: '하늘', lemon: '레몬', dark: '다크',
    }
    showToast(`${themeNames[previewTheme] ?? previewTheme} 테마가 저장됐어요`)
  }

  const handleThemeClose = () => {
    document.documentElement.setAttribute('data-theme', currentTheme)
    setShowThemeModal(false)
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
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
            {/* 내 프로필 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <label className="cursor-pointer group relative block">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 group-hover:border-pink-300 transition-colors overflow-hidden">
                    {myPhoto ? (
                      <img src={myPhoto} alt="내 프로필" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-handwriting text-2xl text-pink-400">{person1.name[0]}</span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-pink-300 rounded-full flex items-center justify-center text-white text-xs shadow">✎</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange('me', e)} />
                </label>
                {myPhoto && (
                  <button
                    onClick={() => handlePhotoDelete('me')}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 hover:bg-red-400 rounded-full flex items-center justify-center text-white text-xs shadow transition-colors"
                    title="사진 삭제"
                  >×</button>
                )}
              </div>
              <button onClick={openProfileModal} className="font-ui text-sm text-gray-600 font-bold hover:text-pink-400 transition-colors">{person1.name} ✎</button>
              <span className="font-ui text-xs text-gray-400">{person1.email}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-3xl">♥</span>
              <span className="font-handwriting text-xl text-pink-400 mt-1">D+{getDDay()}</span>
            </div>

            {/* 상대방 프로필 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <label className="cursor-pointer group relative block">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-lavender-100 flex items-center justify-center border-2 border-lavender-200 group-hover:border-lavender-300 transition-colors overflow-hidden">
                    {partnerPhoto ? (
                      <img src={partnerPhoto} alt="상대방 프로필" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-handwriting text-2xl text-lavender-400">{person2.name[0]}</span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-lavender-300 rounded-full flex items-center justify-center text-white text-xs shadow">✎</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange('partner', e)} />
                </label>
                {partnerPhoto && (
                  <button
                    onClick={() => handlePhotoDelete('partner')}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 hover:bg-red-400 rounded-full flex items-center justify-center text-white text-xs shadow transition-colors"
                    title="사진 삭제"
                  >×</button>
                )}
              </div>
              <button onClick={openProfileModal} className="font-ui text-sm text-gray-600 font-bold hover:text-lavender-400 transition-colors">{person2.name} ✎</button>
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
            <span className="text-xl">🌙</span>
            <div>
              <p className="font-ui text-sm text-gray-600">알림 설정</p>
              <p className="font-ui text-xs text-gray-400">기념일, 일정 알림</p>
            </div>
          </button>
          <button
            onClick={openThemeModal}
            className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors text-left"
          >
            <span className="text-xl">🌸</span>
            <div>
              <p className="font-ui text-sm text-gray-600">테마 변경</p>
              <p className="font-ui text-xs text-gray-400">색상 테마 선택</p>
            </div>
          </button>
          <button
            onClick={handleExportData}
            className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors text-left"
          >
            <span className="text-xl">🌿</span>
            <div>
              <p className="font-ui text-sm text-gray-600">데이터 내보내기</p>
              <p className="font-ui text-xs text-gray-400">일기, 게시글 백업</p>
            </div>
          </button>
          <Link
            href="/guide"
            className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors"
          >
            <span className="text-xl">🗺️</span>
            <div>
              <p className="font-ui text-sm text-gray-600">앱 가이드</p>
              <p className="font-ui text-xs text-gray-400">Momento 사용 방법 안내</p>
            </div>
          </Link>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="font-ui w-full mt-4 p-3 text-center text-sm text-red-300 hover:text-red-400 transition-colors"
        >
          로그아웃
        </button>
      </main>

      {/* 별명 수정 모달 */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setShowProfileModal(false)}>
          <div className="card-pastel p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-4">별명 변경</h3>
            <div className="space-y-4">
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">내 별명</label>
                <input
                  type="text"
                  className="input-pastel"
                  placeholder="내 별명을 입력해주세요"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div>
                <label className="font-ui block text-sm text-lavender-400 mb-1.5 ml-1">상대방 별명</label>
                <input
                  type="text"
                  className="input-pastel"
                  placeholder="상대방 별명을 입력해주세요"
                  value={editPartnerName}
                  onChange={(e) => setEditPartnerName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowProfileModal(false)} className="btn-secondary">취소</button>
              <button onClick={handleSaveProfile} className="btn-primary" disabled={!editName.trim()}>저장</button>
            </div>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={handleThemeClose}>
          <div className="card-pastel p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-1">테마 변경</h3>
            <p className="font-ui text-xs text-gray-400 mb-4">클릭하면 미리볼 수 있어요 — 저장 버튼을 눌러야 적용돼요</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {([
                { id: 'blossom',  name: '벚꽃',   dots: ['#f8b4c0', '#fbd5dc', '#fef7f7'] },
                { id: 'lavender', name: '라벤더', dots: ['#c4b5fd', '#ddd6fe', '#f5f3ff'] },
                { id: 'mint',     name: '민트',   dots: ['#8dead0', '#bef5e0', '#f0fdf9'] },
                { id: 'peach',    name: '피치',   dots: ['#ffc48d', '#ffdbb5', '#fff8f3'] },
                { id: 'sky',      name: '하늘',   dots: ['#8ec2ff', '#b9daff', '#f0f7ff'] },
                { id: 'lemon',    name: '레몬',   dots: ['#fde047', '#fef08a', '#fefce8'] },
              ] as { id: string; name: string; dots: string[] }[]).map((theme) => {
                const isPreviewing = previewTheme === theme.id
                const isSaved = currentTheme === theme.id
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemePreview(theme.id)}
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      isPreviewing ? 'border-pink-300 bg-pink-50 scale-105' : 'border-gray-100 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex gap-1 mb-2 justify-center">
                      {theme.dots.map((c, i) => (
                        <span key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <p className="font-ui text-xs text-gray-500">{theme.name}</p>
                    {isPreviewing && !isSaved && <p className="font-ui text-xs text-pink-400 mt-0.5">미리보기</p>}
                    {isSaved && <p className="font-ui text-xs text-pink-400 mt-0.5">저장됨</p>}
                  </button>
                )
              })}
            </div>

            {/* 다크 모드 */}
            <div className="border-t border-pink-50 pt-4 mb-4">
              <button
                onClick={() => {
                  const next = previewTheme === 'dark' ? 'blossom' : 'dark'
                  handleThemePreview(next)
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  previewTheme === 'dark' ? 'border-pink-300 bg-pink-50' : 'border-gray-100 hover:border-pink-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {['#1e1e32', '#2e2e4a', '#c084a0'].map((c, i) => (
                      <span key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="font-ui text-sm text-gray-500">다크 모드</span>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${previewTheme === 'dark' ? 'bg-pink-300' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${previewTheme === 'dark' ? 'left-5' : 'left-0.5'}`} />
                </div>
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={handleThemeClose} className="btn-secondary">닫기</button>
              <button onClick={handleThemeSave} className="btn-primary">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      {modal && (
        <Modal
          type="confirm"
          title={modal.title}
          message={modal.message}
          confirmText="확인"
          cancelText="취소"
          onConfirm={() => { modal.onConfirm(); setModal(null) }}
          onCancel={() => setModal(null)}
        />
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
