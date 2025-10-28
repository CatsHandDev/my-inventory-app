import React, { useState } from 'react';
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
  Divider,
  Stack,
} from '@mui/material';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useSnackbar } from '../hooks/useSnackbar';

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total, staffName } = (location.state || { items: [], total: 0, staffName: '' }) as {
    items: InventoryItem[];
    total: number;
    staffName: string;
  };
  const [history, setHistory] = useLocalStorage<HistoryRecord[]>('inventory-history', []);
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const { showSnackbar } = useSnackbar();

  const handleSave = () => {
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
    showSnackbar('保存しました。');
    navigate('/');
  };

  const handleNew = () => {
    setDialogState({
      open: true,
      title: '新規作成の確認',
      message: '現在の入力内容は破棄されます。\n新しい入力を開始しますか？',
      onConfirm: () => {
        localStorage.removeItem('inventory-in-progress');
        navigate('/new');
        handleCloseDialog();
      }
    });
  };

  const handleGoHome = () => {
    setDialogState({
      open: true,
      title: 'ホームに戻る',
      message: 'ホームに戻りますか？\n（入力ページに戻れば作業を再開できます）',
      onConfirm: () => {
        navigate('/');
        handleCloseDialog();
      }
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ ...dialogState, open: false });
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md" sx={{ maxWidth: 768 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          入力内容の確認
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}><strong>担当者:</strong> {staffName || '未入力'}</Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {items.map((item) => (
              <React.Fragment key={item.productId}>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* 左側の要素 */}
                  <Typography variant="body1">
                    {`${item.productName} (${item.janSuffix})`}
                  </Typography>
                  {/* 右側の要素 */}
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {item.subtotal} 個
                  </Typography>
                </ListItem>
                <Box sx={{ pl: 4, pb: 1 }}>
                  {item.lots.map((lot) => (
                    <Typography key={lot.id} variant="body2" color="text.secondary">
                      入数: {lot.quantityPerLot} × ロット数: {lot.lotCount} 個 = {lot.lotCount * lot.quantityPerLot}
                    </Typography>
                  ))}
                </Box>
                <Divider sx={{ mt: 1 }} />
              </React.Fragment>
            ))}
          </List>
          <Typography variant="h6" align="right" sx={{ mt: 2 }}>総合計: {total} 個</Typography>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" size="large" fullWidth onClick={handleSave}>
            この内容で保存する
          </Button>
          <Button variant="outlined" size="large" fullWidth onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            入力に戻る
          </Button>
          <Button variant="outlined" color="secondary" size="large" fullWidth onClick={handleNew} sx={{ mt: 2 }}>
            新規作成
          </Button>
           <Button variant="outlined" color="primary" size="large" fullWidth onClick={handleGoHome} sx={{ mt: 2 }}>
            ホームに戻る
          </Button>
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

      <ConfirmationDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        message={dialogState.message}
      />
    </Box>
  );
};

export default SummaryPage;