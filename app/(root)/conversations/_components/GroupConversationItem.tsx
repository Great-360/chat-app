
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel"

import Link from "next/link";



type Props = {
    id: Id<"conversations">;
    name: string;
    lastMessageSender?: string;
    lastMessageContent: string | undefined;
}
const GroupConversationItem = ({ id,name, lastMessageSender, lastMessageContent } : Props) => {
    
  return (
    <Link href={`/conversations/${id}`} 
     className="w-full"
    >
    <Card className="p-2 flex flex-row items-center gap-4 truncate">
        <div className="flex flex-row items-center gap-4 truncate">
           <Avatar>
            <AvatarFallback>
               {name.charAt(0).toLocaleLowerCase()}
            </AvatarFallback>
           </Avatar>
           <div className="flex flex-col truncate">
               <h4 className="truncate">{name}</h4>
              { lastMessageContent && lastMessageSender ?
                <span className="text-sm text-muted-foreground flex truncate overflow-allipsis">
                  <p className="font-semibold">
                    {lastMessageSender}
                    {":"}&nbsp;
                  </p>
                  <p className="truncate overflow-allipsis">
                    {lastMessageContent}
                  </p>
                </span>
              : <p className="text-sm text-muted-foreground truncate">
                Start the conversation!
               </p>}
           </div>
        </div>
    </Card>
    </Link>
  )
}

export default GroupConversationItem
