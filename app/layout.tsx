import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Funnel_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const funnelDisplay = Funnel_Display({
  subsets: ['latin'],
  variable: '--font-funnel',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sahayak AI',
  description: 'Your Mental Health Buddy'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${funnelDisplay.variable}`}>
        <body className={GeistSans.className}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
