"use client"

import { useCostStore } from "@/hooks/use-cost-store"

export function BottomBar() {
  const store = useCostStore()
  const appState = store.getAppState()
  const menuCosts = store.getMenuCosts()

  const cost = menuCosts[appState.menu ?? ""]?.[appState.size] ?? 0
  const profit = appState.price - cost

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[980px] items-center gap-3 px-3 py-3">
        <span className="text-xs font-bold text-muted-foreground">
          {"메뉴 카드 클릭 → 자동 원가 적용"}
        </span>
        <div
          className={`ml-auto rounded-2xl px-5 py-3 text-base font-black ${
            profit < 0
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {profit.toLocaleString()}{"원"}
        </div>
      </div>
    </div>
  )
}
