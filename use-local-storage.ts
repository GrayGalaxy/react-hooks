import { useEffect, useState } from 'react'
import useEvent from './use-event'
// type definitions
import type { Dispatch, SetStateAction } from 'react'

type SetValue<T> = Dispatch<SetStateAction<T>>
declare global {
	interface WindowEventMap {
		'local-storage': CustomEvent
	}
}

function parseJSON<T>(value?: string): T | undefined {
	if (!value) return
	return JSON.parse(value ?? '')
}

/**
 * Hook to use localStorage
 * @param {string} key - Storage key
 * @param {Type} initial - Initial value
 * @returns {[Type, SetValue<Type>]} - [value, setValue]
 */
export function useLocalStorage<T>(
	key: string,
	initial: T,
): [T, SetValue<T>] {
	const [storedValue, setStoredValue] = useState<T>(initial)

	const getValue = (): T => {
		// error handling for serverside
		if (typeof window === 'undefined')
			return initial
		try {
			const item = window.localStorage.getItem(key)
			return item ? (parseJSON(item) as T) : initial
		} catch (err) {
			console.warn(`Error reading localStorage key "${key}":`, err)
			return initial
		}
	}

	const setValue: SetValue<T> = (value) => {
		if (typeof window === 'undefined')
			console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`)
		try {
			const newValue = value instanceof Function ? value(storedValue) : value
			window.localStorage.setItem(key, JSON.stringify(newValue))
			setStoredValue(newValue)
			window.dispatchEvent(new Event('local-storage'))
		} catch (err) {
			console.warn(`Error setting localStorage key "${key}":`, err)
		}
	}

	const handleChange = () => setStoredValue(getValue())
	// eslint-disable-next-line
	useEffect(handleChange, [])
	useEvent('storage', handleChange)
	useEvent('local-storage', handleChange)

	return [storedValue, setValue]
}

export default useLocalStorage
