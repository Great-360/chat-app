import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";


export const get = query({args: {},
    handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
        throw new Error("Unauthorized")
    }
    
    const currentUser = await getUserByClerkId({
        ctx, clerkId: identity.subject
    })
    if(!currentUser) {
        throw new ConvexError("User not found");
    }
    
    const conversationMemberShips = await ctx.db.query("conversationMembers")
     .withIndex("by_memberId", q => q.eq("memberId", currentUser._id)).collect()

   const conversations = Promise.all(conversationMemberShips?.map(
    async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) {
            throw new ConvexError("Conversation could not be found");
        }
        return conversation;
    }
  ));
  const conversationsWithDetails = await Promise.all((await conversations).map(
    async (conversation, index) =>{
        const allConversationMemberships =  await ctx.db.query("conversationMembers")
        .withIndex("by_conversationId", q => q.eq("conversationId", conversation?._id)).collect();

    const lastMessage = await getLastMessageDetails({
        ctx, 
        id: conversation.lastMessageId,

    });
    const lastSeenMessage = conversationMemberShips[index].lastSeenMessage 
     ? await  ctx.db.get(conversationMemberShips[index].lastSeenMessage)
     : null
     const lastSeenMessageTime = lastMessage && lastSeenMessage && typeof lastSeenMessage._creationTime === "number"
       ? lastSeenMessage._creationTime
       : -1;

       const unSeenMessages = await ctx.db.query("messages")
       .withIndex("by_conversationId", q => q.eq("conversationId", conversation._id))
       .filter((q) => q.gt(q.field("_creationTime"), lastSeenMessageTime))
       .filter((q) => q.neq(q.field("senderId"), currentUser._id))
       .collect();

     if (conversation.isGroup) {
        return {conversation, lastMessage, unSeenCount: unSeenMessages.length}
     } else{
        const otherMembership = allConversationMemberships.filter(
            (membership) => membership.memberId !== currentUser._id
        )[0]
        const otherMember = await ctx.db.get(otherMembership.memberId)
        
        const unSeenCount = unSeenMessages.length;
        return {
            conversation,otherMember, lastMessage, unSeenCount
            
        }
     }

    }
  ))
  return conversationsWithDetails;
    },
});

const getLastMessageDetails = async ({ctx, id}: {ctx: QueryCtx| MutationCtx; id: Id<"messages"> | undefined}) => {
    if(!id) {
        return null;
    }
    const message = await ctx.db.get(id);
    if(!message) {
        return null
    }
    const sender = await ctx.db.get(message.senderId)
    if(!sender) return null;
    const content = getMessageContent(message.type, message.content as unknown as string)

    return {
        content,
        sender: sender.username
    }

}
const getMessageContent = (type: string, content: string | undefined) => {
    switch(type) {
        case "text":
            return content;
        default:
            return"[Non-text]";
    }
}


export const deleteGroup= mutation({
    args:{
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        if(!args.conversationId) {
            throw new ConvexError("Conversation Id is required")
        }
        const identity =  await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new ConvexError("Unauthorized");
        }
        if(args.conversationId === identity.email) {
            throw new ConvexError("You cannot send a request to yourself")
        };
                
        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });
        if (!currentUser) {
            throw new ConvexError("User not found");
        } 

        const conversation = await ctx.db.get(args.conversationId)
        if(!conversation) {
            throw new ConvexError("Conversation not found")
        }

        const memberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId",
            q => q.eq("conversationId", args.conversationId)
        ).collect()

        if(!memberships || memberships.length <= 1) {
           throw new ConvexError("This conversation does not have any members")
        }

        const messages = await ctx.db.query("messages")
        .withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect();
        await ctx.db.delete(args.conversationId)
        
        await Promise.all(memberships.map( async membership => {
            await ctx.db.delete(membership._id)
        }))
        await Promise.all(messages.map( async message=> {
             await ctx.db.delete(message._id)
        }))
    },

})

export const leaveGroup= mutation({
    args:{
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        if(!args.conversationId) {
            throw new ConvexError("Conversation Id is required")
        }
        const identity =  await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new ConvexError("Unauthorized");
        }
        if(args.conversationId === identity.email) {
            throw new ConvexError("You cannot send a request to yourself")
        };
                
        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });
        if (!currentUser) {
            throw new ConvexError("User not found");
        } 

        const conversation = await ctx.db.get(args.conversationId)
        if(!conversation) {
            throw new ConvexError("Conversation not found")
        }

        const memberships = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId",
            q => q.eq("conversationId", args.conversationId).eq("memberId", currentUser._id)
        ).unique()

        if(!memberships) {
           throw new ConvexError("You are not a member of this group")
        }
       await ctx.db.delete(memberships._id)
    },
})
export const markRead= mutation({
    args:{
        conversationId: v.id("conversations"),
        messageId: v.id("messages")
    },
    handler: async (ctx, args) => {
        if(!args.conversationId) {
            throw new ConvexError("Conversation Id is required")
        }
        const identity =  await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new ConvexError("Unauthorized");
        }
        if(args.conversationId === identity.email) {
            throw new ConvexError("You cannot send a request to yourself")
        };
                
        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });
        if (!currentUser) {
            throw new ConvexError("User not found");
        } 

        const memberships = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId",
            q => q.eq("conversationId", args.conversationId).eq("memberId", currentUser._id)
        ).unique()

        if(!memberships) {
           throw new ConvexError("You are not a member of this group")
        }
       const lastMessage = await ctx.db.get(args.messageId)

       await ctx.db.patch(memberships._id, {
        lastSeenMessage: lastMessage ?
        lastMessage._id: undefined,
       })
    },
})


