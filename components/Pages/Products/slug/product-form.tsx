"use client"
import axios from "axios"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Trash } from "lucide-react"
import { Loader2 } from "@/lib/icons"
import { category, image, product } from "@prisma/client"
import { useForm } from "react-hook-form"
import { z, zodResolver } from "@/lib/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import ImageUpload from "@/components/ui/image-upload"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/Global/alert-modal"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductFormProps {
  initialData: (product & { images: image[] }) | null
  categories: category[]
}

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 3 characters long"),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(0),
  categoryId: z.string().min(1, "Category is required"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const params = useParams()
  const router = useRouter()

  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit Product" : "Create Product"
  const description = initialData ? "Edit a Product" : "Add a new Product"
  const toastMessage = initialData ? "Product updated." : "Product created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData.price)) }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          isFeatured: false,
          isArchived: false,
        },
  })

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)

      if (initialData) await axios.patch(`/api/${params.restaurantId}/products/${params.productId}`, data)
      else await axios.post(`/api/${params.restaurantId}/products`, data)

      toast({ title: "👍 Success!", description: toastMessage })
      router.refresh()
      router.push(`/${params.restaurantId}/products`)
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
      await axios.delete(`/api/${params.restaurantId}/products/${params.productId}`)
      router.refresh()
      router.push(`/${params.restaurantId}/products`)
      toast({ title: "👍 Success!", description: "Your product has been deleted." })
    } catch (error: any) {
      toast({ title: "🚫 Uh oh! Something went wrong." })
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((image) => image.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input disabled={loading} min={0} type="number" placeholder="1.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <Separator />
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-2 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>This product will appear on the home page</FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-2 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>This product will not appear anywhere in the store</FormDescription>
                  </div>
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

export default ProductForm
