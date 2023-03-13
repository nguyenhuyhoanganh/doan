import {
  FloatingPortal,
  useFloating,
  arrow,
  shift,
  offset,
  useInteractions,
  useHover,
  useDismiss
} from '@floating-ui/react-dom-interactions'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'

const Tooltip = ({
  children,
  content,
  clasaName,
  as: Element = 'div',
  initialOpen,
  placement = 'top',
  offsetValue = 10,
  open = true
}) => {
  const id = useId()
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef(null)
  const { x, y, reference, floating, strategy, middlewareData, context } = useFloating({
    middleware: [offset(offsetValue), shift(), arrow({ element: arrowRef })],
    placement: placement,
    open: isOpen,
    onOpenChange: (newIsOpen) => {
      open ? setIsOpen(newIsOpen) : setIsOpen(false)
    }
  })

  useEffect(() => {
    !open && setIsOpen(false)
  }, [open])

  const hover = useHover(context, {
    delay: {
      open: 0,
      close: 0
    }
  })
  const dismiss = useDismiss(context, {
    ancestorScroll: true
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss])
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
                transformOrigin: `bottom`,
                zIndex: 50
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span className='rounded-lg bg-gray-700 px-3 py-1 text-white shadow-lg'>{content}</span>
              <span
                ref={arrowRef}
                className={`absolute bottom-[-32px] translate-y-[-95%] border-[0.5rem] border-x-transparent border-b-transparent border-t-gray-700`}
                style={{
                  left: middlewareData.arrow?.x
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}

export default Tooltip
