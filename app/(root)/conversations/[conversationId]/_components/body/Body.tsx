"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConversation } from "@/hooks/useConversation"
import { useQuery } from "convex/react";
import Message from "./Message";
import { useMutationState } from "@/hooks/useMutationState";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


type Props = {
  members: {
    lastSeenMessageId?: Id<"messages">;
    username?: string;
    [key: string]: unknown;
  }[]
}


const Body = ({ members }: Props) => {
  const { conversationId } = useConversation();
  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<"conversations">
  })

  const {mutate: markRead } = useMutationState(api.conversations.markRead)

  useEffect(() => {
    if( messages && messages.length > 0) {
      markRead({
        conversationId,
        messageId: messages[0].message._id,
      });
    }
  }, [messages, conversationId, markRead]);

  const formatSeenBy = (names: string[]) => {
     switch(names.length) {
      case 1: 
        return <p className="text-muted-foreground text-sm text-right">
          {`Seen by ${names[0]}`}
        </p>
       case 2: 
         return <p className="text-muted-foreground text-sm text-right">
           {`Seen by ${names[0]} and  ${names[1]}`}
         </p>
        default: 
        return <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
               <p className="text-muted-foreground text-sm text-right">
                 {`Seen by ${names[0]}, ${names[1]},${names.length - 2} more`}
               </p>
            </TooltipTrigger>
            <TooltipContent>
              <ul>
                {names.map((name, index) => {
                  return <li key={index}>
                    {name}
                  </li>
                })}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
     }
  }

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members.filter(member => member.lastSeenMessageId === messageId).map(
       user => user.username!.split(" ")[0]
    )
    if(seenUsers.length === 0) return undefined

    return formatSeenBy(seenUsers)
  }

  return (
    <div className='flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar'>
   {messages?.map((msg, index) => {
    const { message, senderImage, senderName, isCurrentUser } = msg;
    const lastByUser = messages[index - 1]?.message.senderId === message.senderId;
    const seenMessage = isCurrentUser ? getSeenMessage(message._id) : undefined

    return (
      <Message
        key={message._id}
        fromCurrentUser={isCurrentUser}
        senderImage={senderImage}
        senderName={senderName}
        lastByUser={lastByUser}
        content={message.content}
        createdAt={message._creationTime}
        seen={seenMessage}
        type={message.type}
      />
    );
   })}
    </div>
  )
}

export default Body
