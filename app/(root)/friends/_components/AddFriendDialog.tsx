"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogDescription, DialogHeader, DialogTrigger,DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipTrigger,TooltipContent  } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

const AddFrienFormSchema =  z.object({
    email: z.string().min(1,{message: "This field can't be empty"})
    .email("Please enter a valid email")
});
const AddFriendDialog = () => {
  const {mutate: createRequest, pending} = useMutationState(api.request.create);

    const form = useForm<z.infer<typeof AddFrienFormSchema>>({
        resolver: zodResolver(AddFrienFormSchema),
        defaultValues: {
            email: "",
        }
    });
    const handleSubmit = async (
      values: z.infer<typeof AddFrienFormSchema>) =>{
        await createRequest({
          email: values.email
        }).then(() => {
          form.reset();
          toast.success("Friend Request sent!")
        }).catch(error => {
          toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred")
        })
    }
  return (
    <Dialog>
      <Tooltip>
      <TooltipTrigger asChild>
       <Button size={"icon"} variant={"outline"} asChild>
        <DialogTrigger>
          <UserPlus />
        </DialogTrigger>
       </Button>
      </TooltipTrigger>
      <TooltipContent>
        Add Friend      
     </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add friend</DialogTitle>
          <DialogDescription>
            Send a request to connect with a friend.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
             <FormField control={form.control} name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email..." {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
             />
             <DialogFooter>
               <Button  disabled={false}
               type='submit'>Send</Button>
             </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    
  )
}

export default AddFriendDialog
