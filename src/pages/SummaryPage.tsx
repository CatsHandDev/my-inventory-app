import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { InventoryItem, HistoryRecord } from '../types/inventory';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { exportToXLSX, exportToCSV } from '../utils/export';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total, staffName } = (location.state || { items: [], total: 0, staffName: '' }) as {
    items: InventoryItem[];
    total: number;
    staffName: string;
  };
  const [history, setHistory] = useLocalStorage<HistoryRecord[]>('inventory-history', []);

  const handleSave = () => {
    // (この関数の中身は変更ありません)
    const newRecord: HistoryRecord = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      items: items.map(item => {
        const { productId, productName, janSuffix, lots } = item;
        return { productId, productName, janSuffix, lots };
      }),
      totalQuantity: total,
      staffName: staffName,
    };
    setHistory([newRecord, ...history]);
    localStorage.removeItem('inventory-in-progress');
    localStorage.removeItem('inventory-staff-name');
    alert('保存しました。');
    navigate('/');
  };

  const handleNew = () => {
    if (window.confirm('現在の入力内容は破棄されます。新しい入力を開始しますか？')) {
      // ローカルストレージをクリア
      localStorage.removeItem('inventory-in-progress');
      localStorage.removeItem('inventory-staff-name');
      // 在庫入力ページに移動
      navigate('/new');
    }
  };

  const handleGoHome = () => {
    if (window.confirm('ホームに戻りますか？\n（入力ページに戻れば作業を再開できます）')) {
      navigate('/');
    }
  };

  return (
    // ★★★ 1. 全幅レイアウトのための構造に変更 ★★★
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4, display: 'flex', alignItems: 'start', flexGrow: 1 }}>
      <Container maxWidth="md" sx={{ maxWidth: 768 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
          <div style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ margin: 0 }}>
              入力内容の確認
            </Typography>
          </div>
          <Button variant="outlined" color="secondary" size="medium" onClick={handleNew}>
              新規作成
          </Button>
        </div>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>担当者:</strong> {staffName || '未入力'}
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {items.map((item) => (
              <React.Fragment key={item.productId}>
                <ListItem>
                  <ListItemText primary={`${item.productName} (${item.janSuffix})`} secondary={`合計: ${item.subtotal} 個`}/>
                </ListItem>
                <Box sx={{ pl: 4, pb: 1 }}>
                  {item.lots.map((lot) => (
                    <Typography key={lot.id} variant="body2" color="text.secondary">
                      ロット: {lot.lot || '1'}, 個数: {lot.quantity}
                    </Typography>
                  ))}
                </Box>
                <Divider sx={{ mt: 1 }} />
              </React.Fragment>
            ))}
          </List>
          <Typography variant="h6" align="right" sx={{ mt: 2 }}>
            総合計: {total} 個
          </Typography>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" size="large" fullWidth onClick={handleSave}>
            この内容で保存する
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', gap: 20 }}>
            <Button variant="outlined" color="primary" size="large" fullWidth onClick={handleGoHome} sx={{ mt: 2 }}>
              ホームに戻る
            </Button>
            <Button variant="outlined" size="large" fullWidth onClick={() => navigate(-1)} sx={{ mt: 2 }}>
              入力に戻る
            </Button>
          </div>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">エクスポート</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" color="success" onClick={() => exportToXLSX(items, staffName)}>
              Excel (.xlsx)
            </Button>
            <Button variant="contained" color="primary" onClick={() => exportToCSV(items, staffName)}>
              CSV
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default SummaryPage;