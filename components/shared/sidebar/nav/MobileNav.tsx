"use client";

import { Card } from "@/components/ui/card";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { Tooltip, TooltipContent } from "@radix-ui/react-tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useConversation } from "@/hooks/useConversation";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";

const MobileNav = () => {
    const paths = useNavigation();
   // console.log("paths", paths);
   const { isActive} = useConversation();

   if (isActive) {
    return null;
   }
  return (
    <Card className="fixed bottom-4  w-[calc(100%-32px)]  h-16 lg:hidden p-2">
        <nav className="w-full">
            <ul className="flex justify-evenly items-center">
                {paths.map((path, id) => {
                    return <li key={id}>
                        <Link  href={path.href}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                            <div className="relative">
                               <Button
                                 size="icon"
                                 variant={path.active ? "default" : "outline"}
                               >
                                 {path.icon}
                               </Button>
                               {path.count ? (
                                 <Badge className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-xs">
                                   {path.count}
                                 </Badge>
                               ) : null}
                             </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{path.name}</p>

                            </TooltipContent>
                          </Tooltip>
                        </Link>
                    </li>
                })
             }
             <li>
              <ThemeToggle/>
             </li>
              <li >
                <UserButton />
            </li>
            </ul>
        </nav>
        
        
        
    </Card>
  )
}

export default MobileNav
