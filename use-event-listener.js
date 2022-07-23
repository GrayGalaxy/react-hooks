import { useEffect, useRef } from 'react';
/**
 * Hook to use event listener
 * @param event_name - Window or Element event name
 * @param callback - Callback function
 * @param element - Element to attach event listener to
 */
export function useEventListener(event_name, callback, element) {
	// Create a ref that stores handler
	const handler = useRef(callback);
	useEffect(() => {
		// Define the listening target
		const targetElement = element?.current || window;
		if (!(targetElement && targetElement.addEventListener)) {
			return;
		}
		// Add event listener
		const eventListener = (event) => {
			if (!!handler?.current)
				handler.current(event);
		};
		targetElement.addEventListener(event_name, eventListener);
		return () => {
			targetElement.removeEventListener(event_name, eventListener);
		};
	}, [event_name, element, callback]);
}
export default useEventListener;
