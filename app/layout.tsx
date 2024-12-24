
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ModalProvider } from '@/providers/modal-provider'
import { ToasterPovider } from '@/providers/toast-provider'

import './globals.css'
import prismadb from '@/lib/prismadb'


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
      <html lang="en">
        <body className={inter.className}>
          <ToasterPovider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
    
  )
}
