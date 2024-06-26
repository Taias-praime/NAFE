import * as React from "react"

import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
  }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <>
        {label && <label htmlFor={label.toLowerCase()}> {label} </label>}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full border-b border-primary bg-transparent px-0 py-2 text-sm ring-offset-background placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
