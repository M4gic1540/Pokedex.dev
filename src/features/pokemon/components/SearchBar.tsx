import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { usePokemonAutocomplete } from '../hooks/usePokemonAutocomplete'

interface SearchBarProps {
  value: string
  onSubmit: (term: string) => void
  onClear: () => void
}

const formatSuggestionLabel = (name: string, id: number) => `#${id.toString().padStart(3, '0')} · ${name}`

export const SearchBar = ({ value, onSubmit, onClear }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()
  const optionIdPrefix = useId()

  const { data: suggestions = [], isLoading } = usePokemonAutocomplete(inputValue)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleGlobalShortcut)
    return () => window.removeEventListener('keydown', handleGlobalShortcut)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setHighlightIndex(-1)
      return
    }

    setHighlightIndex(suggestions.length > 0 ? 0 : -1)
  }, [suggestions, isOpen])

  const handleSubmit = (term: string) => {
    const normalized = term.trim().toLowerCase()
    onSubmit(normalized)
    setIsOpen(false)
  }

  const selectSuggestion = (index: number) => {
    const suggestion = suggestions[index]
    if (!suggestion) return
    handleSubmit(suggestion.name)
  }

  const suggestionItems = useMemo(
    () =>
      suggestions.map((suggestion, index) => ({
        id: `${optionIdPrefix}-${suggestion.id}`,
        label: formatSuggestionLabel(suggestion.name, suggestion.id),
        value: suggestion.name,
        index
      })),
    [suggestions, optionIdPrefix]
  )

  return (
    <div className="relative">
      <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Búsqueda global
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="search"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // Delay to allow click selection
              setTimeout(() => setIsOpen(false), 120)
            }}
            onKeyDown={(event) => {
              switch (event.key) {
                case 'ArrowDown':
                  event.preventDefault()
                  setIsOpen(true)
                  setHighlightIndex((prev) => {
                    const next = prev + 1
                    return next >= suggestions.length ? 0 : next
                  })
                  break
                case 'ArrowUp':
                  event.preventDefault()
                  setIsOpen(true)
                  setHighlightIndex((prev) => {
                    const next = prev - 1
                    return next < 0 ? suggestions.length - 1 : next
                  })
                  break
                case 'Enter':
                  event.preventDefault()
                  if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
                    selectSuggestion(highlightIndex)
                  } else {
                    handleSubmit(inputValue)
                  }
                  break
                case 'Escape':
                  event.preventDefault()
                  if (inputValue) {
                    setInputValue('')
                    onClear()
                  }
                  setIsOpen(false)
                  break
              }
            }}
            placeholder="Buscar por nombre o número (Ctrl + K)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
            role="combobox"
            aria-owns={listboxId}
            aria-controls={listboxId}
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-activedescendant={
              highlightIndex >= 0 && suggestionItems[highlightIndex]
                ? suggestionItems[highlightIndex].id
                : undefined
            }
          />
          {inputValue ? (
            <button
              type="button"
              onClick={() => {
                setInputValue('')
                onClear()
                inputRef.current?.focus()
              }}
              className="rounded-md border border-transparent px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-amber-300"
            >
              Limpiar
            </button>
          ) : null}
        </div>
      </label>

      {isOpen ? (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/95 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500">
            <span>
              {isLoading
                ? 'Buscando…'
                : suggestions.length > 0
                ? `${suggestions.length} sugerencias`
                : 'Sin coincidencias'}
            </span>
            <span className="hidden gap-2 sm:flex">
              <kbd className="rounded bg-slate-800 px-2 py-0.5 text-[10px]">↑↓</kbd>
              <kbd className="rounded bg-slate-800 px-2 py-0.5 text-[10px]">Enter</kbd>
              <kbd className="rounded bg-slate-800 px-2 py-0.5 text-[10px]">Esc</kbd>
            </span>
          </div>
          <ul role="listbox" id={listboxId} className="max-h-64 overflow-auto border-t border-slate-800">
            {suggestionItems.map((item, index) => (
              <li
                key={item.id}
                id={item.id}
                role="option"
                aria-selected={highlightIndex === index}
                className={`cursor-pointer px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/60 ${
                  highlightIndex === index ? 'bg-slate-800/60' : ''
                }`}
                onMouseEnter={() => setHighlightIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  selectSuggestion(index)
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
