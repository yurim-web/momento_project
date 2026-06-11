'use client'

interface ModalProps {
  type: 'alert' | 'confirm'
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
}

export default function Modal({
  type,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={type === 'alert' ? onConfirm : onCancel}
      />

      {/* 모달 카드 */}
      <div className="relative card-pastel p-7 w-full max-w-sm text-center animate-modal">
        {/* 아이콘 */}
        <div className="text-4xl mb-3">
          {type === 'confirm' ? '🥺' : '✨'}
        </div>

        {/* 제목 */}
        <h3 className="font-handwriting text-xl text-gray-600 mb-2">{title}</h3>

        {/* 메시지 */}
        {message && (
          <p className="font-ui text-sm text-gray-400 mb-6">{message}</p>
        )}
        {!message && <div className="mb-6" />}

        {/* 버튼 */}
        {type === 'confirm' ? (
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-2xl border-2 border-pink-100 text-gray-400 font-ui text-sm hover:bg-pink-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-ui text-sm font-bold hover:from-pink-400 hover:to-lavender-400 transition-all"
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            onClick={onConfirm}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-300 to-lavender-300 text-white font-ui text-sm font-bold hover:from-pink-400 hover:to-lavender-400 transition-all"
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  )
}
