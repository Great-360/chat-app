
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import Link from "next/link";



type PageProps = {
    id: Id<"conversations">;
    imageUrl: string;
    username: string;
    lastMessageSender?: string;
    lastMessageContent: string | undefined;
    unSeenCount: number;
}
const DMConversationItem = ({ id,imageUrl,username, lastMessageSender, lastMessageContent,unSeenCount } : PageProps) => {
    
  return (
    <Link href={`/conversations/${id}`} 
     className="w-full"
    >
    <Card className="p-2 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4 truncate">
           <Avatar>
            <AvatarImage src={imageUrl}/>
            <AvatarFallback>
                <User />
            </AvatarFallback>
           </Avatar>
           <div className="flex flex-col truncate">
               <h4 className="truncate">{username}</h4>
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
        {unSeenCount ? <Badge>{unSeenCount}</Badge> : null}
    </Card>
    </Link>
  )
}

export default DMConversationItem
