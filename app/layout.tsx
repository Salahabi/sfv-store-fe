
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'

import './globals.css'
import prismadb from '@/lib/prismadb'
import { ThemeProvider } from '@/providers/theme-provider'
import  WebVitals  from './_components/web-vitals'
import { ThemeWrapper } from '@/components/theme-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Dashboard for SFV eCommerce Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const store = prismadb.store
  return (
    <ClerkProvider>
      <html lang="en" className="">
        <body className={inter.className}>
          <WebVitals />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ToasterProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
