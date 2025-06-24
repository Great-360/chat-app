import {  v } from "convex/values";
import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
    args:{
        conversationId: v.id("conversations"),
        type:v.string(),
        content: v.array(v.string())
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

        const membership = await ctx.db.query("conversationMembers")
         .withIndex("by_memberId_conversationId", 
            q => q.eq("conversationId", args.conversationId)
            .eq("memberId",currentUser._id)
         ).unique();
         if (!membership) {
            throw new ConvexError("You aren't a member of this conversation")
         }

         const message = await ctx.db.insert("messages", {
            senderId: currentUser._id,
            ...args
         })
         await ctx.db.patch(args.conversationId, {
            lastMessageId: message
         })
         return message
    },
})