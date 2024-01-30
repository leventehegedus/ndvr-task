import React from "react";
import { StockDataType } from "../types";

interface StockDataProps {
  data: StockDataType;
}

const StockData: React.FC<StockDataProps> = ({ data }) => {
  const renderInfoItem = (label: string, value: number | string) => (
    <div className="mb-2">
      <strong>{label}:</strong> {value}
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Stock Information</h2>
      <div className="flex">
        <div className="mr-4">
          {renderInfoItem("Symbol", data.symbol)}
          {renderInfoItem("Company Name", data.name)}
        </div>
        <div>
          {renderInfoItem("Opening Price", data.open)}
          {renderInfoItem("High Price", data.high)}
          {renderInfoItem("Low Price", data.low)}
          {renderInfoItem("Current Price", data.current)}
        </div>
      </div>
    </div>
  );
};

export default StockData;
