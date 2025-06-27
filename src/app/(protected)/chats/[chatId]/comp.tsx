'use client'; // Esto es importante para usar hooks de React como useState

import React, { useRef, useEffect, MouseEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getMessagesByThreadId, addMessageToThread } from '@/services/messageService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/agent-form';
import { useUser } from '@/services/authStore';

// --- ChatBubble Component ---
interface ChatBubbleProps {
    message: string;
    isUser: boolean;
    time: string;
    // New optional props for avatar sources
    userAvatarSrc?: string;
    botAvatarSrc?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
    message,
    isUser,
    time,
    userAvatarSrc,
    botAvatarSrc,
}) => {
    // Determine avatar image and fallback text based on user or bot
    const avatarImage = isUser ? userAvatarSrc || "/avatars/user.png" : botAvatarSrc || "/avatars/bot.png";
    const avatarFallback = isUser ? "U" : "B";

    return (
        <div className={`flex mb-4  ${isUser ? 'justify-end' : 'justify-start'} items-start`}>
            {/* Bot Avatar (left) */}
            {!isUser && (
                <Avatar className="h-8 w-8 mt-1  border border-gray-200 mr-3 ">
                    <AvatarImage src={avatarImage} alt={avatarFallback} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
            )}

            {/* Message Bubble */}
            <div
                className={`relative max-w-[70%] p-3 rounded-xl shadow-sm
                    ${isUser
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 rounded-bl-none'
                    }
                `}
            >
                <p className="text-sm break-words">{message}</p>
                <span className={`block text-xs mt-1 text-right opacity-75
                    ${isUser ? 'text-blue-100' : 'text-gray-600'}
                `}>
                    {time}
                </span>
            </div>

            {/* User Avatar (right) */}
            {isUser && (
                <Avatar className="h-8 w-8 mt-1 border border-gray-200 ml-3 ">
                    <AvatarImage src={avatarImage} alt={avatarFallback} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};

// --- Rest of your code remains largely the same ---

interface Message {
    id: string;
    text: string;
    userId: number;
    time: string;
}

interface NewMessage {
    text: string;
}

interface MessageListProps {
    messages: Message[];
    user: { id: number } | undefined; // user can be undefined
    botAvatarSrc?: string; // Propagating avatar sources
    userAvatarSrc?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, user, botAvatarSrc, userAvatarSrc }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <ScrollArea className="flex-1 p-5 h-full">
            {messages.map((msg) => (
                <ChatBubble
                    key={msg.id}
                    message={msg.text}
                    isUser={user ? msg.userId === user.id : false} // Handle user being undefined
                    time={msg.time}
                    userAvatarSrc={userAvatarSrc} // Pass avatar sources
                    botAvatarSrc={botAvatarSrc}
                />
            ))}
            <div ref={messagesEndRef} />
        </ScrollArea>
    );
};

export function ChatPage({ chatId }: { chatId: string }) {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const { data: fetchedMessages } = useQuery<Message[]>({ // Renamed data to fetchedMessages to avoid conflict
        queryKey: ['messages', chatId],
        queryFn: ({ queryKey }) => getMessagesByThreadId(queryKey[1]),
    }, queryClient);
    const inputRef = useRef<HTMLInputElement>(null);
    const { data: user } = useUser(); // User data from authStore

    // Example avatar paths (replace with actual paths or dynamic logic)
    const currentUserAvatar = user ? `/avatars/user_${user.id}.png` : "/avatars/default_user.png";
    const currentBotAvatar = "/avatars/ai_bot.png"; // Assuming a single bot avatar

    const { mutate } = useMutation({
        mutationKey: ['messages', chatId],
        mutationFn: (newMessage: NewMessage) => {
            // Ensure userId is handled safely, e.g., if user is null/undefined
            const userId = user?.id ?? 0; // Default to 0 or handle error if user is required
            return addMessageToThread(parseInt(chatId), newMessage.text, userId);
        },
        onMutate: (newMessage) => {
            // --- MODIFICACIÓN CLAVE AQUÍ ---
            // Formatear solo la hora
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: Date.now().toString(), text: newMessage.text, userId: user?.id ?? 0, time: timestamp } // Usar Date.now() para ID único
            ]);
            if (inputRef.current) inputRef.current.value = '';
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        }
    }, queryClient);

    const handleSendMessage = () => {
        const inputMessage = inputRef.current?.value || '';
        if (inputMessage.trim() !== '') {
            const newMessage: NewMessage = {
                text: inputMessage,
            };
            mutate(newMessage);
        }
    };

    useEffect(() => {
        if (fetchedMessages) { // Use fetchedMessages
            // --- CONSIDERACIÓN PARA MENSAJES YA EXISTENTES ---
            // Si fetchedMessages ya contiene mensajes, deberías mapearlos para formatear su tiempo también.
            // Actualmente, los mensajes que vienen de la API no se formatean aquí, solo los nuevos.
            // Si la API devuelve el tiempo en un formato completo, podrías hacer esto:
            const formattedFetchedMessages = fetchedMessages.map(msg => ({
                ...msg,
                time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setMessages(formattedFetchedMessages);
        }
    }, [fetchedMessages]);

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {/* Chat Header Content */}
                </div>
                <MessageList
                    messages={messages || []}
                    user={user}
                    userAvatarSrc={currentUserAvatar} // Pass user avatar source
                    botAvatarSrc={currentBotAvatar}   // Pass bot avatar source
                />
                <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
                    <Input
                        ref={inputRef}
                        placeholder="Escribe tu mensaje aquí..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        className="flex-1"
                    />
                    <Button onClick={(e: MouseEvent<HTMLButtonElement>) => handleSendMessage()}>Enviar</Button>
                </div>
            </div>

            {/* Información del Usuario (Derecha) */}
            <aside className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Información del Contacto</h2>

                {/* Tarjeta de perfil del agente/bot */}
                <Card className="p-4 text-center mb-6 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-blue-400 p-0.5">
                        <AvatarImage src={currentBotAvatar} alt="Bot Avatar" />
                        <AvatarFallback className="text-3xl bg-blue-100 text-blue-600 font-bold">AI</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-gray-900">Asistente AI</h3>
                    <p className="text-green-500 text-sm flex items-center justify-center gap-1 mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online
                    </p>
                </Card>

                {/* Detalles adicionales */}
                <div className="space-y-4 text-gray-700">
                    <div>
                        <p className="text-sm text-gray-500">Función</p>
                        <p className="font-medium">Soporte Automatizado</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Disponibilidad</p>
                        <p className="font-medium">24/7</p>
                    </div>
                    <Separator className="my-4 bg-gray-200" />
                    <div>
                        <p className="text-sm text-gray-500">Contactar Agente Humano</p>
                        <Button variant="outline" className="w-full mt-2 text-blue-600 border-blue-300 hover:bg-blue-50">
                            Solicitar Llamada
                        </Button>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Última Actualización</p>
                        <p className="font-medium">{new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
            </aside>
        </div>
    );
}