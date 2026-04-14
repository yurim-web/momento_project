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

  useEffect(() => {
    const savedStartDate = localStorage.getItem('coupleStartDate')
    const savedMessage = localStorage.getItem('todayMessage')
    const userEmail = localStorage.getItem('userEmail') || ''
    const userName = localStorage.getItem('userName') || '나'
    const partnerName = localStorage.getItem('partnerName') || '당신'
    const partnerEmail = localStorage.getItem('partnerEmail') || ''

    if (savedStartDate) setStartDate(savedStartDate)
    if (savedMessage) setTodayMessage(savedMessage)
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
          {[
            { label: '알림 설정', desc: '기념일, 일정 알림', icon: '🔔' },
            { label: '테마 변경', desc: '색상 테마 선택', icon: '🎨' },
            { label: '데이터 내보내기', desc: '일기, 게시글 백업', icon: '💾' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-ui text-sm text-gray-600">{item.label}</p>
                <p className="font-ui text-xs text-gray-400">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="font-ui w-full mt-4 p-3 text-center text-sm text-red-300 hover:text-red-400 transition-colors"
        >
          로그아웃
        </button>
      </main>
    </div>
  )
}
