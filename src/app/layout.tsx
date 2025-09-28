import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Momento',
  description: 'A blog to record our special moments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
