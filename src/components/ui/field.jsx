import { cn } from "@/lib/utils"

function FieldGroup({ className, ...props }) {
  return <div className={cn("px-6 pb-6 space-y-4", className)} {...props} />
}

function Field({ className, ...props }) {
  return <div className={cn("space-y-2", className)} {...props} />
}

export { Field, FieldGroup }
