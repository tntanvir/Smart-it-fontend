import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Slot : "button"
  
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
    ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-neutral-800 dark:hover:text-white text-gray-700 dark:text-neutral-300",
    link: "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-black dark:focus-visible:ring-indigo-400"
  
  const variantStyles = variants[variant || "default"]
  const sizeStyles = sizes[size || "default"]

  return (
    <Comp
      className={cn(baseStyles, variantStyles, sizeStyles, className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
