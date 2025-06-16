import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper'
import React from 'react'

type Props = React.PropsWithChildren<{
    children: React.ReactNode
}>

function layout({ children }: Props) {
  return (
    <SidebarWrapper>
       {children}
    </SidebarWrapper>
  )
}

export default layout
