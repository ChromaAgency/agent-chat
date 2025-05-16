import React, { ReactNode } from 'react';
import './globals.css';

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="es">
      <body className="flex h-screen bg-gray-100">
        {/* Menú Lateral */}
        <aside className="w-64 bg-white shadow-md p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Menú</h2>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <button className="flex items-center text-gray-700 hover:text-indigo-600">
                  {/* ... Icono */} Chats
                </button>
              </li>
              <li>
                <button className="flex items-center text-gray-700 hover:text-indigo-600">
                  {/* ... Icono */} Agentes
                </button>
              </li>
              <li>
                <button className="flex items-center text-gray-700 hover:text-indigo-600">
                  {/* ... Icono */} Manual
                </button>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            <button className="flex items-center text-gray-700 hover:text-indigo-600">
              {/* ... Icono */} Cuenta
            </button>
          </div>
        </aside>

        {/* Contenedor Central y Panel de Chat */}
        <div className="flex-1 flex bg-gray-50">
          {/* Contenedor Central (Lista de Chats y Barra de Búsqueda/Filtros) */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <div>Filtros</div>
                {/* ... Filtros */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Búsqueda"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {/* ... Icono de búsqueda */}
                </div>
              </div>
            </div>
            {/* Aquí se renderizará el contenido de page.tsx */}
            <main className="flex-1 overflow-y-auto p-4">
              {children}
            </main>
            <div className="bg-white shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2">Mensajes Filtrables</h3>
              {/* ... Contenido de mensajes filtrables */}
            </div>
          </div>

          {/* Panel de Información del Usuario (Derecha) */}
          <aside className="w-80 bg-white shadow-md p-4 border-l">
            <div className="text-center mb-4">
              {/* ... Información del usuario */}
            </div>
            {/* ... Detalles del usuario */}
            <div className="mt-auto text-center">
              <span className="text-green-500 text-sm">Connected</span>
            </div>
          </aside>
        </div>
      </body>
    </html>
  );
}
