import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Waypoint',
  description: 'web application that allows users to submit the addresses of a pickup point and a drop-off point. The application should communicate with the Mock API backend to retrieve the corresponding waypoints and display them on an embedded map.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
