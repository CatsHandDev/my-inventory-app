import { useContext } from 'react';
import { SnackbarContext } from '../components/SnackbarContext';

export const useSnackbar = () => {
  // Contextを呼び出すロジックは変わらない
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};