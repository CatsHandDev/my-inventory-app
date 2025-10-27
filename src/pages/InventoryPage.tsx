import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, InventoryItem, LotInput } from '../types/inventory';
import LotInputRow from '../components/LotInputRow';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; // アイコンをインポート

// --- (サンプルデータ定義は変更ありません) ---
const allProducts: Product[] = [
  { id: 1, name: '商品A', jan_suffix: '1234', category: '食品' },
  { id: 2, name: '商品B', jan_suffix: '5678', category: '食品' },
  { id: 3, name: '商品C', jan_suffix: '9012', category: '飲料' },
  { id: 4, name: '商品D', jan_suffix: '3456', category: '雑貨' },
];
const categories = [...new Set(allProducts.map((p) => p.category))];

const InventoryPage = () => {
  const navigate = useNavigate();
  // (Stateの定義は変更なし)
  const [staffName, setStaffName] = useState(() => localStorage.getItem('inventory-staff-name') || '');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const savedData = localStorage.getItem('inventory-in-progress');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // (useEffect, useMemo, 各種ハンドラ関数は変更ありません)
  React.useEffect(() => {
    localStorage.setItem('inventory-in-progress', JSON.stringify(inventoryItems));
    localStorage.setItem('inventory-staff-name', staffName);
  }, [inventoryItems, staffName]);

  const filteredProducts = useMemo(
    () => allProducts.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setSelectedCategory(e.target.value);
    setSelectedProductId('');
  };

  const handleProductChange = (e: SelectChangeEvent<string>) => {
    const productId = Number(e.target.value);
    setSelectedProductId(e.target.value);
    if (productId && !inventoryItems.some((item) => item.productId === productId)) {
      const product = allProducts.find((p) => p.id === productId);
      if (product) {
        const newItem: InventoryItem = {
          productId: product.id,
          productName: product.name,
          janSuffix: product.jan_suffix,
          lots: [{ id: Date.now(), lot: '1', quantity: 1 }],
          subtotal: 1,
        };
        setInventoryItems([...inventoryItems, newItem]);
      }
    }
  };

  const updateInventoryItem = (productId: number, updatedLots: LotInput[]) => {
    const newSubtotal = updatedLots.reduce((sum, lot) => sum + (lot.quantity || 0), 0);
    setInventoryItems(
      inventoryItems.map((item) =>
        item.productId === productId
          ? { ...item, lots: updatedLots, subtotal: newSubtotal }
          : item
      )
    );
  };

  const totalQuantity = useMemo(
    () => inventoryItems.reduce((sum, item) => sum + item.subtotal, 0),
    [inventoryItems]
  );

  const handleComplete = () => {
    const validItems = inventoryItems.filter(item => item.subtotal > 0);
    navigate('/summary', { state: { items: validItems, total: totalQuantity, staffName } });
  };

  return (
    // ★★★ 1. 全幅レイアウトのための構造に変更 ★★★
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* --- ヘッダーエリア (背景は全幅、内容は中央寄せ) --- */}
      <Paper elevation={3} sx={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <Container maxWidth="md" sx={{ maxWidth: 768, py: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h2">在庫入力</Typography>
            <FormControl fullWidth>
              <InputLabel>分類</InputLabel>
              <Select value={selectedCategory} label="分類" onChange={handleCategoryChange}>
                {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!selectedCategory}>
              <InputLabel>商品 (JAN下4桁)</InputLabel>
              <Select value={selectedProductId} label="商品 (JAN下4桁)" onChange={handleProductChange}>
                {filteredProducts.map((p) => (<MenuItem key={p.id} value={p.id}>{`${p.name} (${p.jan_suffix})`}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField label="担当者名" fullWidth value={staffName} onChange={(e) => setStaffName(e.target.value)}/>
          </Stack>
        </Container>
      </Paper>

      {/* --- スクロールする入力エリア --- */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', width: '100%', bgcolor: 'grey.50' }}>
        <Container maxWidth="md" sx={{ maxWidth: 768, py: 2 }}>
          {inventoryItems.length > 0 ? (
            <List sx={{ p: 0 }}>
              {inventoryItems.map((item) => (
                <Paper key={item.productId} sx={{ mb: 2, p: 2 }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary={`${item.productName} (${item.janSuffix})`} secondary={`小計: ${item.subtotal} 個`}/>
                  </ListItem>
                  <Divider sx={{ my: 1 }}/>
                  <Box sx={{ pl: { xs: 0, sm: 2 } }}>
                    <LotInputRow lots={item.lots} onChange={(updatedLots) => updateInventoryItem(item.productId, updatedLots)}/>
                  </Box>
                </Paper>
              ))}
            </List>
          ) : (
            // ★★★ 2. 何も入力されていない時の表示 ★★★
            <Box sx={{ textAlign: 'center', color: 'grey.500', mt: 8 }}>
              <AddShoppingCartIcon sx={{ fontSize: 60 }} />
              <Typography variant="h6">商品を選択してください</Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* --- フッターエリア (背景は全幅、内容は中央寄せ) --- */}
      <Paper elevation={4} sx={{ position: 'sticky', bottom: 0, zIndex: 1, width: '100%' }}>
        <Container maxWidth="md" sx={{ maxWidth: 768, py: 2 }}>
          <Typography variant="h6" align="right">
            合計: {totalQuantity} 個
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 1 }}
            onClick={handleComplete}
            disabled={totalQuantity === 0 || staffName.trim() === ''}
          >
            入力内容を確認する
          </Button>
        </Container>
      </Paper>
    </Box>
  );
};

export default InventoryPage;