import { ChatPage } from "./comp";

export const metadata = {
  title: "Chat",
  description: "Chat with users"
}

  export default async function HomePage({
    params,
  }: {
    params: Promise<{ chatId: string }>;
  }) {
    return <ChatPage chatId={await params.then((params) => params.chatId)} />;
}