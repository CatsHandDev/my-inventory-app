import React from 'react';
import {
  Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, type SelectChangeEvent, Stack, Typography,
} from '@mui/material';

// このコンポーネントが受け取るPropsの型を定義
interface InventoryHeaderProps {
  staffName: string;
  onGoHome: () => void;
  onNew: () => void;
  selectedCategory: string;
  onCategoryChange: (e: SelectChangeEvent<string>) => void;
  categories: string[];
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  staffName,
  onGoHome,
  onNew,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <Paper elevation={3} sx={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
      <Container maxWidth="md" sx={{ maxWidth: 768, py: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">担当者: <strong>{staffName || '未設定'}</strong></Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" color="primary" onClick={onGoHome}>
                ホームに戻る
              </Button>
              <Button size="small" variant="outlined" color="secondary" onClick={onNew}>
                新規作成
              </Button>
            </Stack>
          </Box>
          <FormControl fullWidth>
            <InputLabel>分類を選択して商品を追加</InputLabel>
            <Select value={selectedCategory} label="分類を選択して商品を追加" onChange={onCategoryChange}>
              {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
            </Select>
          </FormControl>
        </Stack>
      </Container>
    </Paper>
  );
};

export default InventoryHeader;