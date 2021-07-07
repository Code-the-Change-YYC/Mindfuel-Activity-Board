import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import styles from "./SocialsComponent.module.css";
import IconButton from "@material-ui/core/IconButton";
import TwitterIcon from "@material-ui/icons/Twitter";
// import { TwitterTimelineEmbed } from "react-twitter-embed";

const TwitterTimelineEmbed = require("react-twitter-embed");
const SocialsComponent = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLImageElement | null>(null);
  const iconClasses = {
    root: styles.socialsIconButton,
  };
  //   const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <React.Fragment>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        // onClick={handleDrawerToggle}
        classes={iconClasses}
      >
        <TwitterIcon style={{ fontSize: 30 }} />
      </IconButton>
      <Popover
        // id={id}
        open={open}
        anchorEl={anchorEl}
        // onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="mindfuelca"
          options={{ height: 400 }}
        />
      </Popover>
    </React.Fragment>
  );
};

export default SocialsComponent;
