'use client'

import { useState } from 'react'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  idKey?: string
  searchPlaceholder?: string
  onRowClick?: (item: T) => void
  exportFileName?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  idKey = 'id',
  searchPlaceholder = 'Search records…',
  onRowClick,
  exportFileName = 'eoi_data_export.csv',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [compact, setCompact] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 15

  // Search filter
  const filtered = data.filter(item => {
    if (!search) return true
    const q = search.toLowerCase()
    return Object.values(item).some(val =>
      val !== null && val !== undefined && String(val).toLowerCase().includes(q)
    )
  })

  // Sort
  if (sortCol) {
    filtered.sort((a, b) => {
      const valA = a[sortCol]
      const valB = b[sortCol]
      if (valA === valB) return 0
      if (valA === undefined || valA === null) return 1
      if (valB === undefined || valB === null) return -1
      return (valA > valB ? 1 : -1) * (sortAsc ? 1 : -1)
    })
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleSort(key: string) {
    if (sortCol === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortCol(key)
      setSortAsc(true)
    }
  }

  function handleExportCsv() {
    if (filtered.length === 0) return
    const headers = columns.map(c => `"${c.label}"`).join(',')
    const rows = filtered.map(row =>
      columns.map(c => {
        const val = row[c.key]
        return `"${String(val ?? '').replace(/"/g, '""')}"`
      }).join(',')
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', exportFileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', overflow: 'hidden' }}>
      {/* Controls Bar */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--line)', background: 'var(--canvas)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{
              width: '100%', padding: '6px 10px 6px 30px', border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', background: 'var(--surface)',
              color: 'var(--ink)', outline: 'none', fontFamily: 'var(--font-ui)',
            }}
          />
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
            style={{ position: 'absolute', left: 10, top: 9, color: 'var(--muted)' }}
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <button
            onClick={() => setCompact(!compact)}
            style={{
              padding: '5px 10px', background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', color: 'var(--muted)',
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}
          >
            {compact ? 'Comfortable view' : 'Compact view'}
          </button>
          <button
            onClick={handleExportCsv}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
              fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1.5v6M3.5 5.5L6 8l2.5-2.5M1.5 9.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--line)' }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: compact ? '6px 12px' : '10px 14px',
                    fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted)',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable && sortCol === col.key && (
                      <span>{sortAsc ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
                  No matching records found
                </td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                <tr
                  key={item[idKey] ?? idx}
                  onClick={() => onRowClick?.(item)}
                  style={{
                    borderBottom: '1px solid var(--line)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: idx % 2 === 0 ? 'var(--surface)' : '#FAFBFC',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = 'var(--canvas)' }}
                  onMouseLeave={e => { if (onRowClick) e.currentTarget.style.background = idx % 2 === 0 ? 'var(--surface)' : '#FAFBFC' }}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        padding: compact ? '6px 12px' : '10px 14px',
                        fontSize: 'var(--text-xs)', color: 'var(--ink)',
                      }}
                    >
                      {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-4)', borderTop: '1px solid var(--line)', background: 'var(--canvas)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--muted)',
      }}>
        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records
        </span>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            style={{
              padding: '3px 8px', border: '1px solid var(--line)', borderRadius: 2,
              background: 'var(--surface)', color: 'var(--ink)', cursor: page <= 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Prev
          </button>
          <span style={{ padding: '3px 6px', fontWeight: 600 }}>{page} / {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            style={{
              padding: '3px 8px', border: '1px solid var(--line)', borderRadius: 2,
              background: 'var(--surface)', color: 'var(--ink)', cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
