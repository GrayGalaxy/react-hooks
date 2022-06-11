import { useEffect, useRef } from 'react'
// type definitions
import type { RefObject } from 'react'

/**
 * Hook to use event listener
 * @param key - Window event name
 * @param callback - Callback function
 * @param element - Element to attach event listener to
 */
export function useEvent<T extends HTMLElement = HTMLDivElement>(
	event: keyof WindowEventMap,
	callback: (event: Event) => void,
	element?: RefObject<T>,
) {
	// Create a ref that stores handler
	const handler = useRef<(event: Event) => void>()

	useEffect(() => {
		// Define the listening target
		const targetElement: T | Window = element?.current || window
		if (!(targetElement && targetElement.addEventListener)) return
		// Update saved handler if necessary
		if (handler.current !== callback) handler.current = callback
		// Add event listener
		const eventListener = (event: Event) => {
			if (!!handler?.current) handler.current(event)
		}
		targetElement.addEventListener(event, eventListener)
		return () => {
			targetElement.removeEventListener(event, eventListener)
		}
	}, [event, element, callback])
}

export default useEvent
