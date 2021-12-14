import React from "react";
import styles from "./Timeline.module.css";
import Slider from "@material-ui/core/Slider";
import { StylesProvider } from "@material-ui/core/styles";
import { fetchHistoricalUsers, updateHistoricalUsers } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";

const ThumbComponent = (props: any) => {
  return (
    <span {...props}>
      <span className={styles.bar + " " + styles.barLeft} />
      <span className={styles.bar + " " + styles.barRight} />
    </span>
  );
};

const marks = [
  {
    value: 0,
    label: "3 mths",
  },
  {
    value: 25,
    label: "1 mth",
  },
  {
    value: 50,
    label: "1 wk",
  },
  {
    value: 75,
    label: "1 day",
  },
  {
    value: 100,
    label: "Live",
  },
];

const Timeline = () => {
  const dispatch = useAppDispatch();
  const classes = {
    root: styles.timelineRoot,
    thumb: styles.timelineThumb,
    track: styles.timelineTrack,
    rail: styles.timelineRail,
    mark: styles.timelineMarks,
    markLabel: styles.timelineMarkLabels,
  };

  const handleChange = (event: any, newValue: number | number[]) => {
    const fromDate: Date = new Date();

    switch (newValue) {
      case 0:
        fromDate.setDate(fromDate.getDate() - 3 * 30.4167);
        break;
      case 25:
        fromDate.setDate(fromDate.getDate() - 30.4167);
        break;
      case 50:
        fromDate.setDate(fromDate.getDate() - 7);
        break;
      case 75:
        fromDate.setDate(fromDate.getDate() - 1);
        break;
      case 100:
        dispatch(updateHistoricalUsers(null));
        return;
    }

    dispatch(fetchHistoricalUsers(fromDate.toISOString()));
  };

  return (
    <StylesProvider injectFirst>
      <Slider
        classes={classes}
        ThumbComponent={ThumbComponent}
        defaultValue={100}
        step={null}
        marks={marks}
        onChangeCommitted={handleChange}
      />
    </StylesProvider>
  );
};

export default Timeline;
