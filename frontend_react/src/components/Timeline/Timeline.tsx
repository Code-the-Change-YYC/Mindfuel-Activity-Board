import React, { useEffect, useState } from "react";

import Slider from "@material-ui/core/Slider";
import { StylesProvider } from "@material-ui/core/styles";

import { getTimelineDate } from "../../utils/helpers";
import styles from "./Timeline.module.css";

type TimelineProps = {
  onDateChange: (startDate?: Date) => void;
};

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

const Timeline = (props: TimelineProps) => {
  const defaultValue = 50; // Default set to 1 week
  const [selectedValue, setSelectedValue] = useState<number | number[]>(defaultValue);

  const classes = {
    root: styles.timelineRoot,
    thumb: styles.timelineThumb,
    track: styles.timelineTrack,
    rail: styles.timelineRail,
    mark: styles.timelineMarks,
    markLabel: styles.timelineMarkLabels,
  };

  useEffect(() => {
    // Load initial data for default selection of 1 week
    props.onDateChange(getTimelineDate(selectedValue));
  }, []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
    // Prevent duplicate requests
    if (newValue != selectedValue) {
      setSelectedValue(newValue);
      props.onDateChange(getTimelineDate(newValue));
    }
  };

  return (
    <StylesProvider injectFirst>
      <Slider
        classes={classes}
        ThumbComponent={ThumbComponent}
        defaultValue={defaultValue}
        step={null}
        marks={marks}
        onChangeCommitted={handleChange}
      />
    </StylesProvider>
  );
};

export default Timeline;
