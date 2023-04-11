import {
  FloatingPortal,
  useFloating,
  arrow,
  shift,
  offset,
  useClick,
  useInteractions,
  useHover,
  useDismiss,
  safePolygon
} from '@floating-ui/react-dom-interactions'
import { motion, AnimatePresence } from 'framer-motion'
import { useId, useRef, useState } from 'react'

const Popover = ({
  children, // đoạn JSX tương tác sẽ hiển thị popover
  renderPopover, // đoạn JSX để hiển thị popover
  clasaName, // css cho component bao bọc lấy children
  as: Element = 'div', // loại component sẽ bao bọc lấy children, mặc đinh là div
  initialOpen, // ban đầu mở hay đóng
  placement = 'bottom-end', // vị trí của popover: bottom, top, left, right, start, end. mặc định 'bottom-end'
  zindex = 50, // z-index
  offsetValue = 10, // khoảng cách popover với children
  hasArrow = false, // có arrow hay không
  shrinkedPopoverPosition = '', // vị trí animation hiển thị popover mở lên thu lại, mặc định là vị trí trên cùng của arrow
  trigger = 'hover', // sự kiện mở lên popover: click hoặc hover
  delayHover = {
    open: 100,
    close: 500
  }, // thời gian mở lên, thu lại popover
  onOpenChange // nếu muốn theo dõi sự kiện open và close của popover ở component cha, cung cấp function để chnage state open ngoài component cha
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

  // custom handle toogle
  const handleCloseIfOpen = () => {
    if (trigger === 'click') {
      isOpen && setIsOpen(false)
      isOpen && onOpenChange && onOpenChange(false)
    }
  }

  const click = useClick(context, {
    enabled: trigger === 'click',
    // turn of toggle make popover can interactive
    toggle: false
  })
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    delay: delayHover,
    handleClose: safePolygon()
  })
  const dismiss = useDismiss(context, {
    ancestorScroll: true
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss])
  return (
    <div {...getReferenceProps()} ref={reference}>
      <Element className={clasaName} onClick={handleCloseIfOpen}>
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
    </div>
  )
}

export default Popover
