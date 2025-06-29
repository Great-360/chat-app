"use client"
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import React from 'react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { Authenticated, AuthLoading, ConvexReactClient } from 'convex/react'
import LoadingLogo from '@/components/shared/LoadingLogo'


type PageProps = {
    children: React.ReactNode
}
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';
const convex = new ConvexReactClient(CONVEX_URL);


const ConvexClientProvider = ({
    children
}: PageProps) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex} >
        
        <Authenticated>{children}</Authenticated>
        <AuthLoading><LoadingLogo size={100} /></AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

export default ConvexClientProvider
