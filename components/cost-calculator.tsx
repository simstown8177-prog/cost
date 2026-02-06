"use client"

import { useState } from "react"
import { MenuSelector } from "@/components/menu-selector"
import { AdminPanel } from "@/components/admin-panel"
import { BottomBar } from "@/components/bottom-bar"

type Tab = "menu" | "admin"

export function CostCalculator() {
  const [tab, setTab] = useState<Tab>("menu")

  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[980px] items-center gap-3 px-3 py-3">
          <div>
            <h1 className="text-base font-black text-foreground">
              메뉴 원가 계산기
            </h1>
            <p className="text-xs font-bold text-muted-foreground">
              {"카드형 메뉴선택 · 자동 원가 · 마진율"}
            </p>
          </div>
          <nav className="ml-auto flex gap-2" aria-label="페이지 탭">
            <button
              onClick={() => setTab("menu")}
              className={`rounded-full border px-3 py-2 text-sm font-black transition-colors ${
                tab === "menu"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-card-foreground hover:bg-accent"
              }`}
            >
              메뉴선택
            </button>
            <button
              onClick={() => setTab("admin")}
              className={`rounded-full border px-3 py-2 text-sm font-black transition-colors ${
                tab === "admin"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-card-foreground hover:bg-accent"
              }`}
            >
              관리자
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[980px] px-3 pb-28 pt-4">
        {tab === "menu" ? <MenuSelector /> : <AdminPanel />}
      </main>

      {/* Bottom Bar */}
      <BottomBar />
    </>
  )
}
