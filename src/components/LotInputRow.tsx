import type { LotInput } from '../types/inventory';
import { TextField, IconButton, Box, Stack, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  lots: LotInput[];
  onChange: (lots: LotInput[]) => void;
}

const LotInputRow = ({ lots, onChange }: Props) => {

  const handleUpdate = (id: number, field: 'lotCount' | 'quantityPerLot', value: number) => {
    const validValue = Math.max(1, isNaN(value) ? 1 : value);
    const newLots = lots.map(lot => {
      if (lot.id === id) {
        return { ...lot, [field]: validValue };
      }
      return lot;
    });
    onChange(newLots);
  };

  const handleAddLot = () => {
    const newLot: LotInput = { id: Date.now(), lotCount: 1, quantityPerLot: 1 };
    onChange([...lots, newLot]);
  };

  const handleRemoveLot = (id: number) => {
    if (lots.length > 1) {
      onChange(lots.filter((lot) => lot.id !== id));
    }
  };

  return (
    <Stack spacing={2}>
      {lots.map((lot) => (
        <Stack key={lot.id} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1, flexWrap: 'wrap' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* 入数 */}
                <Typography variant="h5" sx={{ minWidth: '10px', mr: 1 }}>入数:</Typography>
                <TextField
                  type="number" size="small" value={lot.quantityPerLot}
                  onChange={(e) => handleUpdate(lot.id, 'quantityPerLot', parseInt(e.target.value, 10))}
                  sx={{ width: '70px' }} inputProps={{ style: { textAlign: 'center' } }}
                />
                <IconButton onClick={() => handleUpdate(lot.id, 'quantityPerLot', lot.quantityPerLot - 1)} size="small" sx={{ bgcolor: 'grey.200' }}> <RemoveCircleOutlineIcon fontSize="small"/> </IconButton>
                <IconButton onClick={() => handleUpdate(lot.id, 'quantityPerLot', lot.quantityPerLot + 1)} size="small" sx={{ bgcolor: 'grey.200' }}> <AddCircleOutlineIcon fontSize="small"/> </IconButton>
              </div>
              {/* 各行の小計 */}
              <Typography variant="body2" align="right" sx={{ color: 'text.secondary' }}>
                小計: {lot.lotCount * lot.quantityPerLot} 個
              </Typography>

            </div>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              {/* ロット数 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Typography variant="h5" sx={{ minWidth: '40px', mr: 1 }}>個数:</Typography>
                <TextField
                  type="number" size="small" value={lot.lotCount}
                  onChange={(e) => handleUpdate(lot.id, 'lotCount', parseInt(e.target.value, 10))}
                  sx={{ width: '70px' }} inputProps={{ style: { textAlign: 'center' } }}
                />
                <IconButton onClick={() => handleUpdate(lot.id, 'lotCount', lot.lotCount - 1)} size="small" sx={{ bgcolor: 'grey.200' }}> <RemoveCircleOutlineIcon fontSize="small"/> </IconButton>
                <IconButton onClick={() => handleUpdate(lot.id, 'lotCount', lot.lotCount + 1)} size="small" sx={{ bgcolor: 'grey.200' }}> <AddCircleOutlineIcon fontSize="small"/> </IconButton>
              </div>
              {/* 削除ボタン */}
              <IconButton onClick={() => handleRemoveLot(lot.id)} size="small" disabled={lots.length <= 1} sx={{ ml: 'auto' }}>
                <DeleteIcon fontSize="small"/>
              </IconButton>
            </div>
          </Box>
        </Stack>
      ))}
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddLot} sx={{mt: 1}}>
        別のロット(入数)を追加
      </Button>
    </Stack>
  );
};

export default LotInputRow;