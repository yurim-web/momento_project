import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-lavender-100 rounded-full blur-3xl opacity-60" />

      <div className="text-center relative">
        <p className="font-handwriting text-8xl text-pink-300 mb-4">404</p>
        <h2 className="font-handwriting text-2xl text-gray-600 mb-2">
          길을 잃었나봐요
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          찾으시는 페이지가 없어요
        </p>
        <Link
          href="/"
          className="inline-block btn-primary !w-auto px-8 py-3"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
