import {
  FloatingPortal,
  useFloating,
  arrow,
  shift,
  offset,
  useClick,
  useInteractions,
  useHover,
  useDismiss
} from '@floating-ui/react-dom-interactions'
import { motion, AnimatePresence } from 'framer-motion'
import { useId, useRef, useState } from 'react'

const Popover = ({
  children,
  renderPopover,
  clasaName,
  as: Element = 'div',
  initialOpen,
  placement = 'bottom-end',
  zindex = 50,
  offsetValue = 10,
  hasArrow = false,
  shrinkedPopoverPosition = '',
  trigger = 'hover',
  onOpenChange
}) => {
  const id = useId()
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef(null)
  const { x, y, reference, floating, strategy, middlewareData, context } = useFloating({
    middleware: [offset(offsetValue), shift(), arrow({ element: arrowRef })],
    placement: placement,
    open: isOpen,
    onOpenChange: (newIsOpen) => {
      setIsOpen(newIsOpen)
      onOpenChange && onOpenChange(newIsOpen)
    }
  })

  const click = useClick(context, {
    enabled: trigger === 'click'
  })
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    delay: {
      open: 100,
      close: 500
    }
  })
  const dismiss = useDismiss(context, {
    ancestorScroll: true
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss])
  return (
    <Element className={clasaName} ref={reference} {...getReferenceProps()}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={floating}
              {...getFloatingProps()}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin:
                  shrinkedPopoverPosition === '' ? `${middlewareData.arrow?.x}px top` : shrinkedPopoverPosition,
                zIndex: zindex
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className={`absolute translate-y-[-95%] border-[0.5rem] border-y-[0.75rem] border-x-transparent border-t-transparent border-b-gray-50 ${
                  !hasArrow && 'opacity-0'
                }`}
                style={{
                  top: middlewareData.arrow?.y,
                  left: middlewareData.arrow?.x
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}

export default Popover
