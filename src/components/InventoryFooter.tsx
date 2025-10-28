import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

// このコンポーネントが受け取るPropsの型を定義
interface InventoryFooterProps {
  totalQuantity: number;
  onComplete: () => void;
  disabled: boolean;
}

const InventoryFooter: React.FC<InventoryFooterProps> = ({
  totalQuantity,
  onComplete,
  disabled,
}) => {
  return (
    <Paper elevation={4} sx={{ position: 'sticky', bottom: 0, zIndex: 1, width: '100%' }}>
      <Container maxWidth="md" sx={{ maxWidth: 768, py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">合計: {totalQuantity} 個</Typography>
          <Button variant="contained" size="large" onClick={onComplete} disabled={disabled}>
            入力内容を確認する
          </Button>
        </Box>
      </Container>
    </Paper>
  );
};

export default InventoryFooter;