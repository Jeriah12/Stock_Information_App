import React, { useState } from 'react';
import './App.css'; // Ensure you create an App.css file for the styles

const App = () => {
  const [symbol, setSymbol] = useState('');
  const [stockInfo, setStockInfo] = useState(null);
  const [newsInfo, setNewsInfo] = useState(null);
  const [error, setError] = useState('');

  // Stock logo images (you can replace these URLs with actual image URLs)
  const stockLogos = {
    AAPL: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    GOOG: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    MSFT: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    AMZN: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  };

  // Mapping of stock symbols to their full names
  const stockNames = {
    AAPL: 'Apple',
    GOOG: 'Google',
    MSFT: 'Microsoft',
    AMZN: 'Amazon',
    TSLA: 'Tesla',
  };

  const fetchStockAndNewsInfo = async () => {
    if (!symbol) {
      setError('Please select a stock symbol');
      return;
    }
    setError('');
    try {
      const response = await fetch(`https://wo8ahm1kh4.execute-api.eu-west-2.amazonaws.com/devtest/stock?symbol=${symbol}`);
      const data = await response.json();

      if (response.ok) {
        if (data.stock_info && data.news_info) {
          setStockInfo(data.stock_info);
          setNewsInfo(data.news_info);
          setError('');
        } else {
          setError('Invalid response structure from server');
          setStockInfo(null);
          setNewsInfo(null);
        }
      } else {
        setError('Error fetching data');
        setStockInfo(null);
        setNewsInfo(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching data');
      setStockInfo(null);
      setNewsInfo(null);
    }
  };

  // Function to get the color based on price change (close vs open)
  const getChangeColor = (close, open) => {
    if (close > open) return 'green'; // Price has increased
    if (close < open) return 'red'; // Price has decreased
    return 'gray'; // No change
  };

  // Logic to determine the arrow based on price change (close vs open)
  const getArrow = (close, open) => {
    if (close > open) return '▲'; // Increase
    if (close < open) return '▼'; // Decrease
    return '→'; // No change
  };

  // Function to convert date to a readable format (only Year, Month, Day)
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty string if dateString is undefined or null
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="App">
      <h1 className="app-title">Stock Information App</h1>
      
      <div className="input-container">
        <select 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)} 
          className="dropdown-menu"
        >
          <option value="">Select Stock Symbol</option>
          <option value="AAPL">Apple (AAPL)</option>
          <option value="GOOG">Google (GOOG)</option>
          <option value="MSFT">Microsoft (MSFT)</option>
          <option value="AMZN">Amazon (AMZN)</option>
        </select>
        <button onClick={fetchStockAndNewsInfo} className="submit-btn">Get Stock Info</button>
      </div>
      
      {error && <p className="error-text">{error}</p>}
      
      {stockInfo && (
        <div className="stock-info">
          <h3 className="section-title">Stock Information</h3>
          
          {/* Displaying Stock Logo */}
          <div className="stock-logo-container">
            <img src={stockLogos[symbol]} alt={`${symbol} logo`} className="stock-logo" />
          </div>
          
          <p className="stock-info-text"><strong>Stock:</strong> {stockNames[symbol]}</p>
          <div className="price-container">
            <div className="price-item">
              <h4>Open: {stockInfo.open} USD</h4>
            </div>
            <div className="price-item">
              <h4>High: {stockInfo.high} USD</h4>
            </div>
            <div className="price-item">
              <h4>Low: {stockInfo.low} USD</h4>
            </div>
            <div className="price-item">
              <h4>Close: {stockInfo.close} USD</h4>
            </div>
            <div className={`price-change ${getChangeColor(stockInfo.close, stockInfo.open)}`}>
              {getArrow(stockInfo.close, stockInfo.open)} {Math.abs((stockInfo.close - stockInfo.open).toFixed(2))} USD
            </div>
          </div>
        </div>
      )}
      
      {newsInfo && (
        <div className="news-info">
          <h3 className="section-title">Latest News</h3>
          {newsInfo.map((article, index) => (
            <div key={index} className="news-article">
              <h4>{article.title}</h4>
              <p>{article.summary}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-link">Read more</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
