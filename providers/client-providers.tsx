"use client"

import React from "react"
import { ThemeProvider } from "@/providers/theme-provider"
import { ToasterProvider } from '@/providers/toast-provider'
import { ModalProvider } from '@/providers/modal-provider'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ToasterProvider />
      <ModalProvider />
      {children}
    </ThemeProvider>
  )
}