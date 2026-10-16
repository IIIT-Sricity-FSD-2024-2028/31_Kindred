import { createContext, useContext } from 'react';

export const PageContext = createContext(null);
export function usePage() {
  const page = useContext(PageContext);
  if (!page) throw new Error('Page controls require PageContext.');
  return page;
}
