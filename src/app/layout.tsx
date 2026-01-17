import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from '@/contexts/ThemeContext'

const tajawal = Tajawal({ 
  subsets: ['latin', 'arabic'],
  weight: ['300', '400', '500', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'هاسنديل',
  description: 'منصة هاسنديل لنشر المقالات والتفاعل الاجتماعي',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <ThemeProvider>
          <Providers>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
