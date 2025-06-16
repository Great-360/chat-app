import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const AddFrienFormSchema =  z.object({
    email: z.string().min(1,{message: "This field can't be empty"})
    .email("Please enter a valid email")
})
const AddFriendDialog = () => {

    const form = useForm<z.infer<typeof AddFrienFormSchema>>({
        resolver: zodResolver(AddFrienFormSchema),
        defaultValues: {
            email: "",
        }
    })
  return (
    <div>
      
    </div>
  )
}

export default AddFriendDialog
