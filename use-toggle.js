import { useState } from "react";
// convert to boolean balue
const boolean = (v) => (typeof v === "boolean" ? v : v === 'true');
/**
 * Returns a boolean value and a function that toggles a that initial value
 * @param {boolean | 'true' | 'false'} initial - define the initial value
 * @returns {[boolean, (v?: boolean) => void]}
 */
function useToggle(initial = false) {
	const [value, setValue] = useState(boolean(initial));
	// toggle function
	const toggleValue = (value) => {
		setValue(c => typeof value === "boolean" ? value : !c);
	};
	return [value, toggleValue];
}
// Export Hook
export { useToggle };
export default useToggle;
