import React, { useEffect, useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Popover from "@material-ui/core/Popover";
import { StylesProvider } from "@material-ui/core/styles";
import TwitterIcon from "@material-ui/icons/Twitter";
import Alert from "@material-ui/lab/Alert";
import { TwitterTimelineEmbed } from "react-twitter-embed";

import styles from "./Socials.module.css";

const twitterLink =
  "https://twitter.com/MindFuelca?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor";

const loadingClasses = {
  colorPrimary: styles.loadingIndicator,
  bar: styles.loadingBar,
};

const Socials = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [placeholder, setPlaceholder] = useState<JSX.Element | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const loadingPlaceholder = <LinearProgress classes={loadingClasses} />;
  const failedPlaceholder = (
    <div className={styles.loadMessage}>
      <Alert severity="error">
        Failed to load Tweets! Is tracking prevention turned on in your browser?
      </Alert>
    </div>
  );

  const iconClasses = {
    root: styles.socialsIconButton,
  };
  const popoverClasses = {
    paper: styles.popoverPaper,
  };

  useEffect(() => {
    if (anchorEl != null) {
      setPlaceholder(loadingPlaceholder);

      // Timeout timer for loading of Tweets, loading may fail if tracking prevention is turned on
      const timer = setTimeout(() => setPlaceholder(failedPlaceholder), 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StylesProvider injectFirst>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        onClick={handleClick}
        classes={iconClasses}
      >
        <TwitterIcon style={{ fontSize: 30 }} />
      </IconButton>
      <Popover
        classes={popoverClasses}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles.popoverHeader}>
          Tweets by&nbsp;
          <a href={twitterLink} target="_blank" rel="noopener noreferrer">
            @MindFuelca
          </a>
        </div>
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="mindfuelca"
          options={{ height: 400, width: 275 }}
          noFooter={true}
          noHeader={true}
          placeholder={placeholder}
        />
      </Popover>
    </StylesProvider>
  );
};

export default Socials;
