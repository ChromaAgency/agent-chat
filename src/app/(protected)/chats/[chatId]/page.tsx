import { ChatPage } from "./comp";

  export default async function HomePage({
    params,
  }: {
    params: Promise<{ chatId: string }>;
  }) {
    return <ChatPage chatId={await params.then((params) => params.chatId)} />;
}