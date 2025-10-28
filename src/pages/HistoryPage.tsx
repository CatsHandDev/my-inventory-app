import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryRecord } from '../types/inventory';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { exportHistoryToXLSX, exportHistoryToCSV } from '../utils/export';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history] = useLocalStorage<HistoryRecord[]>('inventory-history', []);
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Container maxWidth="md" sx={{ maxWidth: 768, paddingTop: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            履歴一覧
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')}>トップに戻る</Button>
        </Box>
        {history.length === 0 ? (
          <Typography>履歴はありません。</Typography>
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
                        <ListItem key={item.productId} sx={{flexDirection: 'column', alignItems: 'flex-start'}}>
                          <ListItemText primary={`${item.productName} (${item.janSuffix})`}/>
                          <Box sx={{ pl: 2, width: '100%' }}>
                            {item.lots.map(lot => (
                              <Typography key={lot.id} variant="body2" color="textSecondary">
                                ロット数: {lot.lotCount}, 入数: {lot.quantityPerLot} = {lot.lotCount * lot.quantityPerLot} 個
                              </Typography>
                            ))}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>この履歴をエクスポート</Typography>
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" size="small" onClick={() => exportHistoryToXLSX(record)}>
                          Excel (.xlsx)
                        </Button>
                        <Button variant="contained" color="primary" size="small" onClick={() => exportHistoryToCSV(record)}>
                          CSV
                        </Button>
                      </Stack>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
};
export default HistoryPage;