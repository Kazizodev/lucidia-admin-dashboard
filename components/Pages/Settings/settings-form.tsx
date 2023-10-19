"use client"
import axios from "axios"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Trash } from "lucide-react"
import { Loader2 } from "@/lib/icons"
import { useForm } from "react-hook-form"
import { z, zodResolver } from "@/lib/zod"
import { restaurant } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useOrigin } from "@/hooks/use-origin"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { useToast } from "@/components/ui/use-toast"
import ApiAlert from "@/components/Global/api-alert"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/Global/alert-modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface SettingsFormProps {
  initialData: restaurant
}

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true)

      await axios.patch(`/api/restaurant/${initialData.id}`, data)

      toast({
        title: "👍 Success!",
        description: "Your changes have been saved.",
      })

      router.refresh()
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

  const onDelete = async () => {
    try {
      setLoading(true)

      await axios.delete(`/api/restaurant/${initialData.id}`)

      router.refresh()
      router.push("/")
      toast({
        title: "👍 Success!",
        description: "Your restaurant has been deleted.",
      })
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
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <section className="flex items-center justify-between">
        <Heading title="Settings" description="Manage restaurant preferences" />
        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          <Trash className="w-4 h-4" />
        </Button>
      </section>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Restaurant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit">
            <Loader2 className={cn("mr-2 h-4 w-4 animate-spin hidden", loading && "block")} />
            Save changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.restaurantId}`} variant="public" />
    </>
  )
}

export default SettingsForm
