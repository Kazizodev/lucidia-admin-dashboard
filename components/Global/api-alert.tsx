"use client"
import { Copy, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ApiAlertProps {
  title: string
  description: string
  variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
}

const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant }) => {
  const { toast } = useToast()

  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description)
    toast({
      description: "👍 Link coppied to clipboard."
    })
  }

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{description}</code>
        <Button variant="outline" size="icon" onClick={() => onCopy(description)}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default ApiAlert
