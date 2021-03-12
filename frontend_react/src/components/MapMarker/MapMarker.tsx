import React from "react";
import styles from "./MapMarker.module.css";
import Popover from "@material-ui/core/Popover";
import { StylesProvider } from '@material-ui/core/styles';
import { Image } from "react-bootstrap";

const icon = require("../../assets/map-marker.svg");

const MapMarker = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLImageElement | null>(null);

  const popoverClasses = {
    root: styles.popover
  }

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <StylesProvider injectFirst>
      <Image className={styles.icon} src={icon} onClick={handleClick} />
      <Popover
        classes={popoverClasses}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
          The content of the Popover.
      </Popover>
    </StylesProvider>
  );
};

export default MapMarker;
