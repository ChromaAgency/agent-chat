import React from 'react';

const HomePage = () => {
  return (
    <div className="flex h-full">
      {/* Lista de Chats */}
      <div className="flex-1 overflow-y-auto pr-4">
        <ul>
          {/* Ejemplo de un item de chat */}
          <li className="bg-white rounded-md shadow-sm p-3 mb-2 cursor-pointer hover:bg-gray-200">
            {/* ... Contenido del item de chat */}
          </li>
          {/* ... Más items de chat */}
        </ul>
      </div>

      {/* Panel de Chat */}
      <div className="w-96 bg-white shadow-md flex flex-col justify-between">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chat</h2>
          {/* Información del contacto seleccionado aquí */}
        </div>
        <div className="overflow-y-auto p-4">
          {/* Área de mensajes del chat */}
          <div className="mb-2">
            {/* ... Mensajes */}
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            {/* ... Input de mensaje y botón de enviar */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;