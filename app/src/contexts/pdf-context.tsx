import { createContext, useContext, useState, ReactNode } from 'react';

interface PDFContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const PDFProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <PDFContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};