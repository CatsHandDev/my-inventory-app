import React from 'react';
import {
  Box, Button, Container, Menu, MenuItem, Paper, Stack, Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// このコンポーネントが受け取るPropsの型を定義
interface InventoryHeaderProps {
  staffName: string;
  onGoHome: () => void;
  onNew: () => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categories: string[];
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  staffName,
  onGoHome,
  onNew,
  onCategorySelect,
  categories,
}) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (category: string) => {
    onCategorySelect(category);
    handleClose();
  };

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
          <Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
              aria-controls={open ? 'category-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              分類を選択して商品を追加
            </Button>
            <Menu
              id="category-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              // メニューがボタンと同じ幅になるように調整
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                style: {
                  width: anchorEl ? anchorEl.clientWidth : undefined,
                },
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} onClick={() => handleMenuItemClick(cat)}>
                  {cat}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Stack>
      </Container>
    </Paper>
  );
};

export default InventoryHeader;