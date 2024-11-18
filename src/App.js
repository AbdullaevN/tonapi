import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [walletData, setWalletData] = useState(null); // Данные кошелька
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  // Запрос данных для конкретного кошелька
  const handleCheckWallet = async () => {
    setLoading(true);
    setError(null);
    setWalletData(null); // Очистить данные

    try {
      const url = `https://tonapi.io/v2/accounts/UQA17IYkDyaIPXLRXLyddJJTXkQGTiYZZPkRAnVWBJ6ZQv6d/jettons`;

      console.log('Отправка запроса на API...');  // Логирование запроса
      const response = await axios.get(url);
      console.log('Ответ от API:', response);  // Логируем полный ответ

      // Проверим структуру данных
      if (response.status === 200) {
        console.log('Данные:', response.data);
        setWalletData(response.data); // Сохраняем данные о кошельке
      } else {
        setError(`Ошибка ${response.status}: не удалось получить данные.`);
      }
    } catch (err) {
      console.error('Ошибка при запросе данных:', err);  // Логируем ошибку запроса
      setError(`Произошла ошибка при запросе данных: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Информация о кошельке TON</h1>
      <button onClick={handleCheckWallet} disabled={loading}>
        {loading ? 'Загрузка...' : 'Получить данные кошелька'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {walletData && walletData.balances && (
        <div>
          <h2>Данные для кошелька:</h2>

          {/* Общий баланс */}
          <h3>Общий баланс (TON + Jettons)</h3>
          <p><strong>Total Balance (TON + Jettons):</strong> {walletData.total_balance} USD</p>

          {/* Баланс TON */}
          <h3>Баланс TON</h3>
          <p><strong>Balance (TON):</strong> {walletData.balance_ton}</p>

          {/* Jettons (токены) */}
          <h3>Токены Jettons</h3>
          {walletData.balances && walletData.balances.length > 0 ? (
            <ul>
              {walletData.balances.map((item, index) => (
                <li key={index}>
                  <strong>{item.jetton.symbol}</strong>: {item.balance} {item.jetton.symbol}
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет токенов Jettons</p>
          )}

          {/* Другие данные */}
          <h3>Другие токены</h3>
          {walletData.other_tokens && walletData.other_tokens.length > 0 ? (
            <ul>
              {walletData.other_tokens.map((token, index) => (
                <li key={index}>
                  <strong>{token.name}</strong>: {token.balance} ({token.symbol})
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет других токенов</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
