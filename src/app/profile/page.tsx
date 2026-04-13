'use client'

import Navbar from '@/components/Navbar'
import { useState } from 'react'

export default function ProfilePage() {
  const [couple, setCouple] = useState({
    person1: { name: '나', email: 'me@momento.com' },
    person2: { name: '당신', email: 'you@momento.com' },
    startDate: '2024-01-15',
    coupleCode: 'MOMENTO-A1B2C3',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [startDate, setStartDate] = useState(couple.startDate)

  const getDDay = () => {
    const start = new Date(couple.startDate)
    const today = new Date()
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleSave = () => {
    setCouple({ ...couple, startDate })
    setIsEditing(false)
    // TODO: API 연동
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">프로필</h1>

        {/* 커플 프로필 카드 */}
        <div className="card-pastel p-8 text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Person 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200">
                <span className="font-handwriting text-2xl text-pink-400">
                  {couple.person1.name[0]}
                </span>
              </div>
              <span className="text-sm text-gray-600 font-bold">{couple.person1.name}</span>
              <span className="text-xs text-gray-400">{couple.person1.email}</span>
            </div>

            {/* 하트 */}
            <div className="flex flex-col items-center">
              <span className="text-3xl">♥</span>
              <span className="font-handwriting text-xl text-pink-400 mt-1">D+{getDDay()}</span>
            </div>

            {/* Person 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-lavender-100 flex items-center justify-center border-2 border-lavender-200">
                <span className="font-handwriting text-2xl text-lavender-400">
                  {couple.person2.name[0]}
                </span>
              </div>
              <span className="text-sm text-gray-600 font-bold">{couple.person2.name}</span>
              <span className="text-xs text-gray-400">{couple.person2.email}</span>
            </div>
          </div>

          {/* 사귄 날짜 */}
          <div className="bg-cream-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">사귄 날</p>
            {isEditing ? (
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="date"
                  className="input-pastel !w-auto"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <button onClick={handleSave} className="text-sm text-pink-400 hover:text-pink-500">
                  저장
                </button>
                <button onClick={() => setIsEditing(false)} className="text-sm text-gray-400">
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-600 hover:text-pink-400 transition-colors"
              >
                {couple.startDate} ✎
              </button>
            )}
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="card-pastel divide-y divide-pink-50">
          {[
            { label: '알림 설정', desc: '기념일, 일정 알림', icon: '🔔' },
            { label: '테마 변경', desc: '색상 테마 선택', icon: '🎨' },
            { label: '커플 코드', desc: couple.coupleCode, icon: '🔗' },
            { label: '데이터 내보내기', desc: '일기, 게시글 백업', icon: '💾' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full p-4 flex items-center gap-4 hover:bg-pink-50/50 transition-colors text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* 로그아웃 */}
        <button className="w-full mt-4 p-3 text-center text-sm text-red-300 hover:text-red-400 transition-colors">
          로그아웃
        </button>
      </main>
    </div>
  )
}
