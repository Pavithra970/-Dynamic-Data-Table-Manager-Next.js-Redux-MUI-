import Providers from './Providers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dynamic Table Manager',
  description: 'Sortable, searchable, paginated data table',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
