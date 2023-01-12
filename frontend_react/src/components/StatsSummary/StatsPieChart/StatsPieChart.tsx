import React, { useEffect, useState } from "react";

import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { ActivityTypeEnum } from "utils/ActivityType.enum";
import { ChartStat } from "utils/ChartStat";
import { ActivityColourMap } from "utils/FilterOption.model";
import { Stats } from "utils/Stats";

import styles from "./StatsPieChart.module.css";

const StatsPieChart = (props: { stats: Stats[] }) => {
  const [chartValues, setChartValues] = useState<ChartStat[]>([]);

  useEffect(() => {
    updateChart(props.stats);
  }, [props.stats]);

  const updateChart = (newStats: Stats[]) => {
    let totalHits = 0;
    for (let i = 0; i < newStats.length; i++) {
      totalHits += newStats[i].hits;
    }

    // Calculate the hits for each category
    const hitsCounter = new Map<string, number>();
    for (let i = 0; i < newStats.length; i++) {
      hitsCounter.set(
        newStats[i].type,
        (hitsCounter.get(newStats[i].type) ?? 0) + newStats[i].hits
      );
    }

    // Create chart dataset for each category
    const newChart: ChartStat[] = [];
    hitsCounter.forEach((hits: number, category: string) => {
      const newChartStat: ChartStat = {
        name: category,
        value: hits,
        percentage: (hits / totalHits) * 100,
        color: ActivityColourMap[category as ActivityTypeEnum],
      };

      newChart.push(newChartStat);
    });

    setChartValues(newChart);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltipContainer}>
          <table>
            <tbody>
              <tr>
                <th align="left">{payload[0].payload.name}</th>
              </tr>
              <tr>
                <td>Hits</td>
                <td style={{ paddingLeft: "10px" }}>{payload[0].payload.value}</td>
              </tr>
              <tr>
                <td>Percentage</td>
                <td style={{ paddingLeft: "10px" }}>{payload[0].payload.percentage.toFixed(1)}%</td>
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
      <PieChart style={{ backgroundColor: "white", borderRadius: "5px" }}>
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
};

export default StatsPieChart;
