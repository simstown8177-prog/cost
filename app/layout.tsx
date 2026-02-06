import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const notoSansKR = Noto_Sans_KR({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "메뉴 원가 계산기",
  description: "카드형 메뉴 선택, 자동 원가 계산, 마진율 분석 도구",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10cfc9",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>{children}</body>
    </html>
  )
}
