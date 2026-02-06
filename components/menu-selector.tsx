"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useCostStore } from "@/hooks/use-cost-store"

export function MenuSelector() {
  const store = useCostStore()
  const [search, setSearch] = useState("")

  const appState = store.getAppState()
  const menuCosts = store.getMenuCosts()
  const menuNames = Object.keys(menuCosts).filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  )

  const cost = menuCosts[appState.menu ?? ""]?.[appState.size] ?? 0
  const price = appState.price
  const profit = price - cost
  const marginPercent = price > 0 ? ((profit / price) * 100).toFixed(1) : "-"

  function selectMenu(name: string) {
    store.setAppState({ ...appState, menu: name })
  }

  function setSize(size: string) {
    store.setAppState({ ...appState, size })
  }

  function setPrice(value: number) {
    store.setAppState({ ...appState, price: value })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Menu Selection Card */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-base font-black text-card-foreground">
          메뉴 선택
        </h2>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="메뉴 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm font-bold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {menuNames.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {"관리자 탭에서 메뉴 레시피를 추가해주세요"}
            </p>
          )}
          {menuNames.map((name) => (
            <button
              key={name}
              onClick={() => selectMenu(name)}
              className={`min-w-[180px] shrink-0 rounded-2xl border-2 p-4 text-left transition-colors ${
                appState.menu === name
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="text-base font-black text-card-foreground">
                {name}
              </div>
              <div className="mt-1.5 text-sm font-bold text-muted-foreground">
                {"기본원가 "}
                {(
                  menuCosts[name]?.[appState.size] ?? 0
                ).toLocaleString()}
                {"원"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls & Summary */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Size Selector */}
          <div className="flex gap-2">
            {["S", "M", "L"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border-2 px-4 py-2.5 text-sm font-black transition-colors ${
                  appState.size === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-card-foreground hover:border-primary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Manual Price */}
          <input
            type="number"
            placeholder="판매가(수기)"
            value={appState.price || ""}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-bold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard label="기본원가" value={`${cost.toLocaleString()}원`} />
          <SummaryCard
            label="판매가"
            value={`${price.toLocaleString()}원`}
          />
          <SummaryCard
            label="실마진"
            value={`${profit.toLocaleString()}원`}
            negative={profit < 0}
          />
          <SummaryCard
            label="마진율"
            value={typeof marginPercent === "string" ? marginPercent : `${marginPercent}%`}
            negative={profit < 0}
          />
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  negative,
}: {
  label: string
  value: string
  negative?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
      <div
        className={`mt-1 text-lg font-black ${
          negative ? "text-destructive" : "text-card-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  )
}
