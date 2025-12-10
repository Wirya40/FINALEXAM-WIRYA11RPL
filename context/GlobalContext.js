"use client";
import { createContext, useState } from "react";

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <GlobalContext.Provider value={{ theme, setTheme }}>
      {children}
    </GlobalContext.Provider>
  );
}
