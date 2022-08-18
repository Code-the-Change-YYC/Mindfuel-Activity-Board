import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { ChartStat } from "../../../utils/ChartStat";
import { numberFormatter } from "../../../utils/helpers";
import { Stats } from "../../../utils/Stats";

const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const StatsPieChart = (props: { stats: Stats[] }) => {
  const [chartValues, setChartValues] = useState<ChartStat[]>([]);

  useEffect(() => {
    updateChart(props.stats);
  }, [props.stats])

  const updateChart = (newStats: Stats[]) => {
    const newChart: ChartStat[] = []
    let totalHits = 0
    for (let i = 0; i < newStats.length; i++) {
      totalHits += newStats[i].hits
    }

    loop1:
    for (let i = 0; i < newStats.length; i++) {
      const newStat: ChartStat = {value: 0, name: "", color: "", percentage: 0.0}
      for (let j = 0; j < newChart.length; j++) {
        if (newChart[j].name === newStats[i].type) {
          newChart[j].value += newStats[i].hits
          continue loop1;
        }
      }
      newStat.value = newStats[i].hits;
      newStat.name = newStats[i].type;
      newStat.percentage = newStats[i].hits/totalHits * 100;
      switch (newStats[i].type) {
        case "Activity":
          newStat.color = "#1F64AF";
          break;
        case "Game":
          newStat.color = "#F7901E";
          break;
        case "Video":
          newStat.color = "#00613e";
          break;
        case "Story":
          newStat.color = "#787400";
          break;
        default:
          newStat.color = colors[i];
          break;
      }
      newChart.push(newStat);
    }
    setChartValues(newChart);
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#ffdd00",
            padding: "5px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <table>
            <tbody>
              <tr>
                <th align="left">
                  <text style={{ color: "#52247f" }}>{payload[0].payload.name}</text>
                </th>
              </tr>
              <tr>
                <td>
                  <text style={{ color: "#52247f" }}>Hits</text>
                </td>
                <td style={{ paddingLeft: "10px" }}>
                  <text style={{ color: "#52247f" }}>
                    {numberFormatter(payload[0].payload.value, 1)}
                  </text>
                </td>
              </tr>
              <tr>
                <td>
                  <text style={{ color: "#52247f" }}>Percentage</text>
                </td>
                <td style={{ paddingLeft: "10px" }}>
                  <text style={{ color: "#52247f" }}>
                    {payload[0].payload.percentage.toFixed(1)}%
                  </text>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  return (
    <PieChart
      width={450}
      height={400}
      style={{ backgroundColor: "white", borderRadius: "5px", margin: "25px auto" }}
    >
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={chartValues}
        cx={"50%"}
        cy={"50%"}
        outerRadius={"80%"}
        innerRadius={"60%"}
        paddingAngle={5}
        fill="#ffdd00"
        stroke="#52247f"
        label
        labelLine={false}
      >
        {chartValues.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );
}

export default StatsPieChart;
