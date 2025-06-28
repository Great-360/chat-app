"use client"
  import { use } from "react";
import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Loader2 } from 'lucide-react'
import Header from '../[conversationId]/_components/Header'
import Body from '../[conversationId]/_components/body/Body'
import ChatInput from '../[conversationId]/_components/input/ChatInput'
import { useState } from 'react'
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog'
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog'
import LeaveGroupDialog from "./_components/dialogs/LeaveGroupDialog";

type  Props = {
  params:{
    type: string;
  senderId: Id<"users">;
  conversationId: Id<"conversations">; 
  content: string[];
  }
}

const ConversationPage =  ({ params }: { params: Promise<{conversationId: Id<"conversations">}>}) => {
    const { conversationId } = use(params);
  const conversation = useQuery(api.conversation.get,{id: conversationId});

  const [removeFriendDialogueOpen, setRemoveFriendDialogueOpen] = useState(false);
  const [removeGroupDialogueOpen, setRemoveGroupDialogueOpen] = useState(false);
  const [leaveGroupDialogueOpen, setLeaveGroupDialogueOpen] = useState(false);
  //const [callType, setCallType] = useState(false)
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
        <RemoveFriendDialog conversationId={conversationId}
        open={removeFriendDialogueOpen}
        setOpen={setRemoveFriendDialogueOpen}
        />
        <DeleteGroupDialog conversationId={conversationId}
          open={removeGroupDialogueOpen}
          setOpen={setRemoveGroupDialogueOpen}
         />
         <LeaveGroupDialog conversationId={conversationId}
           open={leaveGroupDialogueOpen}
           setOpen={setLeaveGroupDialogueOpen}
          />

        <Header 
          name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || ""}
          imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageUrl }
          options={conversation.isGroup ? [
            {
              label: "Leave Group",
              destructive: false,
              onClick: () => setLeaveGroupDialogueOpen(true),
            },
      
             {
               label: "Delete Group",
               destructive: true,
               onClick: () => setRemoveGroupDialogueOpen(true),
             },
          ] : [
                {
               label: "Remove Friend",
               destructive: false,
               onClick: () => setRemoveFriendDialogueOpen(true),
             },
          ]}
          />
        <Body members={conversation.isGroup ?
          conversation.otherMembers ? conversation.otherMembers : []
          : conversation.otherMember ?[ conversation.otherMember] :  []     
           }/>
        <ChatInput />
      </ConversationContainer>
    )
  );
}

export default ConversationPage
