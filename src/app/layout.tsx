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