import React, { useState, useEffect } from "react";
import axios from "axios";
import { getValues } from "../utils/getValues";
import PlotlyDiagram from "./PlotlyDiagram";
import StockData from "./StockData";
import { StockDataType, SymbolType } from "../types";

const API_BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = "cmogc31r01qjn677usf0cmogc31r01qjn677usfg";

const getApiUrl = (endpoint: string) =>
  `${API_BASE_URL}/${endpoint}&token=${API_KEY}`;

const StockChecker: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("");
  const [isValidSymbol, setIsValidSymbol] = useState<boolean>(false);
  const [stockData, setStockData] = useState<StockDataType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [companySymbol, setCompanySymbol] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [diagramData, setDiagramData] = useState<number[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const validateSymbol = async (symbol: string) => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl("stock/symbol?exchange=US"));

      const validSymbols = response.data.map((item: SymbolType) => item.symbol);
      if (!validSymbols.includes(symbol)) {
        setErrorMessage(
          "Invalid stock symbol. Please enter a valid US stock ticker."
        );
        setIsValidSymbol(false);
      } else {
        setErrorMessage(null);
        const selectedSymbol = response.data.find(
          (sym: SymbolType) => sym.symbol === symbol
        );
        setCompanyName(selectedSymbol.description);
        setCompanySymbol(symbol);
        setIsValidSymbol(true);
      }
    } catch (error) {
      setErrorMessage("Error validating symbol");
      setIsValidSymbol(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl(`quote?symbol=${symbol}`));

      const { o, h, l, c } = response.data;
      setStockData({
        symbol: companySymbol,
        name: companyName,
        open: o,
        high: h,
        low: l,
        current: c,
      });

      setDiagramData(getValues(Math.random() * 100, 0.05, 365));
    } catch (error) {
      setErrorMessage("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      validateSymbol(symbol);
    }
  }, [symbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && symbol && isValidSymbol) {
      fetchData();
    }
  };

  return (
    <div className="p-4 flex w-full flex-wrap md:flex-nowrap gap-2 bg-white text-gray-700">
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-8">US Stock Checker</h1>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter Stock Symbol"
              className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              disabled={isLoading || !symbol || !isValidSymbol}
              type="submit"
              className={`flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-sm border-none text-white py-1 px-2 rounded ${
                isLoading || !symbol || !isValidSymbol
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Loading..." : "Check Stock"}
            </button>
          </div>
        </form>
        <div className="mt-4">
          {symbol && (
            <p className={errorMessage ? "text-red-500" : "text-green-500"}>
              {errorMessage ||
                `${symbol} is a valid ticker symbol. Press the check button to fetch more data!`}
            </p>
          )}
        </div>
        {stockData && isValidSymbol && <StockData data={stockData} />}
      </div>
      <div className="w-full md:w-1/2">
        {stockData && isValidSymbol && <PlotlyDiagram data={diagramData} />}
      </div>
    </div>
  );
};

export default StockChecker;
