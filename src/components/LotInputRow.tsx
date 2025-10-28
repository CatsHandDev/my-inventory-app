import type { LotInput } from '../types/inventory';
import { TextField, Button, IconButton, Box, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  lots: LotInput[];
  onChange: (lots: LotInput[]) => void;
}

const LotInputRow = ({ lots, onChange }: Props) => {
  const handleLotChange = (id: number, value: string) => {
    const newLots = lots.map((lot) =>
      lot.id === id ? { ...lot, lot: value } : lot
    );
    onChange(newLots);
  };

  // 2. ロット入力欄からフォーカスが外れた時の処理を追加
  const handleLotBlur = (id: number, value: string) => {
    // もし入力欄が空だったら、値を '1' に設定する
    if (value.trim() === '') {
      handleLotChange(id, '1');
    }
  };

  const handleQuantityChange = (id: number, value: string) => {
    const quantity = parseInt(value, 10);
    const newLots = lots.map((lot) =>
      lot.id === id ? { ...lot, quantity: isNaN(quantity) || quantity < 0 ? 0 : quantity } : lot
    );
    onChange(newLots);
  };

  const handleQuantityStep = (id: number, step: number) => {
    const newLots = lots.map((lot) =>
      lot.id === id
        ? { ...lot, quantity: Math.max(0, lot.quantity + step) }
        : lot
    );
    onChange(newLots);
  };

  const handleAddLot = () => {
    // 2. 追加されるロットの初期値を '1' に設定
    const newLot: LotInput = { id: Date.now(), lot: '1', quantity: 1 };
    onChange([...lots, newLot]);
  };

  const handleRemoveLot = (id: number) => {
    if (lots.length > 1) {
      onChange(lots.filter((lot) => lot.id !== id));
    }
  };

  return (
    <Stack style={{ marginTop: 20 }} spacing={2}>
      {lots.map((lot) => (
        <Box key={lot.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="ロット"
            type="number"
            variant="outlined"
            size="small"
            value={lot.lot}
            onChange={(e) => handleLotChange(lot.id, e.target.value)}
            onBlur={(e) => handleLotBlur(lot.id, e.target.value)} // onBlurイベントハンドラを追加
            // 3. ロット入力欄の幅を固定
            sx={{ width: '90px' }}
          />
          <TextField
            label="個数"
            type="number"
            variant="outlined"
            size="small"
            value={lot.quantity}
            onChange={(e) => handleQuantityChange(lot.id, e.target.value)}
            // 3. 個数入力欄の幅を固定
            sx={{ width: '120px' }}
          />
          <IconButton 
            onClick={() => handleQuantityStep(lot.id, -1)} 
            size="small"
            sx={{
              bgcolor: 'grey.200', // 薄いグレーの背景
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'grey.300' // ホバー時にもう少し濃いグレーに
              }
            }}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton 
            onClick={() => handleQuantityStep(lot.id, 1)} 
            size="small"
            sx={{
              bgcolor: 'grey.200', // 薄いグレーの背景
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'grey.300' // ホバー時にもう少し濃いグレーに
              }
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={() => handleRemoveLot(lot.id)} size="small" disabled={lots.length <= 1}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button style={{ paddingBottom: 0 }} startIcon={<AddCircleOutlineIcon />} onClick={handleAddLot}>
        ロットを追加
      </Button>
    </Stack>
  );
};

export default LotInputRow;