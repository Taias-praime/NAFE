
import { cn } from "../../lib/utils"
import { InputHTMLAttributes, forwardRef } from "react";
import ErrorMessage from "./error";


export interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
      label?: string;
      error?: string;
      divClass?: string;
    }


const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, label, error, divClass, ...props }, ref) => {
    return (
      <div className={divClass} >
        { label && <label htmlFor={label.toLowerCase()}> {label} </label> }
        <input
          type={type}
          className={cn(
            "flex h-10 w-full border-b border-primary bg-transparent px-0 py-2 text-foreground text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <ErrorMessage error={error} />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
