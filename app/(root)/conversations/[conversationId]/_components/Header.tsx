import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CircleArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

type PageProps = {
    imageUrl: string | undefined;
    name: string;
    options?: {
      label: string;
      destructive: boolean;
      onClick: () => void
    }[]
}

const Header = ({ imageUrl, name, options }: PageProps) => {
  return (
    <div>
      <Card className='w-full flex flex-row rounded-lg  p-2 justify-between'>
        <div className='flex items-center gap-2'>
           <Link href="/conversations" className='block lg:hidden'>
              <CircleArrowLeft />
           </Link>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={imageUrl}/>
            <AvatarFallback>
             {name.substring(0,1)}
            </AvatarFallback>
          </Avatar>
          <h2 className='font-semibold'>{name}</h2>
        </div>
        <div className='flex gap-2'>
          {options ? 
          (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent >
              {
                options.map((option, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={option.onClick}
                    className={cn("font-semibold", {
                      "text-destructive":option.destructive,

                    })}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))
              }
            </DropdownMenuContent>
          </DropdownMenu>
        ): null}
        </div>
      </Card>
    </div>
  )
}

export default Header
