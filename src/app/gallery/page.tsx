'use client'

import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import { useState, useEffect, useRef } from 'react'

interface PhotoData {
  id: number
  imageUrl: string
  caption: string
  authorEmail: string
  createdAt: string
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  useEffect(() => {
    setPhotos(JSON.parse(localStorage.getItem('momento_gallery') || '[]'))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUpload = () => {
    if (!selectedFile) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      const email = localStorage.getItem('userEmail') || ''
      const newPhoto: PhotoData = {
        id: Date.now(),
        imageUrl: reader.result as string,
        caption,
        authorEmail: email,
        createdAt: new Date().toISOString(),
      }
      const updated = [newPhoto, ...photos]
      setPhotos(updated)
      localStorage.setItem('momento_gallery', JSON.stringify(updated))
      setShowUpload(false)
      setCaption('')
      setSelectedFile(null)
      setPreviewUrl(null)
      setUploading(false)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDelete = (id: number) => {
    const updated = photos.filter(p => p.id !== id)
    setPhotos(updated)
    localStorage.setItem('momento_gallery', JSON.stringify(updated))
    setSelectedPhoto(null)
    setDeleteTargetId(null)
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
          <button onClick={() => setShowUpload(true)} className="font-ui text-sm text-pink-400 hover:text-pink-500 px-3 py-1.5 border border-pink-200 rounded-full">
            + 사진 추가
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
            {photos.map((photo) => (
              <button key={photo.id} onClick={() => setSelectedPhoto(photo)}
                className="aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-transform relative group">
                <img src={photo.imageUrl} alt={photo.caption || '사진'} className="w-full h-full object-cover" />
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
            <span className="text-5xl block mb-4">🌷</span>
            <p className="font-ui text-gray-400 text-sm mb-3">아직 사진이 없어요</p>
            <button onClick={() => setShowUpload(true)} className="font-ui text-sm text-pink-400 hover:text-pink-500">
              첫 번째 사진 올리기 →
            </button>
          </div>
        )}

        {/* 사진 상세 모달 */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setSelectedPhoto(null)}>
            <div className="card-pastel p-4 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.caption || '사진'} className="w-full rounded-xl mb-4 max-h-[60vh] object-contain" />
              {selectedPhoto.caption && (
                <h3 className="font-handwriting text-xl text-gray-600 mb-1">{selectedPhoto.caption}</h3>
              )}
              <p className="font-ui text-sm text-gray-400 mb-4">{formatDate(selectedPhoto.createdAt)}</p>
              <div className="flex gap-3">
                <button onClick={() => setSelectedPhoto(null)} className="btn-secondary text-sm">닫기</button>
                <button onClick={() => setDeleteTargetId(selectedPhoto.id)} className="btn-secondary text-sm text-red-300 border-red-100 hover:bg-red-50 hover:border-red-200">삭제</button>
              </div>
            </div>
          </div>
        )}

        {/* 업로드 모달 */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            onClick={() => { setShowUpload(false); setPreviewUrl(null); setSelectedFile(null) }}>
            <div className="card-pastel p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-handwriting text-xl text-gray-600 mb-4">사진 업로드</h3>

              {previewUrl ? (
                <img src={previewUrl} alt="미리보기" className="w-full rounded-xl mb-4 max-h-48 object-contain" />
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center hover:border-pink-300 transition-colors mb-4">
                  <p className="text-3xl mb-2">🌷</p>
                  <p className="font-ui text-sm text-gray-400">클릭해서 사진 선택</p>
                </button>
              )}

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

              {previewUrl && (
                <button onClick={() => { setPreviewUrl(null); setSelectedFile(null); fileRef.current?.click() }}
                  className="font-ui text-xs text-pink-400 mb-3 block">
                  다른 사진 선택
                </button>
              )}

              <div className="mb-4">
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">한 줄 설명</label>
                <input type="text" className="input-pastel" placeholder="이 사진은..." value={caption} onChange={(e) => setCaption(e.target.value)} />
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowUpload(false); setPreviewUrl(null); setSelectedFile(null) }} className="btn-secondary">취소</button>
                <button onClick={handleUpload} className="btn-primary" disabled={!selectedFile || uploading}>
                  {uploading ? '업로드 중...' : '업로드'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {deleteTargetId !== null && (
        <Modal
          type="confirm"
          title="사진을 삭제할까요?"
          message="삭제하면 되돌릴 수 없어요"
          confirmText="삭제하기"
          cancelText="취소"
          onConfirm={() => handleDelete(deleteTargetId)}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  )
}
