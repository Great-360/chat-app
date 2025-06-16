import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import ConversationContainer from '@/components/shared/conversation/ConversationContainer'

const ConversationsPage = () => {
  return (
    <ConversationContainer>
      <ConversationFallback/>
    </ConversationContainer>
  )
}

export default ConversationsPage
