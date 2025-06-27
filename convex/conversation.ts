import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {
        id: v.id("conversations")
    },
    handler: async (ctx, args) => {
        if(!args.id) {
            throw new ConvexError("Conversation Id is required")
        }
        const identity =  await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new ConvexError("Unauthorized")
        }
        if(args.id === identity.email) {
            throw new ConvexError("You cannot send a request to yourself")
        };
        
        const currentUser = await getUserByClerkId({
           ctx, clerkId: identity.subject
        });
        if (!currentUser) {
            throw new ConvexError("User not found");
        } 
                     
    const conversation = await ctx.db.get(args.id);
    if(!conversation) {
        return null

    }
    const membership = await ctx.db.query("conversationMembers").
    withIndex("by_memberId_conversationId", 
        q => q.eq("conversationId", conversation._id)
        .eq("memberId", currentUser._id)).unique();
        
   if(!membership) {
    throw new ConvexError("You aren't a member of this conversation")
   }
   const allConversationMemberships = await ctx.db.query("conversationMembers")
   .withIndex("by_conversationId", 
    (q) => q.eq("conversationId", args.id))
    .collect();
    if(!conversation.isGroup) {
        const otherMembership = allConversationMemberships.filter(
            membership => membership.memberId !== currentUser._id
        )[0]
        const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

        return {
            ...conversation,
            otherMember: {
                ...otherMemberDetails,
                lastSeenMessageId:
                otherMembership.lastSeenMessage
            },
            otherMembers: null
        }
    } else {
        const otherMembers = (await Promise.all(allConversationMemberships.filter(
            membership => membership.memberId !== currentUser._id
        ).map( async membership => {
               const member = await ctx.db.get(membership.memberId)
               if (!member) {
                  throw new ConvexError("Member could not be found")
               }
             return {
                 username: member.username,
                 imageUrl: member.imageUrl,
                 _id: member._id,
             }
         }
         )
             
        ))


        return {
            ...conversation,
             otherMembers,
            otherMember: null
        }
    }
},
})