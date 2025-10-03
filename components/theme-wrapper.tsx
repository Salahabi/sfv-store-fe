// components/theme-wrapper.tsx
'use client'

import { ThemeProvider } from '@/providers/theme-provider'

import { useState, useEffect } from 'react'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  // Prevent server-side rendering of the theme
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // The actual theme provider
  const themeProvider = (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )

  // On the first render, just return children without theme to match server rendering
  if (!mounted) {
    return <>{children}</>
  }

  // Once mounted on client, apply theme
  return themeProvider
}