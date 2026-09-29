'use client'

import { useEffect, useState } from 'react'

export function KioskLockdown() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const showSecurityAlert = (msg: string) => {
      setToastMessage(msg)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setToastMessage(null)
      }, 2400)
    }

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      showSecurityAlert('Zero Trust Security: Right-click inspection is disabled')
    }

    // 2. Intercept DevTools & Source Inspection Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey
      const key = e.key ? e.key.toLowerCase() : ''

      // F12 DevTools
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        e.stopPropagation()
        showSecurityAlert('Zero Trust Security: Developer tools shortcut (F12) is disabled')
        return
      }

      // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
      if (isCtrlOrMeta && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        e.preventDefault()
        e.stopPropagation()
        showSecurityAlert(`Zero Trust Security: Inspect shortcut (${e.ctrlKey ? 'Ctrl' : 'Cmd'}+Shift+${key.toUpperCase()}) is disabled`)
        return
      }

      // Ctrl+U (View Source)
      if (isCtrlOrMeta && key === 'u') {
        e.preventDefault()
        e.stopPropagation()
        showSecurityAlert(`Zero Trust Security: View page source is disabled`)
        return
      }

      // Ctrl+S (Save Page)
      if (isCtrlOrMeta && key === 's') {
        e.preventDefault()
        e.stopPropagation()
        showSecurityAlert(`Zero Trust Security: Page saving is disabled`)
        return
      }
    }

    // Attach document-level listeners with capture phase for absolute interception
    document.addEventListener('contextmenu', handleContextMenu, { capture: true })
    window.addEventListener('keydown', handleKeyDown, { capture: true })

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      clearTimeout(timeoutId)
    }
  }, [])

  if (!toastMessage) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(239, 68, 68, 0.25)',
        fontSize: '13px',
        fontFamily: 'var(--font-mono, monospace)',
        fontWeight: 600,
        letterSpacing: '0.01em',
        animation: 'fadeInUp 0.15s ease-out',
        pointerEvents: 'none',
      }}
      role="alert"
      aria-live="assertive"
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#EF4444',
          boxShadow: '0 0 8px #EF4444',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span>{toastMessage}</span>
    </div>
  )
}
