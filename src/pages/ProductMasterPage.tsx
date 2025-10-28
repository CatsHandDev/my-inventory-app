import React, { useState, useMemo, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/inventory';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Papa from 'papaparse';
import {
  Box, Button, Container, Paper, Stack, TextField, Typography, List, ListItem, ListItemText, IconButton, Divider, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductMasterPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useLocalStorage<Product[]>('product-master', []);
  const [] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<string>(''); 
  const [newProductName, setNewProductName] = useState('');
  const [newJanCode, setNewJanCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const existingCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

   const handleAddProduct = () => {
    if (!value.trim() || !newProductName.trim() || !newJanCode.trim()) {
      alert('すべての項目を入力してください。');
      return;
    }
    const janSuffix = newJanCode.slice(-4);
    const newProduct: Product = {
      id: Date.now(),
      category: value.trim(),
      name: newProductName.trim(),
      jan_suffix: janSuffix,
    };
    setProducts([...products, newProduct]);
    
    setValue('');
    setInputValue('');
    setNewProductName('');
    setNewJanCode('');
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('この商品を削除しますか？')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jan_suffix.includes(searchTerm)
    );
  }, [products, searchTerm]);
  
  // CSVエクスポート処理
  const handleExportCSV = () => {
    const csv = Papa.unparse(products.map(({id, ...rest}) => rest));
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  // CSVインポート処理
  const handleImportCSV = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const importedProducts: Product[] = results.data.map((row: any) => ({
            id: Date.now() + Math.random(),
            category: row.category || '',
            name: row.name || '',
            jan_suffix: String(row.jan_code || '').slice(-4),
          }));
          setProducts([...products, ...importedProducts]);
          alert(`${importedProducts.length}件の商品をインポートしました。`);
        }
      });
    }
  };


  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md" sx={{ maxWidth: 768 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">商品マスタ管理</Typography>
          <Button variant="outlined" onClick={() => navigate('/')}>トップに戻る</Button>
        </Box>

        {/* 新規登録エリア */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h6">新規商品登録</Typography>
            <Autocomplete
              value={value}
              onChange={(_event: any, newValue: string | null) => {
                setValue(newValue || '');
              }}
              inputValue={inputValue}
              onInputChange={(_event, newInputValue) => {
                setInputValue(newInputValue);
                // ユーザーが自由入力したテキストも `value` にセットする
                setValue(newInputValue);
              }}
              freeSolo
              options={existingCategories}
              renderInput={(params) => <TextField {...params} label="分類" />}
            />
            <TextField label="商品名" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
            <TextField label="JANコード（下4桁は自動抽出）" value={newJanCode} onChange={(e) => setNewJanCode(e.target.value)} />
            <Button variant="contained" onClick={handleAddProduct}>追加</Button>
          </Stack>
        </Paper>

        {/* 一覧エリア */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">登録済み商品一覧</Typography>
          <TextField
            label="商品名またはJAN下4桁で検索"
            fullWidth
            margin="normal"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <List>
            {filteredProducts.map(product => (
              <React.Fragment key={product.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDeleteProduct(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={product.name} secondary={`${product.category} | ${product.jan_suffix}`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
        
        {/* CSV操作エリア */}
        <Paper sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6">CSV一括操作</Typography>
          <Stack direction="row" spacing={2} mt={2}>
             <Button variant="contained" component="label" color="success">
              CSVをインポート
              <input type="file" accept=".csv" hidden onChange={handleImportCSV} />
            </Button>
            <Button variant="contained" color="primary" onClick={handleExportCSV}>
              CSVをエクスポート
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductMasterPage;