import * as React from "react"

import { cn } from "../../lib/utils"
import { ErrorMessage } from "./error";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  divClass?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, divClass, ...props }, ref) => {
    return (
      <div className={divClass} >
        {label && <label htmlFor={label.toLowerCase()}> {label} </label>}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full border-b border-primary bg-transparent px-0 py-2 text-sm ring-offset-background placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea"

export { Textarea }
