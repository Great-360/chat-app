"use client"
import ItemList from '@/components/shared/item-list/ItemList';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React from 'react'
import DMConversationItem from './_components/DMConversationItem';
import CreateGroupDialog from './_components/CreateGroupDialog';
import GroupConversationItem from './_components/GroupConversationItem';

type PageProps = React.PropsWithChildren<{
    name?: string;
}>
const ConversationLayout = ({ children}: PageProps) => {
  const conversations = useQuery(api.conversations.get)
  return (
    <>
      <ItemList title='Conversations'
      Action={
        <CreateGroupDialog />
      } >
        { conversations 
        ? (
          conversations.length === 0 
          ?  (
          <p className='w-full h-full flex items-center justify-center'>
            No conversations found
          </p>) 
          : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup 
              ? (
                <GroupConversationItem key={conversations.conversation._id} 
                  id={conversations.conversation._id}
                  name={conversations.conversation.name || ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                  unSeenCount={conversations.unSeenCount}
                />
              )
              : (
                <DMConversationItem key={conversations.conversation._id} 
                  id={conversations.conversation._id}
                  username={conversations.otherMember?.username || ""}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                  unSeenCount={conversations.unSeenCount}
                />
              )
            })
          )
        )
        : <Loader2/> }
      </ItemList>
      {children}
    </>
  )
}

export default ConversationLayout;

