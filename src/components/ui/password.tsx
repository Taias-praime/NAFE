
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils"
import { InputHTMLAttributes, forwardRef, useState } from "react";


export interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}


export const Password = forwardRef<HTMLInputElement, InputProps>(({ className, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {label && <label htmlFor={label.toLowerCase()}> {label} </label>}
            <div className="flex relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        "flex h-10 w-full border-b border-primary bg-transparent px-0 py-2 text-foreground text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <button onClick={() => setShowPassword(!showPassword)} type="button" className="absolute right-0" >
                   {showPassword ? <Eye /> : <EyeOff />} 
                </button>
                
            </div>

        </>
    )
}
)
