import React from "react";

import Slider from "@material-ui/core/Slider";
import { StylesProvider } from "@material-ui/core/styles";
import _ from "lodash";

import { fetchHistoricalUsers, updateHistoricalUsers } from "../../state/actions";
import { useAppDispatch } from "../../state/hooks";
import { getTimelineDate } from "../../utils/helpers";
import { MapBounds } from "../../utils/MapBounds";
import styles from "./Timeline.module.css";

type TimelineProps = {
  onDateChange: (fromDate?: Date) => void;
  mapBounds?: MapBounds;
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
  const dispatch = useAppDispatch();
  const classes = {
    root: styles.timelineRoot,
    thumb: styles.timelineThumb,
    track: styles.timelineTrack,
    rail: styles.timelineRail,
    mark: styles.timelineMarks,
    markLabel: styles.timelineMarkLabels,
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
    const fromDate = getTimelineDate(newValue);
  
    props.onDateChange(fromDate);
    if (!_.isNil(fromDate) && !_.isNil(props.mapBounds)) {
      dispatch(fetchHistoricalUsers(fromDate.toISOString(), props.mapBounds));
    } else {
      dispatch(updateHistoricalUsers(null));
    }
    
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
