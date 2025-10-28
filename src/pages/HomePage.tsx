import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';

const HomePage = () => {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('');
  const [error, setError] = useState(false);
  const [hasResumeData, setHasResumeData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('inventory-staff-name');
    if (savedName) {
      setStaffName(savedName);
    }

    const inProgressData = localStorage.getItem('inventory-in-progress');
    if (inProgressData) {
      try {
        const parsedData = JSON.parse(inProgressData);
        // データが配列であり、中身が1つ以上あれば「再開可能」と判断
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setHasResumeData(true);
        }
      } catch (e) {
        console.error('中断データの読み込みに失敗しました', e);
      }
    }
  }, []);


  const handleNewEntry = () => {
    if (!staffName.trim()) {
      setError(true);
      alert('担当者名を入力してください。');
      return;
    }
    setError(false);

    if (hasResumeData) {
      // 確認モーダルを開く
      setOpenDialog(true);
    } else {
      // 中断データがなければ、そのまま新規作成
      createNewSession();
    }
  };

  // OKが押されたときの処理を定義
  const createNewSession = () => {
    localStorage.setItem('inventory-staff-name', staffName.trim());
    localStorage.removeItem('inventory-in-progress');
    navigate('/new');
  };

  const handleResume = () => {
    if (!staffName.trim()) {
      setError(true);
      alert('担当者名を入力してください。');
      return;
    }
    // 担当者名を更新して再開
    localStorage.setItem('inventory-staff-name', staffName.trim());
    navigate('/new');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        在庫管理アプリ
      </Typography>
      <Stack spacing={4} mt={4}>
        <TextField
          required
          label="担当者名"
          variant="outlined"
          fullWidth
          value={staffName}
          onChange={(e) => {
            setStaffName(e.target.value);
            if (error) setError(false);
          }}
          error={error}
          helperText={error ? '担当者名は必須です' : ''}
        />
        {hasResumeData && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              中断中のデータが保存されています
            </Alert>
            <Button
              variant="contained"
              color="secondary" // 目立つように色を変える
              size="large"
              fullWidth
              onClick={handleResume}
            >
              続きから再開する
            </Button>
          </Box>
        )}
        <Button
          variant={hasResumeData ? "outlined" : "contained"}
          size="large"
          fullWidth
          onClick={handleNewEntry}
        >
          新規入力
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/history')}
        >
          履歴を見る
        </Button>
        <Button
          variant="outlined"
          color="info"
          size="large"
          onClick={() => navigate('/products')}
        >
          商品マスタ管理
        </Button>
      </Stack>
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          setOpenDialog(false);
          createNewSession();
        }}
        title="確認"
        message={"中断中のデータがあります。\n削除して新規作成しますか？"}
      />
    </Container>
  );
};

export default HomePage;