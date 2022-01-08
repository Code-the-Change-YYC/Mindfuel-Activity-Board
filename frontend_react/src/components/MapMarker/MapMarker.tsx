import React, { useEffect, useRef, useState } from "react";
import styles from "./MapMarker.module.css";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import { StylesProvider } from "@material-ui/core/styles";
import { Image } from "react-bootstrap";
import PopupCard from "../PopupCard/PopupCard";
import { User } from "../../utils/User";
import { AssetType } from "../../utils/AssetType.enum";

const MapMarker = (props: any) => {
  const markerEl = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const user: User = props.user;
  const assetType = user.type === AssetType.WondervilleSession ? "session" : user.payload.asset?.type.toLowerCase();
  const icon = require(`../../assets/map-marker-${assetType}.svg`);

  useEffect(() => {
    if (props.open) {
      setAnchorEl(markerEl.current);
    }
  }, [props.open]);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget); // Anchor popover
    props.onMarkerClick(user.payload.location); // Center map by calling parent function
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? styles.popper : undefined;

  return (
    <StylesProvider injectFirst>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Image
          ref={markerEl}
          className={styles.icon}
          src={icon}
          onClick={handleClick}
        />
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
            enabled: true,
            element: arrowRef,
          },
          hide: { enabled: false },
          offset: {
            offset: "0, 10",
          },
        }}
      >
        <PopupCard user={user}></PopupCard>
        <div ref={setArrowRef} className={styles.arrow} id="arrow" />
      </Popper>
    </StylesProvider>
  );
};

export default MapMarker;
