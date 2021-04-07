import React from "react";
import styles from "./MapMarker.module.css";
// import Popover from "@material-ui/core/Popover";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import { StylesProvider } from "@material-ui/core/styles";
import { Image } from "react-bootstrap";
import PopupCard from "../PopupCard/PopupCard";

const MapMarker = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLImageElement | null>(null);
  const [arrowRef, setArrowRef] = React.useState<HTMLDivElement | null>(null);
  const user = props.user;
  const icon = require(`../../assets/map-marker-${user.assetType.toLowerCase()}.svg`);
  const popoverClasses = {
    root: styles.popover,
  };

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget); // Anchor popover
    props.onMarkerClick(user.location); // Center map by calling parent function
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <StylesProvider injectFirst>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Image className={styles.icon} src={icon} onClick={handleClick} />
      </ClickAwayListener>
      <Popper
        placement="top"
        open={open}
        id={id}
        anchorEl={anchorEl}
        disablePortal={true}
        transition={true}
        modifiers={{
          flip: {
            enabled: false,
          },
          preventOverflow: {
            enabled: false,
            boundariesElement: "scrollParent",
          },
          arrow: {
            enabled: false,
            // element: arrowRef,
          },
          hide: { enabled: false },
        }}
      >
        {/* <img src={user.imageUrl} alt=""/> */}
        {/* <div ref={setArrowRef} className={styles.arrow}></div> */}
        {/* <div>test</div> */}
        
        <PopupCard ref={setArrowRef} user={user}></PopupCard>
      </Popper>
      {/* <Popover
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
      </Popover> */}
    </StylesProvider>
  );
};

export default MapMarker;
