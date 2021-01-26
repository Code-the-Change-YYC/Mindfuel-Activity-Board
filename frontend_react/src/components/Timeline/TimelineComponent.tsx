import React from 'react';
import styles from './Timeline.module.css';
import { StylesProvider } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

function ThumbComponent(props: any) {
  return (
    <span {...props}>
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
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
        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
        defaultValue={100}
      />
    </StylesProvider>
  );
}

export default Timeline;