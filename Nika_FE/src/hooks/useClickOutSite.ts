'use client'

import { useEffect, RefObject } from 'react'

type Event = MouseEvent | TouchEvent

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current) return
      if (ref.current.contains((event?.target as Node) || null)) return
      handler(event)
    }
    document.addEventListener('mouseup', listener)
    return () => {
      document.removeEventListener('mouseup', listener)
    }
  }, [ref, handler])
}
