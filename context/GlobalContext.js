import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [theme, setTheme] = useState("light"); // "light" or "dark"
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <GlobalContext.Provider
      value={{ theme, setTheme, selectedCategory, setSelectedCategory }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
