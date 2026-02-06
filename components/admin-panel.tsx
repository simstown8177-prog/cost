"use client"

import { Plus, Trash2 } from "lucide-react"
import { useCostStore } from "@/hooks/use-cost-store"
import type { Ingredient, Recipe } from "@/hooks/use-cost-store"

export function AdminPanel() {
  const store = useCostStore()
  const ingredients = store.getIngredients()
  const recipes = store.getRecipes()

  // Ingredient handlers
  function addIngredient() {
    store.setIngredients([...ingredients, { name: "", price: 0 }])
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string | number) {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    store.setIngredients(updated)
  }

  function removeIngredient(index: number) {
    store.setIngredients(ingredients.filter((_, i) => i !== index))
  }

  // Recipe handlers
  function addRecipe() {
    store.setRecipes([...recipes, { menu: "", size: "M", items: [] }])
  }

  function updateRecipe(index: number, field: keyof Recipe, value: string) {
    const updated = [...recipes]
    updated[index] = { ...updated[index], [field]: value }
    store.setRecipes(updated)
  }

  function removeRecipe(index: number) {
    store.setRecipes(recipes.filter((_, i) => i !== index))
  }

  function addRecipeItem(recipeIndex: number) {
    const updated = [...recipes]
    updated[recipeIndex] = {
      ...updated[recipeIndex],
      items: [...updated[recipeIndex].items, { ing: "", qty: 0 }],
    }
    store.setRecipes(updated)
  }

  function updateRecipeItem(
    recipeIndex: number,
    itemIndex: number,
    field: "ing" | "qty",
    value: string | number
  ) {
    const updated = [...recipes]
    const items = [...updated[recipeIndex].items]
    items[itemIndex] = { ...items[itemIndex], [field]: value }
    updated[recipeIndex] = { ...updated[recipeIndex], items }
    store.setRecipes(updated)
  }

  function removeRecipeItem(recipeIndex: number, itemIndex: number) {
    const updated = [...recipes]
    updated[recipeIndex] = {
      ...updated[recipeIndex],
      items: updated[recipeIndex].items.filter((_, i) => i !== itemIndex),
    }
    store.setRecipes(updated)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Ingredients */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-base font-black text-card-foreground">
          재료 단가
        </h2>
        <div className="flex flex-col gap-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="재료명"
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                className="flex-1 rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-bold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                placeholder="단가"
                value={ing.price || ""}
                onChange={(e) =>
                  updateIngredient(i, "price", Number(e.target.value) || 0)
                }
                className="w-28 rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-bold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => removeIngredient(i)}
                className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="재료 삭제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addIngredient}
          className="mt-3 flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-black text-card-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          재료 추가
        </button>
      </div>

      {/* Recipes */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-base font-black text-card-foreground">
          메뉴 레시피
        </h2>
        <div className="flex flex-col gap-3">
          {recipes.map((recipe, ri) => (
            <div
              key={ri}
              className="rounded-2xl border border-border bg-background p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="메뉴명"
                  value={recipe.menu}
                  onChange={(e) => updateRecipe(ri, "menu", e.target.value)}
                  className="flex-1 rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-bold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <select
                  value={recipe.size}
                  onChange={(e) => updateRecipe(ri, "size", e.target.value)}
                  className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-bold text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
                <button
                  onClick={() => removeRecipe(ri)}
                  className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="레시피 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Recipe items */}
              <div className="flex flex-col gap-1.5">
                {recipe.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="재료"
                      value={item.ing}
                      onChange={(e) =>
                        updateRecipeItem(ri, ii, "ing", e.target.value)
                      }
                      className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm font-bold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="number"
                      placeholder="수량"
                      value={item.qty || ""}
                      onChange={(e) =>
                        updateRecipeItem(
                          ri,
                          ii,
                          "qty",
                          Number(e.target.value) || 0
                        )
                      }
                      className="w-20 rounded-xl border border-input bg-card px-3 py-2 text-sm font-bold text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="w-20 text-right text-xs font-bold text-muted-foreground">
                      {(item.qty * store.priceOf(item.ing)).toLocaleString()}
                      {"원"}
                    </span>
                    <button
                      onClick={() => removeRecipeItem(ri, ii)}
                      className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="재료 삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addRecipeItem(ri)}
                className="mt-2 flex items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-xs font-black text-card-foreground transition-colors hover:bg-accent"
              >
                <Plus className="h-3.5 w-3.5" />
                {"재료 추가"}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addRecipe}
          className="mt-3 flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-black text-card-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          {"메뉴 레시피 추가"}
        </button>
      </div>
    </div>
  )
}
