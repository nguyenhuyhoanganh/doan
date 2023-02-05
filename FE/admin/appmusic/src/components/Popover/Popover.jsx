import { FloatingPortal, useFloating, arrow, shift, offset } from '@floating-ui/react-dom-interactions'
import { motion, AnimatePresence } from 'framer-motion'
import { useId, useRef, useState } from 'react'

const Popover = ({
  children,
  renderPopover,
  clasaName,
  as: Element = 'div',
  initialOpen,
  placement = 'bottom-end'
}) => {
  const id = useId()
  const [open, setOpen] = useState(initialOpen || false)
  const arrowRef = useRef(null)
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [offset(10), shift(), arrow({ element: arrowRef })],
    placement: placement
  })
  let timeout
  const showPopover = () => {
    timeout && clearTimeout(timeout)
    setOpen(true)
  }
  const hidePopover = () => {
    timeout = setTimeout(() => {
      setOpen(false)
    }, 300)
  }

  return (
    <Element className={clasaName} onMouseEnter={showPopover} onMouseLeave={hidePopover} ref={reference}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`,
                zIndex: 50
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className='absolute translate-y-[-95%] border-[0.5rem] border-y-[0.75rem] border-x-transparent border-t-transparent border-b-gray-50'
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
