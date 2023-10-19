"use client"
import axios from "axios"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Loader2 } from "@/lib/icons"
import { useForm } from "react-hook-form"
import { z, zodResolver } from "@/lib/zod"
import Modal from "@/components/Global/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRestaurantModal } from "@/hooks/use-restaurant-modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
})

export const RestaurantModal = () => {
  const { toast } = useToast()
  const restaurantModal = useRestaurantModal()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      const restaurant = await axios.post("/api/restaurant", values)

      window.location.assign(`/${restaurant.data.id}`)
    } catch (error: any) {
      toast({
        title: "🚫 Uh oh! Something went wrong.",
        description:
          error.response.data !== undefined || error.response.data !== null || error.response.data !== "" ? error.response.data : "There was a problem with your request.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Create new restaurant" description="Add a new restaurant to manage food and categories" isOpen={restaurantModal.isOpen} onClose={restaurantModal.onClose}>
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" disabled={loading} placeholder="Restaurant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button variant="outline" disabled={loading} onClick={restaurantModal.onClose}>
                <span>Cancel</span>
              </Button>
              <Button disabled={loading} type="submit">
                <Loader2 className={cn("mr-2 h-4 w-4 animate-spin hidden", loading && "block")} />
                <span>Continue</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}
