import { useNavigate } from 'react-router-dom';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('');
  const [error, setError] = useState(false);

  // ページ読み込み時に、前回使用した担当者名を読み込む
  useEffect(() => {
    const savedName = localStorage.getItem('inventory-staff-name');
    if (savedName) {
      setStaffName(savedName);
    }
  }, []);


  const handleNewEntry = () => {
    // 担当者名が空の場合はエラーを表示して処理を中断
    if (!staffName.trim()) {
      setError(true);
      alert('担当者名を入力してください。');
      return;
    }
    setError(false);

    // 担当者名をローカルストレージに保存
    localStorage.setItem('inventory-staff-name', staffName.trim());
    // 古い作業中データがあればクリアする
    localStorage.removeItem('inventory-in-progress');
    
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
        <Button
          variant="contained"
          size="large"
          onClick={handleNewEntry} // 変更
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
      </Stack>
    </Container>
  );
};

export default HomePage;