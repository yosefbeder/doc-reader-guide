const themeScript = `(function () {
    try {
      const stored = localStorage.getItem("settings");
      // Fallback to default setting if storage is empty or fails
      const settings = stored ? JSON.parse(stored) : { appearance: { theme: "system" } };
      const theme = settings.appearance.theme;

      // Apply 'dark' class based on saved preference or system preference
      if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");  
      }
    } catch (e) {
      // Safely ignore errors (e.g., localStorage is inaccessible)
    }
  })();`;

export default themeScript;
