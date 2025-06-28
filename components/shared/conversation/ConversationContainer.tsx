import React from 'react'
import { Card } from '@/components/ui/card';

type PageProps = React.PropsWithChildren<{
  children: React.ReactNode;
}>
const ConversationContainer = ({children}: PageProps) => {
  return (
    <Card className="w-full h-[cal(100vh-32px)] lg:h-full p-2 flex flex-col gap-2">
      {children}
    </Card>
  )
}

export default ConversationContainer
