import { Dialog, Portal, CloseButton } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface ModalTemplateProps {
  open?: boolean
  onOpenChange?: (details: { open: boolean }) => void
  
  trigger?: ReactNode
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function ModalTemplate({ 
  open, 
  onOpenChange, 
  trigger, 
  title, 
  children, 
  footer 
}: ModalTemplateProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      
      {trigger && (
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
      )}

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {children}
            </Dialog.Body>

            <Dialog.Footer>
               {footer}
               <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" variant="ghost" />
               </Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}