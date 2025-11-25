
import dynamic from 'next/dynamic';
import React from 'react';

const NewChannel = dynamic(()=>import('@/components/new-channel'))
export const metadata = {
  title: 'Chats',
  description: 'Chats from the users',
}
export default function HomePage() {


  return (
    <div className="flex h-full">
   
      <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
      </div>

     
    </div>
  );
}