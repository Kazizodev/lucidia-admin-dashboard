"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function Nav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const params = useParams()

  const routes = [
    {
      href: `/${params.restaurantId}`,
      label: "Dashboard",
      active: pathname === `/${params.restaurantId}`,
    },
    {
      href: `/${params.restaurantId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.restaurantId}/billboards`,
    },
    {
      href: `/${params.restaurantId}/settings`,
      label: "Settings",
      active: pathname === `/${params.restaurantId}/settings`,
    },
  ]

  return (
    <nav className={cn("flex items-center gap-4 lg:gap-6", className)}>
      {routes.map((route, index) => (
        <Link
          key={index}
          href={route.href}
          className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-gray-900 dark:text-gray-100" : "text-muted-foreground")}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
