// context/ResultsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ResultsData {
  class_label: string;
  confidence: number;
}

interface ResultsContextType {
  results: ResultsData | null;
  setResults: (results: ResultsData | null) => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<ResultsData | null>(null);

  return (
    <ResultsContext.Provider value={{ results, setResults }}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = (): ResultsContextType => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error("useResults must be used within a ResultsProvider");
  }
  return context;
};
