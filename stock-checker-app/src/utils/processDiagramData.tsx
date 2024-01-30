export const processDiagramData = (data: number[]) => {
  const SEC = 1000;
  const MINUTE = 60;

  const diagramData: Plotly.Data = {
    y: data.map((d) => d),
    x: data.map((_, index) => new Date(Date.now() + index * SEC * MINUTE)),
    type: "scatter",
    mode: "lines",
    hoverinfo: "x+y",
    showlegend: false,
  };

  return diagramData;
};
