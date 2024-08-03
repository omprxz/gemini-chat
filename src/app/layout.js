import { Inter } from 'next/font/google'
import './globals.css'
import Eruda from "@/utils/eruda"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gemini API AI',
  description: 'Experience the power of advanced AI chat models right in your browser. Select your model and start chatting!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {/*<Eruda />*/}
      {children}
      </body>
    </html>
  )
}
