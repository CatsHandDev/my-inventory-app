import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import HistoryPage from './pages/HistoryPage';
import SummaryPage from './pages/SummaryPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';

const theme = createTheme(); // Material-UIのデフォルトテーマ

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* ブラウザのデフォルトスタイルをリセット */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<InventoryPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;