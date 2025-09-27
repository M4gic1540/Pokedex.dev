interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export const Pagination = ({ page, totalPages, onPageChange, isLoading = false }: PaginationProps) => {
  const canGoBack = page > 0
  const canGoForward = page < totalPages - 1

  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-6">
      <button
        type="button"
        className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoBack || isLoading}
      >
        Anterior
      </button>

      <div className="text-sm text-slate-400">
        Página <span className="text-slate-100">{page + 1}</span> de <span className="text-slate-100">{totalPages}</span>
      </div>

      <button
        type="button"
        className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoForward || isLoading}
      >
        Siguiente
      </button>
    </div>
  )
}
