'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect, useCallback } from 'react'
import { calendarApi, CalendarEventData } from '@/lib/api'

interface CalendarEvent {
  id: number
  date: string
  title: string
  category: 'date' | 'anniversary' | 'schedule' | 'birthday'
  color: string
}

const categoryColors = {
  date: 'bg-pink-200 text-pink-500',
  anniversary: 'bg-lavender-200 text-lavender-500',
  schedule: 'bg-mint-200 text-mint-500',
  birthday: 'bg-peach-200 text-peach-500',
}

const categoryLabels = {
  date: '데이트',
  anniversary: '기념일',
  schedule: '일정',
  birthday: '생일',
}

const colorMap: Record<string, string> = {
  date: 'pink',
  anniversary: 'lavender',
  schedule: 'mint',
  birthday: 'peach',
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', category: 'schedule' as CalendarEvent['category'], date: '' })
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [addLoading, setAddLoading] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  const loadEvents = useCallback(async () => {
    try {
      const data = await calendarApi.getByMonth(year, month + 1)
      setEvents(data.map((ev: CalendarEventData) => ({
        id: ev.id!,
        date: ev.eventDate,
        title: ev.title,
        category: ev.category as CalendarEvent['category'],
        color: colorMap[ev.category] || 'pink',
      })))
    } catch {
      console.error('일정을 불러올 수 없습니다.')
    }
  }, [year, month])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter((e) => e.date === dateStr)
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return
    setAddLoading(true)
    try {
      const email = localStorage.getItem('userEmail') || ''
      await calendarApi.create({
        title: newEvent.title,
        category: newEvent.category,
        eventDate: selectedDate,
        authorEmail: email,
      })
      setShowAddModal(false)
      setNewEvent({ title: '', category: 'schedule', date: '' })
      loadEvents()
    } catch {
      alert('일정 추가에 실패했습니다.')
    } finally {
      setAddLoading(false)
    }
  }

  const days = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">캘린더</h1>

        {/* 달력 카드 */}
        <div className="card-pastel p-5 mb-6">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={goToPrevMonth} className="text-pink-400 hover:text-pink-500 p-2">
              ←
            </button>
            <div className="text-center">
              <h2 className="font-handwriting text-2xl text-gray-600">
                {year}년 {month + 1}월
              </h2>
            </div>
            <button onClick={goToNextMonth} className="text-pink-400 hover:text-pink-500 p-2">
              →
            </button>
          </div>

          <button onClick={goToToday} className="block mx-auto mb-4 text-xs text-pink-400 hover:text-pink-500">
            오늘로
          </button>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-2">
            {days.map((day, i) => (
              <div
                key={day}
                className={`text-center text-xs py-1 font-ui ${
                  i === 0 ? 'text-red-300' : i === 6 ? 'text-blue-300' : 'text-gray-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {/* 이전 달 날짜 */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`prev-${i}`} className="aspect-square p-1 text-center">
                <span className="text-xs text-gray-300 font-ui">{prevDays - firstDay + i + 1}</span>
              </div>
            ))}

            {/* 이번 달 날짜 */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dateStr = formatDate(day)
              const dayOfWeek = new Date(year, month, day).getDay()
              const events = getEventsForDate(dateStr)
              const isToday = dateStr === new Date().toISOString().split('T')[0]
              const isSelected = dateStr === selectedDate

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1 rounded-xl text-center transition-all relative ${
                    isSelected
                      ? 'bg-pink-100 ring-2 ring-pink-300'
                      : isToday
                        ? 'bg-lavender-50'
                        : 'hover:bg-pink-50'
                  }`}
                >
                  <span
                    className={`text-xs font-ui ${
                      isToday
                        ? 'text-pink-500 font-bold'
                        : dayOfWeek === 0
                          ? 'text-red-300'
                          : dayOfWeek === 6
                            ? 'text-blue-300'
                            : 'text-gray-600'
                    }`}
                  >
                    {day}
                  </span>
                  {events.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {events.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            ev.color === 'pink' ? 'bg-pink-300' :
                            ev.color === 'lavender' ? 'bg-lavender-300' :
                            ev.color === 'mint' ? 'bg-mint-300' :
                            'bg-peach-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 카테고리 범례 */}
        <div className="flex flex-wrap gap-3 mb-6 px-1">
          {(Object.entries(categoryLabels) as [CalendarEvent['category'], string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                key === 'date' ? 'bg-pink-300' :
                key === 'anniversary' ? 'bg-lavender-300' :
                key === 'schedule' ? 'bg-mint-300' :
                'bg-peach-300'
              }`} />
              <span className="text-xs text-gray-400 font-ui">{label}</span>
            </div>
          ))}
        </div>

        {/* 선택된 날짜의 일정 */}
        {selectedDate && (
          <div className="card-pastel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-handwriting text-xl text-gray-600">
                {new Date(selectedDate + 'T00:00:00').getMonth() + 1}월 {new Date(selectedDate + 'T00:00:00').getDate()}일
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-sm text-pink-400 hover:text-pink-500 px-3 py-1 border border-pink-200 rounded-full font-ui"
              >
                + 일정 추가
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 font-ui">일정이 없어요</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-ui ${categoryColors[ev.category]}`}>
                      {categoryLabels[ev.category]}
                    </span>
                    <span className="text-sm text-gray-600 font-ui">{ev.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 일정 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="card-pastel p-6 w-full max-w-sm">
              <h3 className="font-handwriting text-xl text-gray-600 mb-4">일정 추가</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm text-pink-400 mb-1.5 ml-1 font-ui">일정 이름</label>
                  <input
                    type="text"
                    className="input-pastel"
                    placeholder="무슨 일정이에요?"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-400 mb-2 ml-1 font-ui">카테고리</label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.entries(categoryLabels) as [CalendarEvent['category'], string][]).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, category: key })}
                        className={`px-3 py-1 rounded-full text-sm font-ui transition-all ${
                          newEvent.category === key
                            ? categoryColors[key]
                            : 'bg-gray-50 text-gray-400 border border-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                    취소
                  </button>
                  <button type="submit" className="btn-primary" disabled={addLoading}>
                    {addLoading ? '추가 중...' : '추가하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
