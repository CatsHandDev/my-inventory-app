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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history] = useLocalStorage<HistoryRecord[]>('inventory-history', []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          履歴一覧
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>トップに戻る</Button>
      </Box>

      {history.length === 0 ? (
        <Typography>履歴はありません。</Typography>
      ) : (
        <List>
          {history.map((record) => (
            <Paper key={record.id} sx={{ mb: 2 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ListItemText
                    primary={`保存日時: ${new Date(record.date).toLocaleString()}`}
                    secondary={`合計数量: ${record.totalQuantity} 個`}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {record.items.map((item) => (
                      <ListItem key={item.productId} sx={{flexDirection: 'column', alignItems: 'flex-start'}}>
                        <ListItemText
                          primary={`${item.productName} (${item.janSuffix})`}
                        />
                        <Box sx={{ pl: 2, width: '100%' }}>
                          {item.lots.map(lot => (
                            <Typography key={lot.id} variant="body2" color="textSecondary">
                              ロット: {lot.lot || '(空欄)'}, 個数: {lot.quantity}
                            </Typography>
                          ))}
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default HistoryPage;