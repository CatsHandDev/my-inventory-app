import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  DialogActions,
  Button,
} from '@mui/material';
import type { Product } from '../types/inventory';

// このコンポーネントが受け取るPropsの型を定義
interface Props {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductSelectionModal: React.FC<Props> = ({ open, onClose, products, onProductSelect }) => {
  const handleSelect = (product: Product) => {
    onProductSelect(product);
    onClose(); // 商品を選択したら自動でモーダルを閉じる
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>商品を選択してください</DialogTitle>
      <DialogContent dividers>
        <List>
          {products.length > 0 ? (
            products.map(product => (
              <ListItem key={product.id} disablePadding>
                <ListItemButton onClick={() => handleSelect(product)}>
                  <ListItemText 
                    primary={product.name} 
                    secondary={`JAN下4桁: ${product.jan_suffix}`} 
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="この分類には商品がありません。" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSelectionModal;