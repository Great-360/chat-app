"use client"
import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Loader2 } from 'lucide-react'
import Header from './[conversationId]/_components/Header'
import Body from './[conversationId]/_components/body/Body'
import ChatInput from './[conversationId]/_components/input/ChatInput'

type  Props = {
  params:{
    conversationId: Id<"conversations"> ;
  }
}

const ConversationsPage = ({ params }: Props) => {
  const { conversationId } = params;
  const conversation = useQuery(api.conversation.get,
    conversationId ?
      {
    id: conversationId} : "skip"
);
  return (
    conversation  ===  undefined 
    ? (
      <div className='w-full h-full flex items-center justify-center'>
        <Loader2 className='h-8 w-8' />
      </div>
    )
    :( conversation === null )
    ? (
      <p className='w-full h-full flex items-center justify-center'>
       Conversation not found
      </p>
    ) 
    : (
      <ConversationContainer>
        <Header 
          imageUrl={conversation.isGroup ? undefined :  conversation.otherMember?.imageUrl }
          name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || ""}
          />
        <Body />
        <ChatInput />
      </ConversationContainer>
    )
  );
}

export default ConversationsPage
