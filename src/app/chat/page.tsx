'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect, useRef } from 'react'

interface ChatMessage {
  id: number
  senderEmail: string
  senderName: string
  content: string
  createdAt: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [myEmail, setMyEmail] = useState('')
  const [myName, setMyName] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMyEmail(localStorage.getItem('userEmail') || '')
    setMyName(localStorage.getItem('userName') || '')
    setMessages(JSON.parse(localStorage.getItem('momento_chat') || '[]'))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMsg: ChatMessage = {
      id: Date.now(),
      senderEmail: myEmail,
      senderName: myName,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    }
    const updated = [...messages, newMsg]
    setMessages(updated)
    localStorage.setItem('momento_chat', JSON.stringify(updated))
    setInput('')
    inputRef.current?.focus()
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? '오후' : '오전'
    return `${ampm} ${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m}`
  }

  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  let lastDateKey = ''

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <div className="px-4 py-3 border-b border-pink-100 bg-white/50">
          <h1 className="font-handwriting text-2xl text-gray-600 text-center">둘만의 비밀 채팅</h1>
          <p className="font-ui text-xs text-gray-400 text-center">💕 여기서 나눈 이야기는 둘만의 비밀이에요</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">💌</p>
              <p className="font-handwriting text-lg text-gray-400">첫 번째 메시지를 보내보세요</p>
              <p className="font-ui text-xs text-gray-300 mt-1">둘만의 비밀 대화가 시작돼요</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderEmail === myEmail
              const dateKey = new Date(msg.createdAt).toISOString().split('T')[0]
              let showDateHeader = false
              if (dateKey !== lastDateKey) {
                showDateHeader = true
                lastDateKey = dateKey
              }

              return (
                <div key={msg.id}>
                  {showDateHeader && (
                    <div className="text-center my-4">
                      <span className="font-ui text-xs text-gray-400 bg-cream-50 px-3 py-1 rounded-full border border-pink-100">
                        {formatDateHeader(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-lavender-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-handwriting text-xs text-lavender-400">{msg.senderName[0]}</span>
                      </div>
                    )}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && (
                        <span className="font-ui text-xs text-gray-400 mb-1 ml-1">{msg.senderName}</span>
                      )}
                      <div className={`max-w-[75vw] sm:max-w-[320px] px-4 py-2.5 rounded-2xl font-ui text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-pink-200 to-lavender-200 text-gray-700 rounded-br-md'
                          : 'bg-white border border-pink-100 text-gray-600 rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="font-ui text-xs text-gray-300 mt-1 mx-1">{formatTime(msg.createdAt)}</span>
                    </div>
                    {isMe && (
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-handwriting text-xs text-pink-400">{msg.senderName[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-pink-100 bg-white/80 backdrop-blur-sm mb-16 md:mb-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              className="input-pastel flex-1 !rounded-full"
              placeholder="메시지를 입력해주세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-300 to-lavender-300 text-white flex items-center justify-center hover:from-pink-400 hover:to-lavender-400 transition-all disabled:opacity-50 flex-shrink-0"
            >
              ♥
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
