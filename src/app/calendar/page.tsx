'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

interface CalendarEvent {
  id: number
  date: string
  title: string
  category: string
  memo?: string
}

interface CustomCalendarCategory {
  id: string
  name: string
  colorId: string
}

const COLOR_PALETTE = [
  { id: 'pink',     label: '핑크',   dot: '#f9a8d4', bg: '#fdf2f8', text: '#ec4899', border: '#fbcfe8' },
  { id: 'lavender', label: '라벤더', dot: '#c4b5fd', bg: '#f5f3ff', text: '#8b5cf6', border: '#ddd6fe' },
  { id: 'mint',     label: '민트',   dot: '#6ee7b7', bg: '#ecfdf5', text: '#10b981', border: '#a7f3d0' },
  { id: 'peach',    label: '피치',   dot: '#fdba74', bg: '#fff7ed', text: '#f97316', border: '#fed7aa' },
  { id: 'blue',     label: '블루',   dot: '#93c5fd', bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
  { id: 'yellow',   label: '옐로우', dot: '#fde047', bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
  { id: 'rose',     label: '로즈',   dot: '#fda4af', bg: '#fff1f2', text: '#f43f5e', border: '#fecdd3' },
  { id: 'teal',     label: '틸',     dot: '#5eead4', bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' },
]

const DEFAULT_CATS: CustomCalendarCategory[] = [
  { id: 'date',        name: '데이트', colorId: 'pink' },
  { id: 'anniversary', name: '기념일', colorId: 'lavender' },
  { id: 'schedule',    name: '일정',   colorId: 'mint' },
  { id: 'birthday',    name: '생일',   colorId: 'peach' },
]

const TODAY = new Date().toISOString().split('T')[0]
const getColor = (colorId: string) => COLOR_PALETTE.find(c => c.id === colorId) ?? COLOR_PALETTE[0]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>(TODAY)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', category: 'schedule', memo: '' })
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null)

  // 커스텀 카테고리
  const [customCats, setCustomCats] = useState<CustomCalendarCategory[]>([])
  const [showAddCat, setShowAddCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState('pink')

  const allCats = [...DEFAULT_CATS, ...customCats]
  const getCat = (catId: string) => allCats.find(c => c.id === catId) ?? DEFAULT_CATS[2]

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  useEffect(() => {
    setEvents(JSON.parse(localStorage.getItem('momento_calendar') || '[]'))
    setCustomCats(JSON.parse(localStorage.getItem('momento_calendar_categories') || '[]'))
  }, [])

  const saveCustomCats = (updated: CustomCalendarCategory[]) => {
    setCustomCats(updated)
    localStorage.setItem('momento_calendar_categories', JSON.stringify(updated))
  }

  const handleAddCustomCat = () => {
    const name = newCatName.trim()
    if (!name || allCats.some(c => c.name === name)) return
    const id = `custom_${Date.now()}`
    saveCustomCats([...customCats, { id, name, colorId: newCatColor }])
    setNewCatName('')
    setNewCatColor('pink')
    setShowAddCat(false)
  }

  const handleDeleteCustomCat = (id: string) => {
    saveCustomCats(customCats.filter(c => c.id !== id))
    if (newEvent.category === id) setNewEvent(prev => ({ ...prev, category: 'schedule' }))
  }

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr)
  const selectedEvents = getEventsForDate(selectedDate)

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: CalendarEvent = {
      id: Date.now(),
      date: selectedDate,
      title: newEvent.title,
      category: newEvent.category,
      memo: newEvent.memo.trim() || undefined,
    }
    const updated = [...events, newItem]
    setEvents(updated)
    localStorage.setItem('momento_calendar', JSON.stringify(updated))
    setShowAddModal(false)
    setNewEvent({ title: '', category: 'schedule', memo: '' })
  }

  const handleDeleteEvent = (id: number) => {
    const updated = events.filter(e => e.id !== id)
    setEvents(updated)
    localStorage.setItem('momento_calendar', JSON.stringify(updated))
    if (detailEvent?.id === id) setDetailEvent(null)
  }

  const days = ['일', '월', '화', '수', '목', '금', '토']

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">캘린더</h1>

        {/* ── 달력 ── */}
        <div className="card-pastel p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-pink-400 hover:text-pink-500 p-2">←</button>
            <h2 className="font-handwriting text-2xl text-gray-600">{year}년 {month + 1}월</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-pink-400 hover:text-pink-500 p-2">→</button>
          </div>
          <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(TODAY) }} className="block mx-auto mb-4 text-xs text-pink-400 hover:text-pink-500">
            오늘로
          </button>
          <div className="grid grid-cols-7 mb-2">
            {days.map((day, i) => (
              <div key={day} className={`text-center text-xs py-1 font-ui ${i === 0 ? 'text-red-300' : i === 6 ? 'text-blue-300' : 'text-gray-400'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`prev-${i}`} className="aspect-square p-1 text-center">
                <span className="text-xs text-gray-300 font-ui">{prevDays - firstDay + i + 1}</span>
              </div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dateStr = formatDate(day)
              const dayOfWeek = new Date(year, month, day).getDay()
              const dayEvents = getEventsForDate(dateStr)
              const isToday = dateStr === TODAY
              const isSelected = dateStr === selectedDate
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1 rounded-xl text-center transition-all ${
                    isSelected ? 'bg-pink-100 ring-2 ring-pink-300' : isToday ? 'bg-lavender-50' : 'hover:bg-pink-50'
                  }`}
                >
                  <span className={`text-xs font-ui ${isToday ? 'text-pink-500 font-bold' : dayOfWeek === 0 ? 'text-red-300' : dayOfWeek === 6 ? 'text-blue-300' : 'text-gray-600'}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map(ev => {
                        const col = getColor(getCat(ev.category).colorId)
                        return <span key={ev.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.dot }} />
                      })}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 범례 + 카테고리 관리 ── */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            {/* 범례 */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1">
              {allCats.map(cat => {
                const col = getColor(cat.colorId)
                const isCustom = !DEFAULT_CATS.some(d => d.id === cat.id)
                return (
                  <div key={cat.id} className="flex items-center gap-1.5 group">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.dot }} />
                    <span className="text-xs text-gray-400 font-ui">{cat.name}</span>
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteCustomCat(cat.id)}
                        className="w-3.5 h-3.5 rounded-full text-[9px] text-gray-300 hover:text-red-300 hidden group-hover:flex items-center justify-center leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 카테고리 추가 버튼 */}
            {!showAddCat && (
              <button
                onClick={() => setShowAddCat(true)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-ui text-pink-300 border border-pink-100 hover:border-pink-300 transition-all"
              >
                + 카테고리
              </button>
            )}
          </div>

          {/* 인라인 카테고리 추가 폼 */}
          {showAddCat && (
            <div className="mt-3 card-pastel p-4 space-y-3">
              <p className="font-ui text-sm text-pink-400 font-bold">새 카테고리 추가</p>
              <input
                autoFocus
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCat() }
                  if (e.key === 'Escape') { setShowAddCat(false); setNewCatName('') }
                }}
                placeholder="카테고리 이름"
                className="input-pastel"
              />
              {/* 색상 선택 */}
              <div>
                <p className="font-ui text-xs text-gray-400 mb-2">색상 선택</p>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_PALETTE.map(col => (
                    <button
                      key={col.id}
                      type="button"
                      title={col.label}
                      onClick={() => setNewCatColor(col.id)}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{
                        backgroundColor: col.dot,
                        outline: newCatColor === col.id ? `3px solid ${col.text}` : '2px solid transparent',
                        outlineOffset: '2px',
                      }}
                    >
                      {newCatColor === col.id && (
                        <span className="text-white text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                {/* 미리보기 */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-ui text-xs text-gray-400">미리보기:</span>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-ui"
                    style={{
                      backgroundColor: getColor(newCatColor).bg,
                      color: getColor(newCatColor).text,
                      border: `1px solid ${getColor(newCatColor).border}`,
                    }}
                  >
                    {newCatName || '이름 없음'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAddCustomCat}
                  disabled={!newCatName.trim()}
                  className="flex-1 py-2 rounded-xl text-sm font-ui text-white transition-colors disabled:opacity-40"
                  style={{ backgroundColor: getColor(newCatColor).dot }}
                >
                  추가하기
                </button>
                <button
                  onClick={() => { setShowAddCat(false); setNewCatName(''); setNewCatColor('pink') }}
                  className="btn-secondary !w-auto px-4"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── 선택된 날짜 일정 ── */}
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
              {selectedEvents.map(ev => {
                const cat = getCat(ev.category)
                const col = getColor(cat.colorId)
                return (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-opacity hover:opacity-75"
                    style={{ backgroundColor: col.bg }}
                    onClick={() => setDetailEvent(ev)}
                  >
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-ui flex-shrink-0"
                      style={{ backgroundColor: col.bg, color: col.text }}
                    >
                      {cat.name}
                    </span>
                    <span className="text-sm text-gray-600 font-ui flex-1">{ev.title}</span>
                    {ev.memo && <span className="text-xs text-gray-300">📝</span>}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev.id) }}
                      className="text-xs text-gray-300 hover:text-red-300 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── 일정 추가 모달 ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setShowAddModal(false)}
        >
          <div className="card-pastel p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-1">일정 추가</h3>
            <p className="font-ui text-xs text-gray-400 mb-4">
              {new Date(selectedDate + 'T00:00:00').getMonth() + 1}월 {new Date(selectedDate + 'T00:00:00').getDate()}일
            </p>
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
                  {allCats.map(cat => {
                    const col = getColor(cat.colorId)
                    const isSelected = newEvent.category === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, category: cat.id })}
                        className="px-3 py-1 rounded-full text-sm font-ui transition-all"
                        style={isSelected
                          ? { backgroundColor: col.bg, color: col.text, outline: `2px solid ${col.dot}`, outlineOffset: '1px' }
                          : { backgroundColor: '#f9fafb', color: '#9ca3af', border: '1px solid #e5e7eb' }
                        }
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-pink-400 ml-1 font-ui">
                    메모 <span className="text-gray-300 text-xs">(선택)</span>
                  </label>
                  <span className="text-xs text-gray-300 font-ui mr-1">{newEvent.memo.length}/200</span>
                </div>
                <textarea
                  className="input-pastel resize-none"
                  rows={3}
                  placeholder="기억해두고 싶은 것들을 적어요"
                  maxLength={200}
                  value={newEvent.memo}
                  onChange={(e) => setNewEvent({ ...newEvent, memo: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">취소</button>
                <button type="submit" className="btn-primary">추가하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 일정 상세 모달 ── */}
      {detailEvent && (() => {
        const cat = getCat(detailEvent.category)
        const col = getColor(cat.colorId)
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            onClick={() => setDetailEvent(null)}
          >
            <div
              className="w-full max-w-sm rounded-3xl border-2 p-6"
              style={{ backgroundColor: col.bg, borderColor: col.border }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-ui"
                    style={{ backgroundColor: col.bg, color: col.text, border: `1px solid ${col.border}` }}
                  >
                    {cat.name}
                  </span>
                  <h3 className="font-ui text-base font-bold text-gray-600 mt-2">{detailEvent.title}</h3>
                  <p className="font-ui text-xs text-gray-400 mt-0.5">{formatDisplayDate(detailEvent.date)}</p>
                </div>
                <button onClick={() => setDetailEvent(null)} className="font-ui text-xs text-gray-300 hover:text-gray-500">닫기</button>
              </div>
              {detailEvent.memo ? (
                <div className="bg-white/60 rounded-2xl p-4 mb-4">
                  <p className="font-ui text-xs text-gray-400 mb-1.5">📝 메모</p>
                  <p className="font-ui text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{detailEvent.memo}</p>
                </div>
              ) : (
                <div className="bg-white/40 rounded-2xl p-4 mb-4 text-center">
                  <p className="font-ui text-xs text-gray-300">메모가 없어요</p>
                </div>
              )}
              <button
                onClick={() => handleDeleteEvent(detailEvent.id)}
                className="w-full py-2 rounded-2xl font-ui text-sm text-red-300 hover:text-red-400 hover:bg-red-50 transition-colors border border-red-100"
              >
                일정 삭제
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
