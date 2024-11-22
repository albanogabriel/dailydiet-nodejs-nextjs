import { Nunito_Sans } from "next/font/google"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import LayoutController from "./layout-controller"
import { Toaster } from "sonner"
import CombinedProviders from "./providers/combined-providers"

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <CombinedProviders>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} flex min-h-screen flex-col font-nunitoSans text-foreground antialiased`}
        >
          <Toaster richColors />

          <div className="min-h-screen">
            <LayoutController>{children}</LayoutController>
          </div>

          {/* <footer>teste</footer> */}
        </body>
      </CombinedProviders>
    </html>
  )
}
