import React from 'react';
import styles from './Timeline.module.css';
import { StylesProvider } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

const ThumbComponent = (props: any) => {
  return (
    <span {...props}>
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
  );
}

const LabelComponent = (props: any) => {
  const { children, open, value } = props;

  const classes = {
    tooltip: styles.tooltip,
    arrow: styles.arrow
  }

  return(
  <Tooltip open={open} classes={classes} title={value} arrow>{children}</Tooltip>
  );
}

const Timeline = () => {
  const classes = {
    root: styles.timelineRoot,
    thumb: styles.timelineThumb,
    track: styles.timelineTrack,
    rail: styles.timelineRail,
  }

  return (
    <StylesProvider injectFirst>
      <Slider
        classes={classes}
        ThumbComponent={ThumbComponent}
        defaultValue={100}
        ValueLabelComponent={LabelComponent}
      />
    </StylesProvider>
  );
}

export default Timeline;