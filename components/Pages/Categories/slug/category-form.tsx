"use client"
import axios from "axios"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Trash } from "lucide-react"
import { Loader2 } from "@/lib/icons"
import { category } from "@prisma/client"
import { useForm } from "react-hook-form"
import { z, zodResolver } from "@/lib/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/Global/alert-modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface CategoryFormProps {
  initialData: category | null
}

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 3 characters long"),
})

type CategoryFormValues = z.infer<typeof formSchema>

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()

  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit Category" : "Create Category"
  const description = initialData ? "Edit a Category" : "Add a new Category"
  const toastMessage = initialData ? "Category updated." : "Category created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "" },
  })

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true)

      if (initialData) await axios.patch(`/api/${params.restaurantId}/categories/${params.categoryId}`, data)
      else await axios.post(`/api/${params.restaurantId}/categories`, data)

      toast({ title: "👍 Success!", description: toastMessage })
      router.refresh()
      router.push(`/${params.restaurantId}/categories`)
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
      await axios.delete(`/api/${params.restaurantId}/categories/${params.categoryId}`)
      router.refresh()
      router.push(`/${params.restaurantId}/categories`)
      toast({ title: "👍 Success!", description: "Your category has been deleted." })
    } catch (error: any) {
      toast({ title: "🚫 Uh oh! Something went wrong.", description: "Make sure you removed all products using this category first." })
    } finally {
      setLoading(false)
    }
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} autoFocus placeholder="Category name" {...field} />
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

export default CategoryForm
