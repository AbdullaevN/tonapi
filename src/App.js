import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';
import { AccountBalanceWallet, Token } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './App.css';

const App = () => {
  const [walletAddresses, setWalletAddresses] = useState('');
  const [walletData, setWalletData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddressChange = (e) => {
    setWalletAddresses(e.target.value);
  };

  const handleCheckWallets = async () => {
    const addresses = walletAddresses
      .split('\n') // Split by newlines
      .map((addr) => addr.trim()) // Trim whitespace
      .filter((addr) => addr); // Remove empty strings

    setLoading(true);
    setError(null);
    setWalletData([]);

    try {
      const data = await Promise.all(
        addresses.map(async (address) => {
          try {
            const response = await axios.get(
              `https://tonapi.io/v2/accounts/${address}/jettons`
            );
            return { address, data: response.data };
          } catch (err) {
            return { address, error: `Error fetching data: ${err.message}` };
          }
        })
      );
      setWalletData(data);
    } catch (err) {
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="App"
      style={{
        background: 'linear-gradient(45deg, #FF6A00, #FF3E00)',
        minHeight: '100vh',
        padding: '50px',
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginBottom={4}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h3"
            color="white"
            style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}
          >
            Информация о кошельках TON
          </Typography>
        </motion.div>

        <TextField
          label="Введите адреса кошельков (по одному на строке)"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={walletAddresses}
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
            onClick={handleCheckWallets}
            disabled={loading || !walletAddresses}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Получить данные'}
          </Button>
        </motion.div>

        {error && (
          <Typography color="error" style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
          </Typography>
        )}
      </Box>

      {walletData.length > 0 && (
        <Grid container spacing={3} justifyContent="center">
          {walletData.map((wallet, index) => (
            <Grid item xs={12} md={8} lg={6} key={index}>
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
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" color="primary" style={{ fontWeight: 'bold',
      marginBottom: '20px',
      wordWrap: 'break-word',
      wordBreak: 'break-word', }}>
                      Данные для кошелька: {wallet.address}
                    </Typography>

                    {wallet.error ? (
                      <Typography color="error" style={{ fontWeight: 'bold' }}>
                        {wallet.error}
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="subtitle1" color="textSecondary" style={{ marginBottom: '15px' }}>
                          <AccountBalanceWallet style={{ marginRight: '8px' }} />{' '}
                          <strong>Total Balance:</strong> {wallet.data.total_balance || 'N/A'}
                        </Typography>
                        <Typography variant="h6" color="primary" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                          <Token style={{ marginRight: '8px' }} /> Токены Jettons
                        </Typography>
                        {wallet.data.balances?.length > 0 ? (
                          wallet.data.balances.map((item, idx) => (
                            <Typography key={idx} variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
                              <strong>{item.jetton.symbol}</strong>: {item.balance}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Нет токенов Jettons
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default App;
