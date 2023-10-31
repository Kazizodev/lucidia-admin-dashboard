"use client"
import {
  Beef,
  Check,
  ChevronsUpDown,
  // PlusCircle
} from "lucide-react"
import {
  Command,
  CommandItem,
  CommandList,
  CommandGroup,
  // CommandSeparator, CommandEmpty, CommandInput
} from "@/components/ui/command"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { restaurant } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { useRestaurantModal } from "@/hooks/use-restaurant-modal"

type PopoverTriggerProps = React.ComponentProps<typeof PopoverTrigger>

interface RestaurantSwictherProps extends PopoverTriggerProps {
  items: restaurant[]
}

const RestaurantSwicther = ({ className, items = [] }: RestaurantSwictherProps) => {
  // const restaurantModal = useRestaurantModal()
  const params = useParams()
  const router = useRouter()

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const currentRestaurant = formattedItems.find((item) => item.value === params.restaurantId)

  const [open, setOpen] = useState(false)
  const onRestaurantSelect = (restaurant: { value: string; label: string }) => {
    setOpen(false)
    router.push(`/${restaurant.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a restaurant" className={cn("w-[220px] justify-between capitalize", className)}>
          <Beef className="mr-2 h-4 w-4" />
          {currentRestaurant?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandList>
            {/* <CommandInput placeholder="Search restaurants..." />
            <CommandEmpty>No restaurants found.</CommandEmpty> */}
            <CommandGroup heading="Restaurants">
              {formattedItems.map((item) => (
                <CommandItem key={item.value} onSelect={() => onRestaurantSelect(item)} className="capitalize cursor-pointer">
                  <Beef className="mr-2 h-4 w-4" />
                  {item.label}
                  <Check className={cn("ml-auto h-4 w-4", currentRestaurant?.value === item.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {/* <CommandSeparator />

          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  restaurantModal.onOpen()
                }}
                className="cursor-pointer"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create new restaurant
              </CommandItem>
            </CommandGroup>
          </CommandList> */}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default RestaurantSwicther
