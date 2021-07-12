import React from "react";
import Popover from "@material-ui/core/Popover";
import styles from "./SocialsComponent.module.css";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import { StylesProvider } from "@material-ui/core/styles";
import TwitterIcon from "@material-ui/icons/Twitter";
import { TwitterTimelineEmbed } from "react-twitter-embed";

const twitterLink =
  "https://twitter.com/MindFuelca?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor";

const SocialsComponent = () => {
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const iconClasses = {
    root: styles.socialsIconButton,
  };
  const popoverClasses = {
    paper: styles.popoverPaper,
  };
  const loadingClasses = {
    colorPrimary: styles.loadingIndicator,
    bar: styles.loadingBar,
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
          <a href={twitterLink} target="_blank">
            @MindFuelca
          </a>
        </div>
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="mindfuelca"
          options={{ height: 400, width: 275 }}
          noFooter={true}
          noHeader={true}
          placeholder={<LinearProgress classes={loadingClasses} />}
        />
      </Popover>
    </StylesProvider>
  );
};

export default SocialsComponent;
