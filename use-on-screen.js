import { useEffect, useState } from 'react';
/**
 * Hook to check if an element is visible on screen
 * @param {MutableRefObject} ref - Element reference
 * @param {number} margin - Screen Margin to trigger the callback
 * @returns {boolean} - Returns true if the element is in view
 */
export function useOnScreen(ref, margin = 0) {
	const [isVisible, setIsVisible] = useState(false);
	useEffect(() => {
		if (!ref.current)
			return;
		const rootMargin = `${margin}px`;
		const observer = new IntersectionObserver(([entry]) => {
			setIsVisible(entry.isIntersecting);
		}, { rootMargin });
		observer.observe(ref.current);
		return () => {
			if (!ref.current)
				return;
			observer.unobserve(ref.current);
		};
	}, [ref.current, margin]);
	return isVisible;
}
export default useOnScreen;
