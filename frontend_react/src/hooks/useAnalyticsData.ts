import { useEffect, useState } from "react";
import { AnalyticsData } from "../utils/AnalyticsData";
import { LiveCounts } from "../utils/AppState";
import _ from "lodash";

const initialData: { [id: string]: AnalyticsData } = {
  sessions: {
    number: 0,
    text: "Total Sessions",
    icon: require("../res/assets/users.svg"),
  },
  countries: {
    number: 0,
    text: "Countries",
    icon: require("../res/assets/flag.svg"),
  },
  cities: {
    number: 0,
    text: "Cities",
    icon: require("../res/assets/location.svg"),
  },
};

const useAnalyticsData = (
  liveCounts: LiveCounts,
  historicalCounts: { [cat: string]: number } | null
) => {
  const [analyticsData, setAnalyticsData] =
    useState<{ [id: string]: AnalyticsData }>(initialData);

  useEffect(() => {
    const updateData = (
      sessions: number,
      countries: number,
      cities: number
    ): { [id: string]: AnalyticsData } => {
      const updatedData = { ...analyticsData };
      updatedData.sessions.number = sessions;
      updatedData.countries.number = countries;
      updatedData.cities.number = cities;
      return updatedData;
    };

    let updatedData: { [id: string]: AnalyticsData };
    if (_.isNil(historicalCounts)) {
      updatedData = updateData(
        liveCounts.sessions,
        liveCounts.countries.size,
        liveCounts.cities.size
      );
    } else {
      updatedData = updateData(
        historicalCounts.sessions,
        historicalCounts.countries,
        historicalCounts.cities
      );
    }
    setAnalyticsData(updatedData);
  }, [liveCounts, historicalCounts]);

  return analyticsData;
};

export default useAnalyticsData;
