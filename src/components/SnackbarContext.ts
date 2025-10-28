import { createContext } from 'react';

// Contextが提供する関数の型定義
export interface SnackbarContextType {
  showSnackbar: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

// Contextオブジェクトの作成とエクスポート
export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);