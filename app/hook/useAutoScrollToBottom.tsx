import { useEffect, useRef, useState } from 'react'

type ScrollDirection = 'x' | 'y' | 'both'

const useAutoScrollToBottom = <T extends HTMLElement>(
  direction: ScrollDirection = 'y'
) => {
  const containerRef = useRef<T | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (containerRef.current && !isHovering) {
        if (direction === 'x' || direction === 'both') {
          containerRef.current.scrollLeft = containerRef.current.scrollWidth
        }
        if (direction === 'y' || direction === 'both') {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      }
    })

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    if (containerRef.current) {
      containerRef.current.addEventListener('mouseenter', handleMouseEnter)
      containerRef.current.addEventListener('mouseleave', handleMouseLeave)

      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }

    return () => {
      observer.disconnect()
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter)
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [direction, isHovering])

  return containerRef
}

export default useAutoScrollToBottom
