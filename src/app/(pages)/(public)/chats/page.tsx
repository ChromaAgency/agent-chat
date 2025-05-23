// src/app/(main)/page.tsx
'use client'; // Esto es importante para usar hooks de React como useState

import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card'; // Opcional, para la tarjeta de usuario
import { Separator } from '@/components/ui/separator'; // Opcional, para la separación visual


// --- Componentes Reutilizables (podrían ir en src/app/chat/components/) ---

// src/app/chat/components/ChatBubble.tsx
interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  time: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, time }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm">{message}</p>
        <span className={`block text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {time}
        </span>
      </div>
    </div>
  );
};

// src/app/chat/components/MessageList.tsx
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  time: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 h-full">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} time={msg.time} />
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

// --- Componente principal de la página ---

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hola, ¿en qué puedo ayudarte hoy?', isUser: false, time: '10:00 AM' },
    { id: '2', text: 'Tengo un problema con mi cuenta.', isUser: true, time: '10:01 AM' },
    { id: '3', text: 'Claro, por favor, describe tu problema.', isUser: false, time: '10:02 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        isUser: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');
      // Aquí podrías añadir la lógica para enviar el mensaje al backend/IA
    }
  };

  return (
    <div className="flex h-full">

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="left" className="w-80 sm:w-96 p-4">
          <SheetHeader>
            <SheetTitle>Filtros de Chats</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Filtros</h3>
            {/* Aquí irían tus checkboxes o botones de filtro */}
            <div className="flex space-x-2 mb-4">
              <Button variant="outline" className="text-xs px-2 py-1">Todos</Button>
              <Button variant="outline" className="text-xs px-2 py-1">Activos</Button>
              <Button variant="outline" className="text-xs px-2 py-1">Archivados</Button>
            </div>

            <h3 className="font-semibold mb-2">Búsqueda</h3>
            <Input placeholder="Buscar chats..." className="mb-4" />

            <h3 className="font-semibold mb-2">Chats Recientes</h3>
            <ScrollArea className="h-[calc(100vh-250px)] pr-4"> {/* Ajustar altura según sea necesario */}
              {/* Ejemplo de items del chat */}
              <div className="p-3 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center">
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Juan Doe</span>
                    <span className="text-gray-500 text-xs">10:30 AM</span>
                  </div>
                  <p className="text-gray-600 text-xs truncate">Resumen del último mensaje...</p>
                </div>
              </div>
              <div className="p-3 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center">
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Ana Nuñez</span>
                    <span className="text-gray-500 text-xs">Ayer</span>
                  </div>
                  <p className="text-gray-600 text-xs truncate">Otro mensaje reciente...</p>
                </div>
              </div>
              {/* Más items aquí */}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Contenedor principal del chat (Centro) */}
      <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
        {/* Cabecera del chat (opcional) */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat con Soporte</h2>
          {/* Aquí podrías añadir botones de acciones de chat */}
        </div>

        {/* Área de mensajes del chat */}
        <MessageList messages={messages} />

        {/* Input y botón de envío */}
        <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
          <Input
            placeholder="Escribe tu mensaje aquí..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </div>

      {/* Información del Usuario (Derecha) */}
      <aside className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Información del usuario</h2>

        {/* Tarjeta de perfil */}
        <Card className="p-4 text-center mb-6">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage src="/placeholder-avatar.jpg" alt="CS" /> {/* Si tienes una imagen */}
            <AvatarFallback className="text-2xl">CS</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">Chat Support</h3>
          <p className="text-green-500 text-sm">Online now</p>
        </Card>

        {/* Detalles adicionales */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">Support Specialist</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <a href="mailto:support@chatapp.com" className="text-blue-600 hover:underline">support@chatapp.com</a>
          </div>
          <div>
            <p className="text-sm text-gray-500">Call</p>
            <p className="font-medium">N/A</p>
          </div>
          <Separator className="my-4" /> {/* Separador opcional */}
          <div>
            <p className="text-sm text-gray-500">Current time</p>
            <p className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}