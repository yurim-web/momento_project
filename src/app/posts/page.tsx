'use client'

import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PostData } from '@/lib/api'

interface MemoData {
  id: string
  title: string
  content: string
  color: 'pink' | 'lavender' | 'mint' | 'yellow'
  authorName: string
  authorEmail: string
  createdAt: string
  pinned?: boolean
}

interface MemoComment {
  id: string
  memoId: string
  content: string
  authorName: string
  authorEmail: string
  createdAt: string
}

const postCategories = ['전체', '데이트', '여행', '기념일', '일상', '맛집']

const memoColors: { key: MemoData['color']; bg: string; border: string; dot: string; selected: string }[] = [
  { key: 'pink',     bg: 'bg-pink-50',     border: 'border-pink-200',     dot: 'bg-pink-300',     selected: 'border-pink-400' },
  { key: 'lavender', bg: 'bg-lavender-50', border: 'border-lavender-200', dot: 'bg-lavender-300', selected: 'border-lavender-400' },
  { key: 'mint',     bg: 'bg-mint-50',     border: 'border-mint-200',     dot: 'bg-mint-300',     selected: 'border-mint-400' },
  { key: 'yellow',   bg: 'bg-yellow-50',   border: 'border-yellow-200',   dot: 'bg-yellow-300',   selected: 'border-yellow-400' },
]

const generateId = () => Math.random().toString(36).substring(2, 9)

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${date} ${time}`
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function PostsPage() {
  const [tab, setTab] = useState<'posts' | 'memo'>('posts')

  // 게시글
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [posts, setPosts] = useState<PostData[]>([])

  // 메모
  const [memos, setMemos] = useState<MemoData[]>([])
  const [showAddMemo, setShowAddMemo] = useState(false)
  const [editMemo, setEditMemo] = useState<MemoData | null>(null)
  const [deleteMemoId, setDeleteMemoId] = useState<string | null>(null)
  const [memoForm, setMemoForm] = useState({ title: '', content: '', color: 'pink' as MemoData['color'] })

  // 메모 상세 + 댓글
  const [detailMemo, setDetailMemo] = useState<MemoData | null>(null)
  const [comments, setComments] = useState<MemoComment[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const all: PostData[] = JSON.parse(localStorage.getItem('momento_posts') || '[]')
    setPosts(selectedCategory === '전체' ? all : all.filter(p => p.category === selectedCategory))
  }, [selectedCategory])

  useEffect(() => {
    setMemos(JSON.parse(localStorage.getItem('momento_memos') || '[]'))
  }, [])

  const saveMemos = (updated: MemoData[]) => {
    setMemos(updated)
    localStorage.setItem('momento_memos', JSON.stringify(updated))
  }

  const openDetail = (memo: MemoData) => {
    setDetailMemo(memo)
    const all: MemoComment[] = JSON.parse(localStorage.getItem('momento_memo_comments') || '[]')
    setComments(all.filter(c => c.memoId === memo.id))
    setNewComment('')
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !detailMemo) return
    const authorName = localStorage.getItem('userName') || '나'
    const authorEmail = localStorage.getItem('userEmail') || ''
    const comment: MemoComment = {
      id: generateId(),
      memoId: detailMemo.id,
      content: newComment,
      authorName,
      authorEmail,
      createdAt: new Date().toISOString(),
    }
    const all: MemoComment[] = JSON.parse(localStorage.getItem('momento_memo_comments') || '[]')
    const updated = [...all, comment]
    localStorage.setItem('momento_memo_comments', JSON.stringify(updated))
    setComments(updated.filter(c => c.memoId === detailMemo.id))
    setNewComment('')
  }

  const openAddMemo = () => {
    setMemoForm({ title: '', content: '', color: 'pink' })
    setEditMemo(null)
    setShowAddMemo(true)
  }

  const openEditMemo = (memo: MemoData) => {
    setMemoForm({ title: memo.title, content: memo.content, color: memo.color })
    setEditMemo(memo)
    setDetailMemo(null)
    setShowAddMemo(true)
  }

  const handleSaveMemo = () => {
    if (!memoForm.content.trim()) return
    const authorName = localStorage.getItem('userName') || '나'
    const authorEmail = localStorage.getItem('userEmail') || ''
    if (editMemo) {
      saveMemos(memos.map(m => m.id === editMemo.id ? { ...editMemo, ...memoForm } : m))
    } else {
      const item: MemoData = {
        id: generateId(),
        ...memoForm,
        authorName,
        authorEmail,
        createdAt: new Date().toISOString(),
      }
      saveMemos([item, ...memos])
    }
    setShowAddMemo(false)
    setEditMemo(null)
  }

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    saveMemos(memos.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m))
  }

  const handleDeleteMemo = (id: string) => {
    saveMemos(memos.filter(m => m.id !== id))
    const all: MemoComment[] = JSON.parse(localStorage.getItem('momento_memo_comments') || '[]')
    localStorage.setItem('momento_memo_comments', JSON.stringify(all.filter(c => c.memoId !== id)))
    setDeleteMemoId(null)
    setDetailMemo(null)
  }

  const colorFor = (key: MemoData['color']) => memoColors.find(c => c.key === key) ?? memoColors[0]

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-handwriting text-3xl text-gray-600">우리의 이야기</h1>
          {tab === 'posts' ? (
            <Link href="/posts/new" className="font-ui text-sm text-pink-400 hover:text-pink-500 px-3 py-1.5 border border-pink-200 rounded-full">
              + 글쓰기
            </Link>
          ) : (
            <button onClick={openAddMemo} className="font-ui text-sm text-pink-400 hover:text-pink-500 px-3 py-1.5 border border-pink-200 rounded-full">
              + 메모 추가
            </button>
          )}
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          {([['posts', '📝 게시글'], ['memo', '🗒️ 메모']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
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

        {/* ══════════ 게시글 탭 ══════════ */}
        {tab === 'posts' && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {postCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-ui whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-pink-300 text-white'
                      : 'bg-white text-gray-400 border border-pink-100 hover:border-pink-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-2">✏️</p>
                <p className="text-gray-400">아직 이야기가 없어요</p>
                <Link href="/posts/new" className="text-sm text-pink-400 hover:text-pink-500 mt-2 inline-block">
                  첫 번째 이야기를 작성해보세요
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`} className="block">
                    <article className="card-pastel p-5 hover:scale-[1.01] transition-transform">
                      <div className="flex items-start justify-between mb-2">
                        <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-400">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-600 mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{post.content}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-lavender-400">by {post.authorName}</span>
                        {post.location && <span className="text-xs text-mint-400">📍 {post.location}</span>}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════ 메모 탭 ══════════ */}
        {tab === 'memo' && (
          <>
            {memos.length === 0 ? (
              <div className="card-pastel p-12 text-center">
                <span className="text-5xl block mb-4">🗒️</span>
                <p className="font-ui text-gray-400 text-sm mb-3">아직 메모가 없어요</p>
                <button onClick={openAddMemo} className="font-ui text-sm text-pink-400 hover:text-pink-500">
                  맛집, 할 말, 기억할 것들을 메모해보세요 →
                </button>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                {memos.map(memo => {
                  const c = colorFor(memo.color)
                  const commentCount = JSON.parse(localStorage.getItem('momento_memo_comments') || '[]').filter((cc: MemoComment) => cc.memoId === memo.id).length
                  return (
                    <div
                      key={memo.id}
                      className={`break-inside-avoid rounded-2xl border-2 p-4 ${c.bg} ${c.border} cursor-pointer hover:scale-[1.02] transition-transform`}
                      onClick={() => openDetail(memo)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${c.dot}`} />
                          {memo.pinned && <span className="text-xs">📌</span>}
                        </div>
                        <div className="flex items-center gap-1.5 -mt-0.5">
                          <button
                            onClick={(e) => handleTogglePin(memo.id, e)}
                            className={`text-xs transition-colors ${memo.pinned ? 'text-pink-400' : 'text-gray-200 hover:text-gray-400'}`}
                            title={memo.pinned ? '고정 해제' : '대시보드에 고정'}
                          >
                            {memo.pinned ? '📌' : '📍'}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteMemoId(memo.id) }}
                            className="text-xs text-gray-300 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      {memo.title && (
                        <p className="font-ui text-sm font-bold text-gray-600 mb-1.5">{memo.title}</p>
                      )}
                      <p className="font-ui text-sm text-gray-500 leading-relaxed whitespace-pre-wrap line-clamp-4">{memo.content}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-ui text-xs text-gray-400">{memo.authorName}</span>
                        {commentCount > 0 && (
                          <span className="font-ui text-xs text-gray-300">💬 {commentCount}</span>
                        )}
                      </div>
                      <p className="font-ui text-xs text-gray-300 mt-1">{formatDateTime(memo.createdAt)}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── 메모 상세 모달 ── */}
      {detailMemo && (() => {
        const c = colorFor(detailMemo.color)
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 px-0 sm:px-4" onClick={() => setDetailMemo(null)}>
            <div
              className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-2 ${c.bg} ${c.border} flex flex-col max-h-[85vh]`}
              onClick={e => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 ${c.dot}`} />
                  <div className="flex gap-3">
                    <button onClick={() => openEditMemo(detailMemo)} className="font-ui text-xs text-gray-400 hover:text-gray-600">수정</button>
                    <button onClick={() => setDeleteMemoId(detailMemo.id)} className="font-ui text-xs text-red-300 hover:text-red-400">삭제</button>
                    <button onClick={() => setDetailMemo(null)} className="font-ui text-xs text-gray-300 hover:text-gray-500">닫기</button>
                  </div>
                </div>
                {detailMemo.title && (
                  <h3 className="font-ui text-base font-bold text-gray-600 mt-2 mb-1">{detailMemo.title}</h3>
                )}
                <p className="font-ui text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{detailMemo.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-ui text-xs text-gray-400">{detailMemo.authorName}</span>
                  <span className="font-ui text-xs text-gray-300">{formatDateTime(detailMemo.createdAt)}</span>
                </div>
              </div>

              {/* 댓글 구분선 */}
              <div className={`mx-5 border-t ${c.border}`} />

              {/* 댓글 목록 */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 min-h-0">
                {comments.length === 0 ? (
                  <p className="font-ui text-xs text-gray-300 text-center py-3">첫 댓글을 남겨보세요 ♡</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="bg-white/60 rounded-xl px-3 py-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-ui text-xs font-bold text-gray-500">{c.authorName}</span>
                        <span className="font-ui text-xs text-gray-300">{formatDateTime(c.createdAt)}</span>
                      </div>
                      <p className="font-ui text-sm text-gray-500">{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* 댓글 입력 */}
              <div className={`p-4 border-t ${c.border} flex gap-2`}>
                <input
                  type="text"
                  className="flex-1 bg-white/70 border border-white/80 rounded-xl px-3 py-2 text-sm font-ui text-gray-600 placeholder-gray-300 outline-none focus:border-pink-200"
                  placeholder="댓글 남기기..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 bg-pink-300 text-white rounded-xl text-sm font-ui disabled:opacity-40 hover:bg-pink-400 transition-colors"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── 메모 추가/수정 모달 ── */}
      {showAddMemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setShowAddMemo(false)}>
          <div className="card-pastel p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-handwriting text-xl text-gray-600 mb-4">
              {editMemo ? '메모 수정' : '메모 추가'}
            </h3>

            <div className="flex gap-2 mb-4">
              {memoColors.map(c => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setMemoForm({ ...memoForm, color: c.key })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${c.dot} ${
                    memoForm.color === c.key ? `scale-125 ${c.selected}` : 'border-transparent hover:scale-110'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">제목 (선택)</label>
                <input
                  type="text"
                  className="input-pastel"
                  placeholder="메모 제목"
                  value={memoForm.title}
                  onChange={e => setMemoForm({ ...memoForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="font-ui block text-sm text-pink-400 mb-1.5 ml-1">내용 *</label>
                <textarea
                  className="input-pastel resize-none"
                  rows={5}
                  placeholder="기억하고 싶은 것들을 적어요&#10;맛집, 할 말, 기념일 선물 아이디어..."
                  value={memoForm.content}
                  onChange={e => setMemoForm({ ...memoForm, content: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowAddMemo(false); setEditMemo(null) }} className="btn-secondary">취소</button>
              <button onClick={handleSaveMemo} className="btn-primary" disabled={!memoForm.content.trim()}>
                {editMemo ? '수정하기' : '저장하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteMemoId && (
        <Modal
          type="confirm"
          title="메모를 삭제할까요?"
          message="삭제하면 되돌릴 수 없어요"
          confirmText="삭제하기"
          cancelText="취소"
          onConfirm={() => handleDeleteMemo(deleteMemoId)}
          onCancel={() => setDeleteMemoId(null)}
        />
      )}
    </div>
  )
}
