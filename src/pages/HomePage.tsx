import { useNavigate } from 'react-router-dom';
import { Button, Container, Stack, Typography } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNewEntry = () => {
    // ★★★ 新規入力時に、作業中のデータをクリアする ★★★
    localStorage.removeItem('inventory-in-progress');
    navigate('/new');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        在庫管理アプリ
      </Typography>
      <Stack spacing={4} mt={4}>
        <Button
          variant="contained"
          size="large"
          onClick={handleNewEntry} // ★★★ 変更
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