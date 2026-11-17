import { createContext, useContext, useState } from 'react';

export type Language = 'es' | 'en';

interface LangContextValue {
  lang: Language;
  setLang: (l: Language) => void;
}

export const LangContext = createContext<LangContextValue>({
  lang: 'es',
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('es');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}
