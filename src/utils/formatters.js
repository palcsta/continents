/**
 * Formats a number by adding spaces as thousands separators.
 * @param {number|string} number - The number to format.
 * @returns {JSX.Element|string} - The formatted string.
 */
export const numberChanger = (number) => {
  if (number == null) return '-';
  
  // Use toLocaleString for a cleaner, localized number formatting
  return number.toLocaleString('en-US').replace(/,/g, ' ');
};

/**
 * Generates a random hex color string.
 * @returns {string} - Random hex color (e.g., "#3a1b2c").
 */
export const getNewColor = () => {
  const R = Math.round(Math.random() * 255).toString(16).padStart(2, '0');
  const G = Math.round(Math.random() * 255).toString(16).padStart(2, '0');
  const B = Math.round(Math.random() * 255).toString(16).padStart(2, '0');
  return `#${R}${G}${B}`;
};
