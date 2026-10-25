import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

type FormFieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
}

export function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-neutral-700">
        {label}
      </Label>
      {children}
    </div>
  )
}
