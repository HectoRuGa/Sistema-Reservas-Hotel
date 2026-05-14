import * as React from "react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({
  open: false,
  onOpenChange: () => {},
})

function Dialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ asChild, children, onClick, ...props }) {
  const { onOpenChange } = React.useContext(DialogContext)
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e)
        onClick?.(e)
        onOpenChange(true)
      },
    })
  }
  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

function DialogClose({ asChild, children, onClick, ...props }) {
  const { onOpenChange } = React.useContext(DialogContext)
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e)
        onClick?.(e)
        onOpenChange(false)
      },
    })
  }
  return (
    <button onClick={() => onOpenChange(false)} {...props}>
      {children}
    </button>
  )
}

function DialogContent({ className, children, ...props }) {
  const { open, onOpenChange } = React.useContext(DialogContext)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "relative z-50 bg-white rounded-lg border shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

Dialog.Trigger = DialogTrigger
Dialog.Close = DialogClose
Dialog.Content = DialogContent
Dialog.Header = DialogHeader
Dialog.Footer = DialogFooter
Dialog.Title = DialogTitle
Dialog.Description = DialogDescription

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
