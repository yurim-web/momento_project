'use client'

import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import { useState, useEffect } from 'react'

// ─── 여행 계획 타입 ───────────────────────────────────────
interface TravelPlace {
  id: string
  time: string
  name: string
  address: string
  memo: string
}

interface TravelDay {
  id: string
  date: string
  places: TravelPlace[]
}

interface TravelPlan {
  id: string
  title: string
  startDate: string
  endDate: string
  destination: string
  days: TravelDay[]
  createdAt: string
}

// ─── 버킷리스트 타입 ──────────────────────────────────────
interface BucketItem {
  id: string
  name: string
  category: '맛집' | '카페' | '장소' | '데이트' | '기타'
  address: string
  memo: string
  done: boolean
  createdAt: string
}

const bucketCategories = ['맛집', '카페', '장소', '데이트', '기타'] as const
const categoryEmoji: Record<string, string> = {
  맛집: '🍽️', 카페: '☕', 장소: '📍', 데이트: '💑', 기타: '✨',
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export default function TravelPage() {
  const [tab, setTab] = useState<'plan' | 'bucket'>('plan')

  // ─── 여행 계획 state ─────────────────────────────────────
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [showNewPlan, setShowNewPlan] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null)
  const [newPlan, setNewPlan] = useState({ title: '', startDate: '', endDate: '', destination: '' })
  const [showAddPlace, setShowAddPlace] = useState<string | null>(null)
  const [newPlace, setNewPlace] = useState({ time: '', name: '', address: '', memo: '' })
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)

  // ─── 버킷리스트 state ────────────────────────────────────
  const [buckets, setBuckets] = useState<BucketItem[]>([])
  const [showAddBucket, setShowAddBucket] = useState(false)
  const [bucketFilter, setBucketFilter] = useState<'전체' | BucketItem['category']>('전체')
  const [newBucket, setNewBucket] = useState({ name: '', category: '맛집' as BucketItem['category'], address: '', memo: '' })
  const [deleteBucketId, setDeleteBucketId] = useState<string | null>(null)

  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const savedPlans = localStorage.getItem('travelPlans')
    if (savedPlans) setPlans(JSON.parse(savedPlans))
    const savedBuckets = localStorage.getItem('travelBuckets')
    if (savedBuckets) setBuckets(JSON.parse(savedBuckets))
  }, [])

  const savePlans = (updated: TravelPlan[]) => {
    setPlans(updated)
    localStorage.setItem('travelPlans', JSON.stringify(updated))
  }

  const saveBuckets = (updated: BucketItem[]) => {
    setBuckets(updated)
    localStorage.setItem('travelBuckets', JSON.stringify(updated))
  }

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  // ─── 여행 계획 핸들러 ─────────────────────────────────────
  const getDaysBetween = (start: string, end: string) => {
    const days: string[] = []
    for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().split('T')[0])
    }
    return days
  }

  const handleCreatePlan = () => {
    if (!newPlan.title || !newPlan.startDate || !newPlan.endDate) return
    const plan: TravelPlan = {
      id: generateId(),
      title: newPlan.title,
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      destination: newPlan.destination,
      days: getDaysBetween(newPlan.startDate, newPlan.endDate).map(date => ({ id: generateId(), date, places: [] })),
      createdAt: new Date().toISOString(),
    }
    savePlans([plan, ...plans])
    setSelectedPlan(plan)
    setShowNewPlan(false)
    setNewPlan({ title: '', startDate: '', endDate: '', destination: '' })
    showToastMsg('여행 계획이 생성되었어요!')
  }

  const handleAddPlace = (dayId: string) => {
    if (!selectedPlan || !newPlace.name) return
    const updatedPlan = {
      ...selectedPlan,
      days: selectedPlan.days.map(day =>
        day.id === dayId ? { ...day, places: [...day.places, { ...newPlace, id: generateId() }] } : day
      ),
    }
    savePlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p))
    setSelectedPlan(updatedPlan)
    setShowAddPlace(null)
    setNewPlace({ time: '', name: '', address: '', memo: '' })
  }

  const handleDeletePlace = (dayId: string, placeId: string) => {
    if (!selectedPlan) return
    const updatedPlan = {
      ...selectedPlan,
      days: selectedPlan.days.map(day =>
        day.id === dayId ? { ...day, places: day.places.filter(p => p.id !== placeId) } : day
      ),
    }
    savePlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p))
    setSelectedPlan(updatedPlan)
  }

  const handleDeletePlan = (planId: string) => {
    savePlans(plans.filter(p => p.id !== planId))
    if (selectedPlan?.id === planId) setSelectedPlan(null)
    setDeletePlanId(null)
    showToastMsg('여행 계획이 삭제되었어요')
  }

  // ─── 버킷리스트 핸들러 ────────────────────────────────────
  const handleAddBucket = () => {
    if (!newBucket.name.trim()) return
    const item: BucketItem = {
      id: generateId(),
      name: newBucket.name,
      category: newBucket.category,
      address: newBucket.address,
      memo: newBucket.memo,
      done: false,
      createdAt: new Date().toISOString(),
    }
    saveBuckets([item, ...buckets])
    setShowAddBucket(false)
    setNewBucket({ name: '', category: '맛집', address: '', memo: '' })
    showToastMsg('버킷리스트에 추가됐어요!')
  }

  const handleToggleDone = (id: string) => {
    saveBuckets(buckets.map(b => b.id === id ? { ...b, done: !b.done } : b))
  }

  const handleDeleteBucket = (id: string) => {
    saveBuckets(buckets.filter(b => b.id !== id))
    setDeleteBucketId(null)
  }

  const openNaverMap = (address: string) => {
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(address)}`, '_blank')
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getMonth() + 1}/${d.getDate()}(${'일월화수목금토'[d.getDay()]})`
  }

  const filteredBuckets = bucketFilter === '전체'
    ? buckets
    : buckets.filter(b => b.category === bucketFilter)

  const doneCount = buckets.filter(b => b.done).length

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">여행</h1>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          {([['plan', '✈️ 여행 계획'], ['bucket', '🗺️ 버킷리스트']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSelectedPlan(null) }}
              className={`flex-1 py-2.5 rounded-2xl font-ui text-sm font-bold transition-all ${
                tab === key
                  ? 'bg-gradient-to-r from-pink-300 to-lavender-300 text-white shadow-sm'
                  : 'bg-white text-gray-400 border border-pink-100 hover:border-pink-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ══════════ 여행 계획 탭 ══════════ */}
        {tab === 'plan' && (
          <>
            {selectedPlan ? (
              <div>
                <button onClick={() => setSelectedPlan(null)} className="font-ui text-sm text-gray-400 hover:text-pink-400 mb-4 inline-block">
                  ← 목록으로
                </button>

                <div className="card-pastel p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-handwriting text-2xl text-gray-600 mb-1">{selectedPlan.title}</h2>
                      {selectedPlan.destination && (
                        <button onClick={() => openNaverMap(selectedPlan.destination)} className="font-ui text-sm text-pink-400 hover:text-pink-500 mb-2 inline-flex items-center gap-1">
                          📍 {selectedPlan.destination}
                        </button>
                      )}
                      <p className="font-ui text-xs text-gray-400">{selectedPlan.startDate} ~ {selectedPlan.endDate} ({selectedPlan.days.length}일)</p>
                    </div>
                    <button onClick={() => setDeletePlanId(selectedPlan.id)} className="font-ui text-xs text-red-300 hover:text-red-400">삭제</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedPlan.days.map((day, dayIndex) => (
                    <div key={day.id} className="card-pastel p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-ui text-xs text-white bg-pink-300 px-2 py-0.5 rounded-full">DAY {dayIndex + 1}</span>
                          <span className="font-ui text-sm text-gray-500">{formatDate(day.date)}</span>
                        </div>
                        <button onClick={() => { setShowAddPlace(day.id); setNewPlace({ time: '', name: '', address: '', memo: '' }) }} className="font-ui text-xs text-pink-400 hover:text-pink-500">+ 장소 추가</button>
                      </div>

                      {day.places.length === 0 ? (
                        <p className="font-ui text-xs text-gray-300 text-center py-3">아직 일정이 없어요</p>
                      ) : (
                        <div className="space-y-2">
                          {day.places.map((place, placeIndex) => (
                            <div key={place.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-pink-200 mt-1" />
                                {placeIndex < day.places.length - 1 && <div className="w-0.5 flex-1 bg-pink-100 my-1" />}
                              </div>
                              <div className="flex-1 bg-cream-50 rounded-xl p-3 mb-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    {place.time && <span className="font-ui text-xs text-pink-400 mb-0.5 block">{place.time}</span>}
                                    <p className="font-ui text-sm text-gray-600 font-bold">{place.name}</p>
                                    {place.address && (
                                      <button onClick={() => openNaverMap(place.address)} className="font-ui text-xs text-blue-400 hover:text-blue-500 mt-0.5 inline-flex items-center gap-0.5">
                                        📍 {place.address} →
                                      </button>
                                    )}
                                    {place.memo && <p className="font-ui text-xs text-gray-400 mt-1">{place.memo}</p>}
                                  </div>
                                  <button onClick={() => handleDeletePlace(day.id, place.id)} className="text-xs text-gray-300 hover:text-red-300 ml-2">✕</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showAddPlace === day.id && (
                        <div className="mt-3 p-4 bg-pink-50/50 rounded-xl space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="font-ui block text-xs text-pink-400 mb-1">시간</label>
                              <input type="time" className="input-pastel !text-sm" value={newPlace.time} onChange={(e) => setNewPlace({ ...newPlace, time: e.target.value })} />
                            </div>
                            <div>
                              <label className="font-ui block text-xs text-pink-400 mb-1">장소명 *</label>
                              <input type="text" className="input-pastel !text-sm" placeholder="카페, 식당..." value={newPlace.name} onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })} />
                            </div>
                          </div>
                          <div>
                            <label className="font-ui block text-xs text-pink-400 mb-1">주소</label>
                            <input type="text" className="input-pastel !text-sm" placeholder="주소를 입력하면 지도로 연결돼요" value={newPlace.address} onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })} />
                          </div>
                          <div>
                            <label className="font-ui block text-xs text-pink-400 mb-1">메모</label>
                            <input type="text" className="input-pastel !text-sm" placeholder="예약번호, 참고사항 등" value={newPlace.memo} onChange={(e) => setNewPlace({ ...newPlace, memo: e.target.value })} />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setShowAddPlace(null)} className="btn-secondary !text-sm !py-1.5">취소</button>
                            <button onClick={() => handleAddPlace(day.id)} className="btn-primary !text-sm !py-1.5" disabled={!newPlace.name.trim()}>추가</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <button onClick={() => setShowNewPlan(true)} className="font-ui text-sm text-pink-400 hover:text-pink-500 px-3 py-1.5 border border-pink-200 rounded-full">
                    + 새 여행 계획
                  </button>
                </div>
                {plans.length === 0 ? (
                  <div className="card-pastel p-12 text-center">
                    <span className="text-5xl block mb-4">✈️</span>
                    <p className="font-ui text-gray-400 text-sm mb-3">아직 여행 계획이 없어요</p>
                    <button onClick={() => setShowNewPlan(true)} className="font-ui text-sm text-pink-400 hover:text-pink-500">첫 번째 여행을 계획해보세요 →</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plans.map(plan => (
                      <button key={plan.id} onClick={() => setSelectedPlan(plan)} className="w-full text-left card-pastel p-5 hover:scale-[1.01] transition-transform">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-ui text-sm font-bold text-gray-600 mb-1">{plan.title}</h3>
                            {plan.destination && <p className="font-ui text-xs text-pink-400 mb-1">📍 {plan.destination}</p>}
                            <p className="font-ui text-xs text-gray-400">{plan.startDate} ~ {plan.endDate} · {plan.days.length}일</p>
                          </div>
                          <p className="font-ui text-xs text-gray-300">{plan.days.reduce((acc, d) => acc + d.places.length, 0)}개 장소</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ══════════ 버킷리스트 탭 ══════════ */}
        {tab === 'bucket' && (
          <>
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-ui text-sm text-gray-400">
                {doneCount}/{buckets.length}개 완료
                {doneCount > 0 && <span className="ml-1">🎉</span>}
              </p>
              <button onClick={() => setShowAddBucket(true)} className="font-ui text-sm text-pink-400 hover:text-pink-500 px-3 py-1.5 border border-pink-200 rounded-full">
                + 추가
              </button>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {(['전체', ...bucketCategories] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setBucketFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-ui whitespace-nowrap transition-all ${
                    bucketFilter === cat
                      ? 'bg-pink-300 text-white'
                      : 'bg-white text-gray-400 border border-pink-100 hover:border-pink-300'
                  }`}
                >
                  {cat !== '전체' && categoryEmoji[cat]} {cat}
                </button>
              ))}
            </div>

            {filteredBuckets.length === 0 ? (
              <div className="card-pastel p-12 text-center">
                <span className="text-5xl block mb-4">🗺️</span>
                <p className="font-ui text-gray-400 text-sm mb-3">
                  {bucketFilter === '전체' ? '아직 버킷리스트가 없어요' : `${bucketFilter} 항목이 없어요`}
                </p>
                <button onClick={() => setShowAddBucket(true)} className="font-ui text-sm text-pink-400 hover:text-pink-500">
                  같이 가고 싶은 곳을 추가해보세요 →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBuckets.map(item => (
                  <div key={item.id} className={`card-pastel p-4 flex items-start gap-3 transition-all ${item.done ? 'opacity-60' : ''}`}>
                    {/* 체크버튼 */}
                    <button
                      onClick={() => handleToggleDone(item.id)}
                      className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        item.done ? 'bg-pink-300 border-pink-300 text-white' : 'border-pink-200 hover:border-pink-300'
                      }`}
                    >
                      {item.done && <span className="text-xs">✓</span>}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm">{categoryEmoji[item.category]}</span>
                        <span className={`font-ui text-sm font-bold text-gray-600 ${item.done ? 'line-through' : ''}`}>{item.name}</span>
                        <span className="font-ui text-xs text-pink-300 bg-pink-50 px-1.5 py-0.5 rounded-full">{item.category}</span>
                      </div>
                      {item.address && (
                        <button onClick={() => openNaverMap(item.address)} className="font-ui text-xs text-blue-400 hover:text-blue-500 inline-flex items-center gap-0.5 mt-0.5">
                          📍 {item.address} →
                        </button>
                      )}
                      {item.memo && <p className="font-ui text-xs text-gray-400 mt-0.5">{item.memo}</p>}
                    </div>

                    <button onClick={() => setDeleteBucketId(item.id)} className="text-xs text-gray-300 hover:text-red-300 flex-shrink-0">✕</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* 새 여행 계획 모달 */}
      {showNewPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setShowNewPlan(false)}>
          <div className="card-pastel p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-4">새 여행 계획</h3>
            <div className="space-y-4">
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">여행 이름 *</label>
                <input type="text" className="input-pastel" placeholder="제주도 여행, 도쿄 여행..." value={newPlan.title} onChange={e => setNewPlan({ ...newPlan, title: e.target.value })} />
              </div>
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">여행지</label>
                <input type="text" className="input-pastel" placeholder="도시 또는 지역명" value={newPlan.destination} onChange={e => setNewPlan({ ...newPlan, destination: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">출발일 *</label>
                  <input type="date" className="input-pastel" value={newPlan.startDate} onChange={e => setNewPlan({ ...newPlan, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">도착일 *</label>
                  <input type="date" className="input-pastel" value={newPlan.endDate} onChange={e => setNewPlan({ ...newPlan, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNewPlan(false)} className="btn-secondary">취소</button>
              <button onClick={handleCreatePlan} className="btn-primary" disabled={!newPlan.title.trim() || !newPlan.startDate || !newPlan.endDate}>만들기</button>
            </div>
          </div>
        </div>
      )}

      {/* 버킷리스트 추가 모달 */}
      {showAddBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setShowAddBucket(false)}>
          <div className="card-pastel p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-4">버킷리스트 추가</h3>
            <div className="space-y-4">
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-2 ml-1">카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {bucketCategories.map(cat => (
                    <button key={cat} type="button" onClick={() => setNewBucket({ ...newBucket, category: cat })}
                      className={`px-3 py-1.5 rounded-full text-sm font-ui transition-all ${
                        newBucket.category === cat ? 'bg-pink-300 text-white' : 'bg-pink-50 text-pink-300 border border-pink-100 hover:border-pink-300'
                      }`}>
                      {categoryEmoji[cat]} {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">이름 *</label>
                <input type="text" className="input-pastel" placeholder="장소 또는 활동 이름" value={newBucket.name} onChange={e => setNewBucket({ ...newBucket, name: e.target.value })} />
              </div>
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">주소 (선택)</label>
                <input type="text" className="input-pastel" placeholder="주소 입력 시 지도 연결" value={newBucket.address} onChange={e => setNewBucket({ ...newBucket, address: e.target.value })} />
              </div>
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">메모 (선택)</label>
                <input type="text" className="input-pastel" placeholder="간단한 메모" value={newBucket.memo} onChange={e => setNewBucket({ ...newBucket, memo: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddBucket(false)} className="btn-secondary">취소</button>
              <button onClick={handleAddBucket} className="btn-primary" disabled={!newBucket.name.trim()}>추가하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-700 text-white text-sm px-5 py-2.5 rounded-full shadow-lg font-ui">
          {toast}
        </div>
      )}

      {deletePlanId && (
        <Modal type="confirm" title="여행 계획을 삭제할까요?" message="삭제하면 되돌릴 수 없어요"
          confirmText="삭제하기" cancelText="취소"
          onConfirm={() => handleDeletePlan(deletePlanId)} onCancel={() => setDeletePlanId(null)} />
      )}

      {deleteBucketId && (
        <Modal type="confirm" title="삭제할까요?" message="버킷리스트에서 지워져요"
          confirmText="삭제하기" cancelText="취소"
          onConfirm={() => handleDeleteBucket(deleteBucketId)} onCancel={() => setDeleteBucketId(null)} />
      )}
    </div>
  )
}
