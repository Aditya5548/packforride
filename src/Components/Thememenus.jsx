import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch (flash of wrong theme)
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center transition-colors duration-300 fixed bottom-3 right-3">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-3 py-2 rounded-l-md bg-black text-white dark:bg-gray-200 dark:text-black hover:brightness-90 transition font-bold"
      >
      Light
      </button>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-3 py-2 rounded-r-md bg-gray-200 text-black dark:bg-black dark:text-white hover:brightness-90 transition font-bold"
      >
      Dark
      </button>
    </div>
  );
}