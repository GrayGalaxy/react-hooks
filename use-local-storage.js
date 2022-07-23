import { useCallback, useLayoutEffect, useState } from 'react';
import useEventListener from './use-event-listener';
import useEventCallback from './use-event-callback';
function parseJSON(value) {
	if (!value)
		return;
	return JSON.parse(value ?? '');
}
/**
 * Hook to use localStorage
 * @param {string} key - Storage key
 * @param {Type} initial - Initial value
 * @returns {[Type, SetValue<Type>]} - [value, setValue]
 */
export function useLocalStorage(key, initial) {
	const [storedValue, setStoredValue] = useState(initial);
	const getValue = useCallback(() => {
		// error handling for server-side
		if (typeof window === 'undefined') {
			return initial;
		}
		try {
			const item = window.localStorage.getItem(key);
			return parseJSON(item) || initial;
		}
		catch (err) {
			console.warn(`Error reading localStorage key "${key}":`, err);
			return initial;
		}
	}, [initial, key]);
	const setValue = useEventCallback((value) => {
		if (typeof window === 'undefined') {
			console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
		}
		try {
			const newValue = value instanceof Function ? value(storedValue) : value;
			window.localStorage.setItem(key, JSON.stringify(newValue));
			setStoredValue(newValue);
			window.dispatchEvent(new Event('local-storage'));
		}
		catch (err) {
			console.warn(`Error setting localStorage key "${key}":`, err);
		}
	});
	const handleChange = () => setStoredValue(getValue());
	useLayoutEffect(handleChange);
	useEventListener('local-storage', handleChange);
	useEventListener('storage', (e) => {
		if (e.key && e.key === key)
			handleChange;
	});
	return [storedValue, setValue];
}
export default useLocalStorage;
