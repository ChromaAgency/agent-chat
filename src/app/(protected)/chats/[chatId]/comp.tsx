'use client'; // Esto es importante para usar hooks de React como useState

import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getMessagesByThreadId, addMessageToThread } from '@/services/messageService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/components/agent-form';

interface ChatBubbleProps {
    message: string;
    isUser: boolean;
    time: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, time }) => {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-xs p-3 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
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

export function ChatPage({ chatId }: { chatId: string }) {
    const [messages, setMessages] = React.useState<Message[]>([  ]);
    const { data } = useQuery({
        queryKey: ['messages', chatId],
        queryFn: ({ queryKey }) => getMessagesByThreadId(queryKey[1]),
    }, queryClient)


    const {mutate} = useMutation({
        mutationKey: ['messages', chatId],
        mutationFn: (newMessage: NewMessage) => addMessageToThread(parseInt(chatId), newMessage.text, 1),
        onMutate: (newMessage) => {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            setMessages((prevMessages) => [...prevMessages, 
                {id:timestamp.toString(), text:newMessage.text, isUser:true, time:timestamp.toString()}]);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] })
        }
    },queryClient)
    const handleSendMessage = (inputMessage:string) => {
        if (inputMessage.trim() !== '') {
            const newMessage: NewMessage = {
                text: inputMessage,
            };
            mutate(newMessage)
        }
    };
    useEffect(() => {
        if (data) {
            setMessages(data)
        }
    }, [data])

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                </div>
                <MessageList messages={messages || []} />
                <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
                    <Input
                        placeholder="Escribe tu mensaje aquí..."
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(e.target.value);
                            }
                        }}
                        className="flex-1"
                    />
                    <Button onClick={(e)=>handleSendMessage(e.target.value)}>Enviar</Button>
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