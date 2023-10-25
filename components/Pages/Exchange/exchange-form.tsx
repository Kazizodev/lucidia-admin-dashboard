"use client"
import axios from "axios"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "@/lib/icons"
import { useForm } from "react-hook-form"
import { z, zodResolver } from "@/lib/zod"
import { exchangerate } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useOrigin } from "@/hooks/use-origin"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { useToast } from "@/components/ui/use-toast"
import ApiAlert from "@/components/Global/api-alert"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface ExchangeFormProps {
  initialData: exchangerate | null
}

const formSchema = z.object({
  rate: z.coerce.number().min(0),
})

type ExchangeFormValues = z.infer<typeof formSchema>

const ExchangeForm: React.FC<ExchangeFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const form = useForm<ExchangeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { ...initialData, rate: parseFloat(String(initialData.rate)) } : { rate: 0 },
  })

  const onSubmit = async (data: ExchangeFormValues) => {
    try {
      setLoading(true)
      await axios.post(`/api/restaurant/${params.restaurantId}/exchange`, data)
      toast({ title: "👍 Success!", description: "Your changes have been saved." })
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

  return (
    <>
      <Heading title="Exchange" description="Manage Lebanese Dollar exchange rate preferences" />
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input disabled={loading} type="number" placeholder="89,000 LBP" {...field} />
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

      <ApiAlert title="GET" description={`${origin}/api/restaurant/${params.restaurantId}/exchange`} variant="public" />
    </>
  )
}

export default ExchangeForm
