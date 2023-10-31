"use client"
import { cn, formatterLBP } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"

const RateButton = ({ exchange }: { exchange: number }) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Button
      variant="ghost"
      className={cn(pathname == `/${pathname.split("/")[1]}/exchange` && "bg-accent text-accent-foreground")}
      onClick={() => router.push(`/${pathname.split("/")[1]}/exchange`)}
    >
      {formatterLBP.format(exchange)}
    </Button>
  )
}

export default RateButton
