import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'pokedex:favorites'

interface FavoritesContextValue {
  favorites: number[]
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

const readFromStorage = (): number[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as number[]
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('No se pudo leer favoritos del storage', error)
    return []
  }
}

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>(() => readFromStorage())

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id: number) => {
    setFavorites((prev: number[]) =>
      prev.includes(id)
        ? prev.filter((favoriteId: number) => favoriteId !== id)
        : [...prev, id]
    )
  }

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite: (id: number) => favorites.includes(id)
    }),
    [favorites]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
  }
  return context
}
