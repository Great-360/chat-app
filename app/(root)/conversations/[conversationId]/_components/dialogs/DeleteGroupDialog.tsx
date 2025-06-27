"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel"
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
    conversationId: Id<"conversations">;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const DeleteGroupDialog = ({
    conversationId, open, setOpen
}: Props) => {
    const { mutate: deleteGroup, pending} = useMutationState(api.conversations.deleteGroup);
    const handleDeleteGroup =  async () => {
      deleteGroup({conversationId}).then(() => {
        toast.success("Group Deleted")
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
                  and  you will not be able to to message this group.
              </AlertDialogDescription>
          </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={pending}
            onClick={handleDeleteGroup}>
                Delete
            </AlertDialogAction>
            
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteGroupDialog
