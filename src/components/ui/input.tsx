
import { cn } from "../../lib/utils"
import { InputHTMLAttributes, forwardRef } from "react";


export interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
      label?: string;
    }


const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, label, ...props }, ref) => {
    return (
      <>
        { label && <label htmlFor={label.toLowerCase()}> {label} </label> }
        <input
          type={type}
          className={cn(
            "flex h-10 w-full border-b border-primary bg-transparent px-0 py-2 text-foreground text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:opacity-75 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }
