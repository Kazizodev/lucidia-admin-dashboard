"use client"
import axios from "axios"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Trash } from "lucide-react"
import { Loader2 } from "@/lib/icons"
import { useForm } from "react-hook-form"
import { z, zodResolver } from "@/lib/zod"
import { billboard } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useOrigin } from "@/hooks/use-origin"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import ImageUpload from "@/components/ui/image-upload"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/Global/alert-modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface BillboardFormProps {
  initialData: billboard | null
}

const formSchema = z.object({
  label: z.string().min(1, "Name must be at least 3 characters long"),
  imageUrl: z.string().url("Invalid URL"),
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit Billboard" : "Create Billboard"
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard"
  const toastMessage = initialData ? "Billboard updated." : "Billboard created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  })

  const onSubmit = async (data: BillboardFormValues) => {
    // try {
    //   setLoading(true)
    //   await axios.patch(`/api/restaurant/${initialData.id}`, data)
    //   toast({
    //     title: "👍 Success!",
    //     description: toastMessage,
    //   })
    //   router.refresh()
    // } catch (error: any) {
    //   toast({
    //     title: "🚫 Uh oh! Something went wrong.",
    //     description:
    //       error.response.data !== undefined || error.response.data !== null || error.response.data !== "" ? error.response.data : "There was a problem with your request.",
    //   })
    // } finally {
    //   setLoading(false)
    // }
  }
  const onDelete = async () => {
    // try {
    //   setLoading(true)
    //   await axios.delete(`/api/restaurant/${initialData.id}`)
    //   router.refresh()
    //   router.push("/")
    //   toast({
    //     title: "👍 Success!",
    //     description: "Your billboard has been deleted.",
    //   })
    // } catch (error: any) {
    //   toast({
    //     title: "🚫 Uh oh! Something went wrong.",
    //     description:
    //       error.response.data !== undefined || error.response.data !== null || error.response.data !== "" ? error.response.data : "There was a problem with your request.",
    //   })
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <section className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </section>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit">
            <Loader2 className={cn("mr-2 h-4 w-4 animate-spin hidden", loading && "block")} />
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default BillboardForm
