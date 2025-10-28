import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryRecord } from '../types/inventory';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useSnackbar } from '../hooks/useSnackbar';
import {
  Container,
  Typography,
  List,
  ListItemText,
  Paper,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { exportHistoryToXLSX, exportHistoryToCSV } from '../utils/export';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useLocalStorage<HistoryRecord[]>('inventory-history', []);
  const { showSnackbar } = useSnackbar();

  // モーダルのためのState管理を追加
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // 全履歴を削除する処理
  const handleClearAllHistory = () => {
    setDialogState({
      open: true,
      title: '全履歴の削除',
      message: '本当にすべての履歴を削除しますか？\nこの操作は元に戻せません。',
      onConfirm: () => {
        setHistory([]);
        showSnackbar('すべての履歴を削除しました。', 'warning');
        handleCloseDialog();
      },
    });
  };

  // 個別の履歴を削除する処理
  const handleDeleteHistory = (recordId: string) => {
    setDialogState({
      open: true,
      title: '履歴の削除',
      message: 'この履歴を削除しますか？',
      onConfirm: () => {
        setHistory(prevHistory => prevHistory.filter(record => record.id !== recordId));
        showSnackbar('履歴を1件削除しました。', 'info');
        handleCloseDialog();
      },
    });
  };

  // モーダルを閉じる共通の関数
  const handleCloseDialog = () => {
    setDialogState({ ...dialogState, open: false });
  };


  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md" sx={{ maxWidth: 768 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            履歴一覧
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')}>トップに戻る</Button>
        </Box>

        {history.length > 0 && (
          //「全履歴を削除」ボタンを追加
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearAllHistory}
            >
              全履歴を削除
            </Button>
          </Box>
        )}

        {history.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'grey.500', mt: 8 }}>
            履歴はありません。
          </Typography>
        ) : (
          <List sx={{ p:0 }}>
            {history.map((record) => (
              <Paper key={record.id} sx={{ mb: 2 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <ListItemText
                      primary={`保存日時: ${new Date(record.date).toLocaleString()}`}
                      secondary={`担当者: ${record.staffName || '記録なし'} | 合計数量: ${record.totalQuantity} 個`}
                    />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <List dense>
                      {record.items.map((item) => (
                        <li key={item.productId}>
                          <ListItemText
                            primary={`${item.productName} (${item.janSuffix})`}
                            sx={{ pl: 2, pt: 1 }}
                          />
                          <Box sx={{ pl: 4, width: '100%' }}>
                            {item.lots.map(lot => (
                              <Typography key={lot.id} variant="body2" color="textSecondary">
                                ロット数: {lot.lotCount}, 入数: {lot.quantityPerLot} = {lot.lotCount * lot.quantityPerLot} 個
                              </Typography>
                            ))}
                          </Box>
                        </li>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" size="small" onClick={() => exportHistoryToXLSX(record)}>
                          Excel
                        </Button>
                        <Button variant="contained" color="primary" size="small" onClick={() => exportHistoryToCSV(record)}>
                          CSV
                        </Button>
                      </Stack>
                      {/* 個別削除ボタンを追加 */}
                      <IconButton color="error" onClick={() => handleDeleteHistory(record.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </List>
        )}
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

export default HistoryPage;