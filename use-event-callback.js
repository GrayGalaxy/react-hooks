import { useLayoutEffect, useCallback, useRef } from 'react';
/**
 * Simplified version of useCallback in react
 * @param callback - function call
 */
export function useEventCallback(callback) {
	const ref = useRef(() => {
		throw new Error('Cannot call an event handler while rendering.');
	});
	useLayoutEffect(() => {
		ref.current = callback;
	});
	return useCallback((...args) => ref.current(...args), [ref]);
}
export default useEventCallback;
