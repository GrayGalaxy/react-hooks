import { useState, useRef, useCallback } from 'react'

interface Options {
	enterDelay?: number
	exitDelay?: number
}

/**
 * Hook for delayed render & unmount
 * @link https://github.com/pacocoursey/use-delayed-render
 * @param {boolean} active - Render immediately
 * @param {Options} options - Set delay on mount and unmount
 * @returns [isMounted, isRendered]
 */
export function useDelayedRender(
	active: boolean = false,
	options: Options = {}
) {
	const [, force] = useState<any>()
	const mounted = useRef(active)
	const rendered = useRef(false)
	const renderTimer = useRef<NodeJS.Timeout | null>(null)
	const unmountTimer = useRef<NodeJS.Timeout | null>(null)
	const prevActive = useRef(active)

	const recalculate = useCallback(() => {
		const { enterDelay = 1, exitDelay = 0 } = options

		if (prevActive.current) {
			mounted.current = true
			if (unmountTimer.current) {
				clearTimeout(unmountTimer.current)
			}
			if (enterDelay <= 0) {
				rendered.current = true
			} else {
				if (renderTimer.current) return
				// Render after a delay
				renderTimer.current = setTimeout(() => {
					rendered.current = true
					renderTimer.current = null
					force({})
				}, enterDelay)
			}
		} else {
			rendered.current = false
			if (exitDelay <= 0) {
				mounted.current = false
			} else {
				if (unmountTimer.current) return
				// Unmount after a delay
				unmountTimer.current = setTimeout(() => {
					mounted.current = false
					unmountTimer.current = null
					force({})
				}, exitDelay)
			}
		}
	}, [options])

	// When the active prop changes, need to re-calculate
	if (active !== prevActive.current) {
		prevActive.current = active
		recalculate()
	}

	return [
		mounted.current,
		rendered.current
	]
}

export default useDelayedRender
