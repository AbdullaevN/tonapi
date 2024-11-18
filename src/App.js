import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, CircularProgress, Grid, Box } from '@mui/material';
import { AccountBalanceWallet, Token, AccountBox } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './App.css';

const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleCheckWallet = async () => {
    setLoading(true);
    setError(null);
    setWalletData(null);

    try {
      const url = `https://tonapi.io/v2/accounts/${walletAddress}/jettons`;

      const response = await axios.get(url);
      if (response.status === 200) {
        setWalletData(response.data);
      } else {
        setError(`Ошибка ${response.status}: не удалось получить данные.`);
      }
    } catch (err) {
      setError(`Произошла ошибка при запросе данных: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ background: 'linear-gradient(45deg, #FF6A00, #FF3E00)', minHeight: '100vh', padding: '50px' }}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginBottom={4}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h3" color="white" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            Информация о кошельке TON
          </Typography>
        </motion.div>

        <TextField
          label="Введите адрес кошелька"
          variant="outlined"
          fullWidth
          value={walletAddress}
          onChange={handleAddressChange}
          style={{
            maxWidth: '600px',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginBottom: '20px',
            padding: '15px',
          }}
        />

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckWallet}
            disabled={loading || !walletAddress}
            style={{
              width: '250px',
              borderRadius: '30px',
              background: '#FF6A00',
              fontWeight: 'bold',
              padding: '12px',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Получить данные кошелька'}
          </Button>
        </motion.div>

        {error && (
          <Typography color="error" style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
          </Typography>
        )}
      </Box>

      {walletData && walletData.balances && (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Card
                variant="outlined"
                style={{
                  borderRadius: '20px',
                  backgroundColor: '#fff',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  padding: '30px',
                  transition: 'transform 0.3s ease',
                }}
              >
                <CardContent>
                  <Typography variant="h5" color="primary" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    Данные для кошелька: {walletAddress}
                  </Typography>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Typography variant="subtitle1" color="textSecondary" style={{ marginBottom: '15px' }}>
                      <AccountBalanceWallet style={{ marginRight: '8px' }} /> <strong>Total Balance (TON + Jettons):</strong> {walletData.total_balance} USD
                    </Typography>

                    <Typography variant="subtitle1" color="textSecondary" style={{ marginBottom: '15px' }}>
                      <AccountBalanceWallet style={{ marginRight: '8px' }} /> <strong>Balance (TON):</strong> {walletData.balance_ton} TON
                    </Typography>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                    <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }} color="primary">
                      <Token style={{ marginRight: '8px' }} /> Токены Jettons
                    </Typography>
                    {walletData.balances && walletData.balances.length > 0 ? (
                      <Box>
                        {walletData.balances.map((item, index) => (
                          <Typography key={index} variant="body2" color="textSecondary" style={{ marginLeft: '20px', marginBottom: '10px' }}>
                            <strong>{item.jetton.symbol}</strong>: {item.balance} {item.jetton.symbol}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
                        Нет токенов Jettons
                      </Typography>
                    )}
                  </motion.div>

                  {walletData.other_tokens && walletData.other_tokens.length > 0 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Typography variant="h6" color="primary" style={{ fontWeight: 'bold', marginTop: '20px' }}>
                        Другие токены
                      </Typography>
                      <Box>
                        {walletData.other_tokens.map((token, index) => (
                          <Typography key={index} variant="body2" color="textSecondary" style={{ marginLeft: '20px' }}>
                            <strong>{token.name}</strong>: {token.balance} ({token.symbol})
                          </Typography>
                        ))}
                      </Box>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default App;
