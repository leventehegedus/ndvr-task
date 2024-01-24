// StockChecker.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

interface StockData {
  symbol: string;
  companyName: string;
  open: number;
  high: number;
  low: number;
  current: number;
}

const StockChecker: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });

  const apiKey = "cmogc31r01qjn677usf0cmogc31r01qjn677usfg"; // Replace with your API key

  const validateSymbol = async (symbol: string) => {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`
      );
      const validSymbols = response.data.map((item: any) => item.symbol);
      if (!validSymbols.includes(symbol)) {
        setErrorMessage(
          "Invalid stock symbol. Please enter a valid US stock ticker."
        );
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      setErrorMessage(`Error validating symbol: ${error.message}`);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
      );
      //   const historicalDataResponse = await axios.get(
      //     `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(
      //       new Date().getTime() / 1000 - 365 * 24 * 60 * 60
      //     )}&to=${Math.floor(new Date().getTime() / 1000)}&token=${apiKey}`
      //   );

      const latestData = response.data;
      //   const historicalData = historicalDataResponse.data;

      setStockData({
        symbol: latestData.symbol,
        companyName: latestData.name,
        open: latestData.o,
        high: latestData.h,
        low: latestData.l,
        current: latestData.c,
      });

      //   const labels = historicalData.t.map((timestamp: number) =>
      //     new Date(timestamp * 1000).toLocaleDateString()
      //   );
      //   const data = historicalData.c;

      //   setChartData({
      //     labels,
      //     data,
      //   });
    } catch (error) {
      setErrorMessage(`Error fetching data: ${error.message}`);
    }
  };

  useEffect(() => {
    if (symbol) {
      validateSymbol(symbol);
    }
  }, [symbol]);

  return (
    <div>
      <h1>US Stock Checker</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <label>
          Enter Stock Symbol:
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          />
        </label>
        <button type="submit">Check Stock</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      {stockData && (
        <div>
          <h2>Stock Information</h2>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th>Opening Price</th>
                <th>High Price</th>
                <th>Low Price</th>
                <th>Current Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stockData.symbol}</td>
                <td>{stockData.companyName}</td>
                <td>{stockData.open}</td>
                <td>{stockData.high}</td>
                <td>{stockData.low}</td>
                <td>{stockData.current}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockChecker;
