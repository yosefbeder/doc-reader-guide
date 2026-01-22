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
  ];

  return colors[index % colors.length];
}
