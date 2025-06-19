"use client";

import { Card } from "@/components/ui/card";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import { Tooltip, TooltipContent } from "@radix-ui/react-tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";

const DesktopNav = () => {
    const paths = useNavigation();
    console.log("paths", paths);
  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
        <nav>
            <ul className="flex flex-col items-center gap-4">
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
            </ul>
        </nav>
        <div className="flex flex-col items-center gap-4">
           <ThemeToggle/>
           <UserButton />
        </div>
    </Card>
  )
}

export default DesktopNav
