import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, InventoryItem, LotInput } from '../types/inventory';
import InventoryHeader from '../components/InventoryHeader';
import InventoryFooter from '../components/InventoryFooter';
// 1. 新しいモーダルコンポーネントと、必要なUI部品をインポート
import ProductSelectionModal from '../components/ProductSelectionModal';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box, Container, Divider, List, Paper, type SelectChangeEvent, IconButton, Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useLocalStorage } from '../hooks/useLocalStorage';
import LotInputRow from '../components/LotInputRow';

// (サンプルデータ定義は変更ありません)

const InventoryPage = () => {
  const navigate = useNavigate();
  const [allProducts] = useLocalStorage<Product[]>('product-master', []);
  const categories = useMemo(() => [...new Set(allProducts.map(p => p.category))], [allProducts]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [staffName] = useState(() => localStorage.getItem('inventory-staff-name') || '');

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    // データ移行処理 (古い形式のデータを安全に読み込む)
    const savedData = localStorage.getItem('inventory-in-progress');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          return parsedData.map((item): InventoryItem => ({
            productId: item.productId || 0,
            productName: item.productName || '',
            janSuffix: item.janSuffix || '',
            lots: Array.isArray(item.lots) ? item.lots : [{ id: Date.now(), lotCount: 1, quantityPerLot: 1 }],
            subtotal: item.subtotal || 1,
          }));
        }
      } catch (e) { console.error("Failed to parse inventory data", e); }
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const itemRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    localStorage.setItem('inventory-in-progress', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  const filteredProducts = useMemo(() => allProducts.filter((p) => p.category === selectedCategory), [selectedCategory, allProducts]);

  // 3. 分類選択時にモーダルを開くように処理を変更
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setSelectedCategory(e.target.value as string);
    setIsModalOpen(true); // モーダルを開く
  };

  // 4. モーダルから商品が選択されたときの処理を新しく定義
  const handleProductSelect = (product: Product) => {
    const itemExists = inventoryItems.some((item) => item.productId === product.id);
    if (!itemExists) {
      const newItem: InventoryItem = {
        productId: product.id,
        productName: product.name,
        janSuffix: product.jan_suffix,
        lots: [{ id: Date.now(), lotCount: 1, quantityPerLot: 1 }],
        subtotal: 1,
      };
      setInventoryItems([...inventoryItems, newItem]);
    } else {
      // 既存商品の場合はスクロール
      const node = itemRefs.current.get(product.id);
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.style.transition = 'background-color 0.1s';
        node.style.backgroundColor = '#e3f2fd';
        setTimeout(() => { node.style.backgroundColor = ''; }, 1000);
      }
    }
    // 分類の選択状態をリセットして、再度同じ分類を選べるようにする
    setSelectedCategory('');
  };

  // 5. 商品を削除する処理を新しく定義
  const handleDeleteItem = (productIdToDelete: number) => {
    if (window.confirm('この商品をリストから削除してもよろしいですか？')) {
      setInventoryItems(prevItems => prevItems.filter(item => item.productId !== productIdToDelete));
    }
  };

  const updateInventoryItem = (productId: number, updatedLots: LotInput[]) => {
    const newSubtotal = updatedLots.reduce((sum, lot) => sum + (lot.lotCount * lot.quantityPerLot), 0);
    setInventoryItems(
      inventoryItems.map((item) =>
        item.productId === productId
          ? { ...item, lots: updatedLots, subtotal: newSubtotal }
          : item
      )
    );
  };

  const totalQuantity = useMemo(() => {
    return inventoryItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [inventoryItems]);

  const handleComplete = () => {
    const validItems = inventoryItems.filter(item => item.subtotal > 0);
    navigate('/summary', { state: { items: validItems, total: totalQuantity, staffName } });
  };

  const handleNew = () => {
    if (window.confirm('現在の入力内容は破棄されます。新しい入力を開始しますか？')) {
      // ローカルストレージをクリア
      localStorage.removeItem('inventory-in-progress');
      localStorage.removeItem('inventory-staff-name');
      // このページの全Stateをリセット
      setInventoryItems([]);
      setSelectedCategory('');
    }
  };

  const handleGoHome = () => {
    if (window.confirm('作業を中断してホームに戻りますか？\n（現在の内容は保存され、後で再開できます）')) {
      navigate('/');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <InventoryHeader
        staffName={staffName}
        onGoHome={handleGoHome}
        onNew={handleNew}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />

      {/* モーダルコンポーネント */}
      <ProductSelectionModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(''); // キャンセル時も分類選択をリセット
        }}
        products={filteredProducts}
        onProductSelect={handleProductSelect}
      />

      {/* --- スクロールエリア --- */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', width: '100%', bgcolor: 'grey.50' }}>
        <Container maxWidth="md" sx={{ maxWidth: 768, py: 2 }}>
          {inventoryItems.length > 0 ? (
            <List sx={{ p: 0 }}>
              {inventoryItems.map((item) => (
                <Paper key={item.productId} ref={(node) => { const map = itemRefs.current; if (node) { map.set(item.productId, node); } else { map.delete(item.productId); } }} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant='h6' component='div' sx={{ fontWeight: 'bold' }}>
                      {`${item.productName} (${item.janSuffix})`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="div" sx={{ fontWeight: 'bold' }}>
                        {item.subtotal} 個
                      </Typography>
                      <IconButton onClick={() => handleDeleteItem(item.productId)} size="small" edge="end">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }}/>
                  <Box sx={{ pl: { xs: 0, sm: 2 } }}>
                    <LotInputRow
                      lots={item.lots}
                      onChange={(updatedLots) => updateInventoryItem(item.productId, updatedLots)}
                    />
                  </Box>
                </Paper>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', color: 'grey.500', mt: 8 }}>
              <AddShoppingCartIcon sx={{ fontSize: 60 }} />
              <Typography variant="h6">商品を追加してください</Typography>
            </Box>
          )}
        </Container>
      </Box>

      <InventoryFooter
        totalQuantity={totalQuantity}
        onComplete={handleComplete}
        disabled={totalQuantity === 0 || !staffName}
      />
    </Box>
  );
};

export default InventoryPage;