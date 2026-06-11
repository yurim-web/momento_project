'use client'

import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostData, CommentData } from '@/lib/api'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.id)
  const [post, setPost] = useState<PostData | null>(null)
  const [comments, setComments] = useState<CommentData[]>([])
  const [newComment, setNewComment] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const posts: PostData[] = JSON.parse(localStorage.getItem('momento_posts') || '[]')
    setPost(posts.find(p => p.id === postId) || null)

    const allComments: CommentData[] = JSON.parse(localStorage.getItem('momento_comments') || '[]')
    setComments(allComments.filter(c => c.postId === postId))
  }, [postId])

  const handleDelete = () => {
    const posts: PostData[] = JSON.parse(localStorage.getItem('momento_posts') || '[]')
    localStorage.setItem('momento_posts', JSON.stringify(posts.filter(p => p.id !== postId)))
    router.push('/posts')
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return
    const email = localStorage.getItem('userEmail') || ''
    const name = localStorage.getItem('userName') || ''
    const allComments: CommentData[] = JSON.parse(localStorage.getItem('momento_comments') || '[]')
    const comment: CommentData = {
      id: Date.now(),
      postId,
      content: newComment,
      authorEmail: email,
      authorName: name,
      createdAt: new Date().toISOString(),
    }
    const updated = [...allComments, comment]
    localStorage.setItem('momento_comments', JSON.stringify(updated))
    setComments(updated.filter(c => c.postId === postId))
    setNewComment('')
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  if (!post) return <div className="min-h-screen bg-cream-50"><Navbar /><p className="text-center py-12 text-gray-400">게시글을 찾을 수 없습니다.</p></div>

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <Link href="/posts" className="inline-block text-sm text-pink-400 hover:text-pink-500 mb-4">
          ← 목록으로
        </Link>

        <article className="card-pastel p-6 md:p-8">
          <div className="mb-6">
            <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-400 mb-3">
              {post.category}
            </span>
            <h1 className="font-handwriting text-3xl text-gray-600 mb-3">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{formatDate(post.createdAt)}</span>
              {post.location && <span>📍 {post.location}</span>}
              <span className="text-lavender-400">by {post.authorName}</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-3">
                {line || <br />}
              </p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-pink-100 flex gap-3">
            <Link href={`/posts/${post.id}/edit`} className="btn-secondary text-center text-sm">
              수정하기
            </Link>
            <button onClick={() => setShowDeleteModal(true)} className="btn-secondary text-sm text-red-300 border-red-100 hover:bg-red-50 hover:border-red-200">
              삭제하기
            </button>
          </div>
        </article>

        <section className="mt-6">
          <h3 className="font-handwriting text-xl text-gray-600 mb-4">댓글 ♡</h3>
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">아직 댓글이 없어요</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="card-pastel p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-lavender-400 font-bold">{comment.authorName}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="input-pastel flex-1"
              placeholder="댓글을 남겨주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <button onClick={handleCommentSubmit} className="px-5 bg-pink-300 text-white rounded-xl hover:bg-pink-400 transition-colors text-sm">
              작성
            </button>
          </div>
        </section>
      </main>

      {showDeleteModal && (
        <Modal
          type="confirm"
          title="게시글을 삭제할까요?"
          message="삭제하면 되돌릴 수 없어요"
          confirmText="삭제하기"
          cancelText="취소"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}
