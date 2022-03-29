import { AssetType } from "../../../utils/AssetType.enum";
import { Image } from "react-bootstrap";
import { StylesProvider } from "@material-ui/core/styles";
import { User } from "../../../utils/User";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PopupCard from "./PopupCard/PopupCard";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MapMarker.module.css";
import Carousel from "react-material-ui-carousel";
import * as sampleData from "../../../api/SampleUserData.json";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const MapMarker = (props: any) => {
  const markerEl = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const user: User = props.user;
  const assetType =
    user.type === AssetType.WondervilleSession
      ? "session"
      : user.payload.asset?.type.toLowerCase();
  /* eslint-disable  @typescript-eslint/no-var-requires */
  const icon = require(`../../../res/assets/map-marker-${assetType}.svg`);

  useEffect(() => {
    if (props.open) {
      setAnchorEl(markerEl.current);
    } else {
      setAnchorEl(null);
    }
  }, [props.open, props.newUser]);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget); // Anchor popover
    props.onMarkerClick(user.payload.location); // Center map by calling parent function
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? styles.popper : undefined;

  const testUsers = sampleData.users
    .map((user) => {
      const newUser: User = {
        ...user,
        date: new Date(),
      };
      return newUser;
    })
    .slice(0, 10);

  return (
    <StylesProvider injectFirst>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Image
            ref={markerEl}
            className={styles.icon}
            src={icon}
            onClick={handleClick}
          />
          <Popper
            placement="top"
            open={open}
            id={id}
            anchorEl={anchorEl}
            disablePortal={true}
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
            transition
          >
            {({ TransitionProps }) => (
              <Grow
                in={open}
                style={{ transformOrigin: "bottom" }}
                {...TransitionProps}
              >
                <div>
                  <Carousel indicators={false} timeout={0} autoPlay={false} navButtonsAlwaysVisible={true} IndicatorIcon={<FiberManualRecordIcon  style={{ fontSize: 1 }} />}>
                    {testUsers.map((user: User, index: number) => (
                      <PopupCard key={index} user={user}></PopupCard>
                    ))}
                  </Carousel>
                  <div ref={setArrowRef} className={styles.arrow} id="arrow" />
                </div>
              </Grow>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    </StylesProvider>
  );
};

export default MapMarker;
