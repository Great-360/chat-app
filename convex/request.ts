import { mutation } from "./_generated/server";
import { v, ConvexError} from "convex/values";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const identity =  await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new ConvexError("Unauthorized")
        }
        if(args.email === identity.email) {
            throw new ConvexError("You cannot send a request to yourself")
        };
        
        const currentUser = await getUserByClerkId({
           ctx, clerkId: identity.subject
        });
        if (!currentUser) {
            throw new ConvexError("User not found");
        } 

        const receiver = await ctx.db.query("users")
            .withIndex("by_email", q => q.eq("email", args.email))
            .first();
        if (!receiver) {
            throw new ConvexError("User could not be found");
        }

        const requestAlreadySent = await ctx.db.query("requests").withIndex
        ("by_receiver_sender", q => q.eq("receiver", receiver._id).eq
          ("sender", currentUser._id)).first();
        
        if(requestAlreadySent) {
            throw new ConvexError("Request already sent")
      }
     const requestAlreadyReceived = await ctx.db.query("requests").withIndex
         ("by_receiver_sender", q => q.eq("receiver", currentUser._id).eq
         ("sender", receiver._id)).first();
        if(requestAlreadyReceived) {
            throw new ConvexError("Request already received")

       }

       const request = await ctx.db.insert("requests", {
        sender: currentUser._id,
        receiver: receiver._id,
       });

       return request;

},
})

