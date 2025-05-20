import './globals.css';

export const metadata = {
  title: 'Chat Agent',
  description: 'Create AI Chat Agents',
}

export default function RootLayout({
  children,
}: Readonly <{
  children: React.ReactNode;
}>) { return (
  <html lang="es">
    <body className="flex items-start justify-between">
      <main className="h-full w-full">
        {children}
      </main>
    </body>
  </html>
  )
}

