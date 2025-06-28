import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper'
import React from 'react'

type PageProps = React.PropsWithChildren<{
    children: React.ReactNode
}>

function layout({ children }: PageProps) {
  return (
    <SidebarWrapper>
       {children}
    </SidebarWrapper>
  )
}

export default layout
