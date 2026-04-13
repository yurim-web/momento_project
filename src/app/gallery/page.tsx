'use client'

import Navbar from '@/components/Navbar'
import { useState } from 'react'

const dummyPhotos = [
  { id: 1, date: '2024.04.02', caption: '벚꽃 아래에서', category: '데이트' },
  { id: 2, date: '2024.04.10', caption: '카페에서', category: '일상' },
  { id: 3, date: '2024.04.24', caption: '제주도 바다', category: '여행' },
  { id: 4, date: '2024.05.10', caption: '맛있는 케이크', category: '맛집' },
  { id: 5, date: '2024.05.15', caption: '공원 산책', category: '데이트' },
  { id: 6, date: '2024.06.01', caption: '비 오는 날', category: '일상' },
  { id: 7, date: '2024.06.14', caption: '영화관에서', category: '데이트' },
  { id: 8, date: '2024.07.20', caption: '바다!', category: '여행' },
  { id: 9, date: '2024.08.02', caption: '200일 기념', category: '기념일' },
]

const pastelColors = [
  'bg-pink-100',
  'bg-lavender-100',
  'bg-mint-100',
  'bg-peach-100',
  'bg-pink-50',
  'bg-lavender-50',
]

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="font-handwriting text-3xl text-gray-600 mb-6">갤러리</h1>

        {/* 사진 그리드 */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {dummyPhotos.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo.id)}
              className={`aspect-square rounded-2xl ${pastelColors[i % pastelColors.length]} flex items-center justify-center hover:scale-105 transition-transform relative overflow-hidden group`}
            >
              <span className="text-4xl">📷</span>
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end p-3">
                <div className="text-left">
                  <p className="text-white text-xs font-bold">{photo.caption}</p>
                  <p className="text-white/70 text-xs">{photo.date}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 사진 상세 모달 */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="card-pastel p-4 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const photo = dummyPhotos.find((p) => p.id === selectedPhoto)
                if (!photo) return null
                return (
                  <>
                    <div className="aspect-video bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-6xl">📷</span>
                    </div>
                    <h3 className="font-handwriting text-xl text-gray-600 mb-1">{photo.caption}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{photo.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-400">
                        {photo.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="btn-secondary mt-4 text-sm"
                    >
                      닫기
                    </button>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
