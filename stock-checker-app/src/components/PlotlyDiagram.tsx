import { FC, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { processDiagramData } from "../utils/processDiagramData";

interface PlotlyDiagramProps {
  data: number[];
}

const PlotlyDiagram: FC<PlotlyDiagramProps> = ({ data }) => {
  const [diagramData, setDiagramData] = useState<Plotly.Data>(
    [] as Plotly.Data
  );

  useEffect(() => {
    setDiagramData(processDiagramData(data));
  }, [data]);

  const plotLayout = {
    font: {
      size: 8,
    },
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 10,
    },
    xaxis: {
      showgrid: true,
      gridwidth: 1,
      gridcolor: "#f00",
    },
    yaxis: {
      title: "PRICE (USD)",
      showgrid: true,
      gridwidth: 1,
      gridcolor: "#f00",
    },
  };

  const plotConfig = {
    displayModeBar: false,
  };

  return (
    <div className="overflow-auto">
      <Plot data={[diagramData]} layout={plotLayout} config={plotConfig} />
    </div>
  );
};

export default PlotlyDiagram;
