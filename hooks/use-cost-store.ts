import { useCallback, useSyncExternalStore } from "react"

export interface Ingredient {
  name: string
  price: number
}

export interface RecipeItem {
  ing: string
  qty: number
}

export interface Recipe {
  menu: string
  size: string
  items: RecipeItem[]
}

export interface AppState {
  menu: string | null
  size: string
  price: number
}

const STORAGE_KEYS = {
  ING: "ING",
  REC: "REC",
  STATE: "STATE",
} as const

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// Simple external store for cross-component reactivity
let listeners: Array<() => void> = []
let snapshot = 0

function emitChange() {
  snapshot++
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot() {
  return snapshot
}

function getServerSnapshot() {
  return 0
}

export function useCostStore() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const getIngredients = useCallback((): Ingredient[] => {
    return loadFromStorage<Ingredient[]>(STORAGE_KEYS.ING, [])
  }, [])

  const setIngredients = useCallback((ingredients: Ingredient[]) => {
    saveToStorage(STORAGE_KEYS.ING, ingredients)
    emitChange()
  }, [])

  const getRecipes = useCallback((): Recipe[] => {
    return loadFromStorage<Recipe[]>(STORAGE_KEYS.REC, [])
  }, [])

  const setRecipes = useCallback((recipes: Recipe[]) => {
    saveToStorage(STORAGE_KEYS.REC, recipes)
    emitChange()
  }, [])

  const getAppState = useCallback((): AppState => {
    return loadFromStorage<AppState>(STORAGE_KEYS.STATE, {
      menu: null,
      size: "M",
      price: 0,
    })
  }, [])

  const setAppState = useCallback((state: AppState) => {
    saveToStorage(STORAGE_KEYS.STATE, state)
    emitChange()
  }, [])

  const priceOf = useCallback(
    (ingredientName: string): number => {
      const ingredients = getIngredients()
      const found = ingredients.find((i) => i.name === ingredientName)
      return found ? +found.price : 0
    },
    [getIngredients]
  )

  const getMenuCosts = useCallback((): Record<string, Record<string, number>> => {
    const recipes = getRecipes()
    const menuMap: Record<string, Record<string, number>> = {}
    recipes.forEach((r) => {
      if (!menuMap[r.menu]) menuMap[r.menu] = {}
      menuMap[r.menu][r.size] = r.items.reduce(
        (sum, item) => sum + item.qty * priceOf(item.ing),
        0
      )
    })
    return menuMap
  }, [getRecipes, priceOf])

  return {
    getIngredients,
    setIngredients,
    getRecipes,
    setRecipes,
    getAppState,
    setAppState,
    priceOf,
    getMenuCosts,
  }
}
