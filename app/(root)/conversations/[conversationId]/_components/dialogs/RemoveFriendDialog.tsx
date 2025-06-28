"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel"
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type PageProps = {
    conversationId: Id<"conversations">;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const RemoveFriendDialog = ({
    conversationId, open, setOpen
}: PageProps) => {
    const { mutate: removeFriend, pending} = useMutationState(api.friend.remove);
    const handleRemoveFriend =  async () => {
       removeFriend({conversationId}).then(() => {
        toast.success("Removed Friend")
       }).catch((error) => {
        toast.error(error instanceof ConvexError 
        ? error.data
        : "unexpected error occured")
       })
    }
  return (
    <AlertDialog open={open}
     onOpenChange={setOpen}
    >
        <AlertDialogContent>
          <AlertDialogHeader>
        
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                  This action cannot be undone. All the messages will be deleted 
                  and  you will not be able to to message this user. All group chats 
                  will still work as normal.
              </AlertDialogDescription>
          </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={pending}
            onClick={handleRemoveFriend}>
                Delete
            </AlertDialogAction>
            
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveFriendDialog
