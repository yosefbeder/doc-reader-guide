/**
 * Converts an index number to a consistent hex color and its human-readable name.
 * Uses a curated palette of vibrant, professional colors.
 */
export default function indexToColor(index: number): {
  hex: string;
  name: string;
} {
  const colors = [
    { hex: "#2563eb", name: "Blue" },
    { hex: "#dc2626", name: "Red" },
    { hex: "#16a34a", name: "Green" },
    { hex: "#ca8a04", name: "Yellow" },
    { hex: "#9333ea", name: "Purple" },
    { hex: "#0891b2", name: "Cyan" },
    { hex: "#ea580c", name: "Orange" },
    { hex: "#db2777", name: "Pink" },
    { hex: "#4f46e5", name: "Indigo" },
    { hex: "#059669", name: "Emerald" },
    { hex: "#0284c7", name: "Sky" },
    { hex: "#e11d48", name: "Rose" },
    { hex: "#d97706", name: "Amber" },
    { hex: "#65a30d", name: "Lime" },
    { hex: "#c026d3", name: "Fuchsia" },
    { hex: "#7c3aed", name: "Violet" },
    { hex: "#0d9488", name: "Teal" },
    { hex: "#4b5563", name: "Gray" },
    { hex: "#000000", name: "Black" },
  ];

  return colors[index % colors.length];
}
