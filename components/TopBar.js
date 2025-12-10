import Link from "next/link";
import { Switch } from "antd";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    setTheme(isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="w-full shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">My Shop</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Dashboard
          </Link>
          

          <Switch checked={theme === "dark"} onChange={toggleTheme} />
        </div>
      </div>
    </div>
  );
}
