import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProgressContextType {
  progress: number;
  setProgress: (value: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [progress, setProgress] = useState<number>(0);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
