'use client'; // Esto es importante para usar hooks de React como useState

import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card'; 
import { Separator } from '@/components/ui/separator'; 

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
  const [messages, setMessages] = useState<Message[]>([  ]);
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
   
      <div className="flex-1 flex flex-col bg-white border-r border-gray-200">

      </div>

     
    </div>
  );
}