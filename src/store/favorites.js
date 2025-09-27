import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const STORAGE_KEY = 'pokedex:favorites';
const FavoritesContext = createContext(undefined);
const readFromStorage = () => {
    if (typeof window === 'undefined')
        return [];
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored)
            return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (error) {
        console.warn('No se pudo leer favoritos del storage', error);
        return [];
    }
};
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => readFromStorage());
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);
    const toggleFavorite = (id) => {
        setFavorites((prev) => prev.includes(id)
            ? prev.filter((favoriteId) => favoriteId !== id)
            : [...prev, id]);
    };
    const value = useMemo(() => ({
        favorites,
        toggleFavorite,
        isFavorite: (id) => favorites.includes(id)
    }), [favorites]);
    return _jsx(FavoritesContext.Provider, { value: value, children: children });
};
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
    }
    return context;
};
