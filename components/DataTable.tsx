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
    <div style={{ background: '#0F0F0F', border: '1px solid #242424', borderRadius: 'var(--r-control)', overflow: 'hidden' }}>
      {/* Controls Bar (Stitch Technical Header) */}
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid #242424', background: '#080808',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{
              width: '100%', padding: '6px 10px 6px 30px', border: '1px solid #242424',
              borderRadius: 'var(--r-badge)', fontSize: '11px', background: '#000000',
              color: '#FFFFFF', outline: 'none', fontFamily: 'var(--font-ui)',
            }}
          />
          <svg
            width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"
            style={{ position: 'absolute', left: 10, top: 8, color: 'var(--muted)' }}
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
              padding: '5px 10px', background: '#0F0F0F', border: '1px solid #242424',
              borderRadius: 'var(--r-badge)', fontSize: '11px', fontFamily: 'var(--font-mono)',
              color: 'var(--text-on-surface-variant)', cursor: 'pointer', textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {compact ? 'Comfortable' : 'Compact'}
          </button>
          <button
            onClick={handleExportCsv}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px',
              background: '#FFFFFF', border: '1px solid #FFFFFF', borderRadius: 'var(--r-badge)',
              fontSize: '11px', fontWeight: 600, color: '#000000', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1.5v6M3.5 5.5L6 8l2.5-2.5M1.5 9.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table (Stitch Ledger Matrix) */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#080808', borderBottom: '1px solid #242424' }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: compact ? '6px 12px' : '10px 14px',
                    fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 500,
                    color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable && sortCol === col.key && (
                      <span style={{ color: '#FFFFFF' }}>{sortAsc ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  No matching records found
                </td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                <tr
                  key={item[idKey] ?? idx}
                  onClick={() => onRowClick?.(item)}
                  style={{
                    borderBottom: '1px solid #1A1A1A',
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: '#000000',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0F0F0F' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000000' }}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        padding: compact ? '6px 12px' : '10px 14px',
                        fontSize: '12px', color: 'var(--text-on-surface)',
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
        padding: '10px 16px', borderTop: '1px solid #242424', background: '#080808',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px',
        fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records
        </span>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            style={{
              padding: '3px 8px', border: '1px solid #242424', borderRadius: 2,
              background: '#0F0F0F', color: page <= 1 ? 'var(--text-disabled)' : '#FFFFFF',
              cursor: page <= 1 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-mono)',
            }}
          >
            ← Prev
          </button>
          <span style={{ padding: '3px 6px', fontWeight: 600, color: '#FFFFFF' }}>{page} / {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            style={{
              padding: '3px 8px', border: '1px solid #242424', borderRadius: 2,
              background: '#0F0F0F', color: page >= totalPages ? 'var(--text-disabled)' : '#FFFFFF',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-mono)',
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
