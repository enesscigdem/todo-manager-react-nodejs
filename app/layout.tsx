import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import Script from 'next/script'
import { ServiceWorkerRegister } from '@/components/service-worker-register'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/hover-gradient.js" as="script" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <ServiceWorkerRegister />
        </ThemeProvider>
        <Script id="houdini" strategy="beforeInteractive">
          {`if ('paintWorklet' in CSS) {CSS.paintWorklet.addModule('/hover-gradient.js')}`}
        </Script>
      </body>
    </html>
  )
}
