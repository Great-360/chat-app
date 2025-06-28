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

const LeaveGroupDialog = ({
    conversationId, open, setOpen
}: PageProps) => {
    const { mutate: leaveGroup, pending} = useMutationState(api.conversations.leaveGroup);
    const handleleaveGroup =  async () => {
      leaveGroup({conversationId}).then(() => {
        toast.success("Group left")
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
                  This action cannot be undone. You will not be able to  see any previous messages or 
                  send new messages to this group.
              </AlertDialogDescription>
          </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={pending}
            onClick={handleleaveGroup}>
                Leave
            </AlertDialogAction>
            
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default LeaveGroupDialog
