import { useState } from 'react'
import useEvent from './use-event'

function status(): boolean {
	let online = typeof navigator !== 'undefined'
	if (online) online = typeof navigator.onLine === 'boolean' ? navigator.onLine : true
	return online
}

/**
 * Checks if the host is online
 * @returns { boolean }
 */
export function useOnlineStatus(): boolean {
	const [online, setOnline] = useState(status())
	useEvent('online', () => setOnline(true))
	useEvent('offline', () => setOnline(false))
	return online
}

export default useOnlineStatus
