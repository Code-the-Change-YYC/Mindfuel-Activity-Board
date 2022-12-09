import React, { useEffect, useState } from "react";

import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer } from 'recharts';

import { ActivityTypeEnum } from "../../../utils/ActivityType.enum";
import { ChartStat } from "../../../utils/ChartStat";
import { ActivityColourMap } from "../../../utils/FilterOption.model";
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
    let totalHits = 0;
    for (let i = 0; i < newStats.length; i++) {
      totalHits += newStats[i].hits;
    }

    // Calculate the hits for each category
    const hitsCounter = new Map<string, number>();
    for (let i = 0; i < newStats.length; i++) {
      hitsCounter.set(newStats[i].type, (hitsCounter.get(newStats[i].type) ?? 0) + newStats[i].hits);
    }

    // Create chart dataset for each category
    const newChart: ChartStat[] = [];
    hitsCounter.forEach((hits: number, category: string) => {
      const newChartStat: ChartStat = {
        name: category,
        value: hits,
        percentage: hits/totalHits * 100,
        color: ActivityColourMap[category as ActivityTypeEnum]
      };

      newChart.push(newChartStat);
    });

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
                    {payload[0].payload.value}
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
    <ResponsiveContainer width="100%" height={300}>
      <PieChart
        style={{ backgroundColor: "white", borderRadius: "5px" }}
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
          label={(data: ChartStat) => `${data.percentage.toFixed(1)}%`}
          labelLine={false}
        >
          {chartValues.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default StatsPieChart;
