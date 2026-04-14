'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect, useRef } from 'react'
import { galleryApi, GalleryData } from '@/lib/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryData[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [caption, setCaption] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      const data = await galleryApi.getAll()
      setPhotos(data)
    } catch {
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const email = localStorage.getItem('userEmail') || ''
      await galleryApi.upload(selectedFile, caption, email)
      setShowUpload(false)
      setCaption('')
      setSelectedFile(null)
      setPreviewUrl(null)
      loadPhotos()
    } catch {
      alert('업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('이 사진을 삭제할까요?')) return
    try {
      await galleryApi.delete(id)
      setSelectedPhoto(null)
      loadPhotos()
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-handwriting text-3xl text-gray-600">갤러리</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="font-ui text-sm text-pink-400 hover:text-pink-500 px-3 py-1.5 border border-pink-200 rounded-full"
          >
            + 사진 추가
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="font-ui text-gray-400 text-sm">불러오는 중...</p>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-transform relative group"
              >
                <img
                  src={`${API_BASE_URL}${photo.imageUrl}`}
                  alt={photo.caption || '사진'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="text-left">
                    <p className="font-ui text-white text-xs font-bold">{photo.caption}</p>
                    <p className="font-ui text-white/70 text-xs">{formatDate(photo.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="card-pastel p-12 text-center">
            <span className="text-5xl block mb-4">📷</span>
            <p className="font-ui text-gray-400 text-sm mb-3">아직 사진이 없어요</p>
            <button onClick={() => setShowUpload(true)} className="font-ui text-sm text-pink-400 hover:text-pink-500">
              첫 번째 사진 올리기 →
            </button>
          </div>
        )}

        {/* 사진 상세 모달 */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="card-pastel p-4 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={`${API_BASE_URL}${selectedPhoto.imageUrl}`}
                alt={selectedPhoto.caption || '사진'}
                className="w-full rounded-xl mb-4 max-h-[60vh] object-contain"
              />
              {selectedPhoto.caption && (
                <h3 className="font-handwriting text-xl text-gray-600 mb-1">{selectedPhoto.caption}</h3>
              )}
              <p className="font-ui text-sm text-gray-400 mb-4">{formatDate(selectedPhoto.createdAt)}</p>
              <div className="flex gap-3">
                <button onClick={() => setSelectedPhoto(null)} className="btn-secondary text-sm">
                  닫기
                </button>
                <button
                  onClick={() => handleDelete(selectedPhoto.id!)}
                  className="btn-secondary text-sm text-red-300 border-red-100 hover:bg-red-50 hover:border-red-200"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 업로드 모달 */}
        {showUpload && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            onClick={() => { setShowUpload(false); setPreviewUrl(null); setSelectedFile(null); }}
          >
            <div className="card-pastel p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-handwriting text-xl text-gray-600 mb-4">사진 업로드</h3>

              {previewUrl ? (
                <img src={previewUrl} alt="미리보기" className="w-full rounded-xl mb-4 max-h-48 object-contain" />
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center hover:border-pink-300 transition-colors mb-4"
                >
                  <p className="text-3xl mb-2">📷</p>
                  <p className="font-ui text-sm text-gray-400">클릭해서 사진 선택</p>
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {previewUrl && (
                <button
                  onClick={() => { setPreviewUrl(null); setSelectedFile(null); fileRef.current?.click(); }}
                  className="font-ui text-xs text-pink-400 mb-3 block"
                >
                  다른 사진 선택
                </button>
              )}

              <div className="mb-4">
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">한 줄 설명</label>
                <input
                  type="text"
                  className="input-pastel"
                  placeholder="이 사진은..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowUpload(false); setPreviewUrl(null); setSelectedFile(null); }}
                  className="btn-secondary"
                >
                  취소
                </button>
                <button
                  onClick={handleUpload}
                  className="btn-primary"
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? '업로드 중...' : '업로드'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
