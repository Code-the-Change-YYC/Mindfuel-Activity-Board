import * as sampleData from "../../../api/SampleUserData.json";
import { AssetType } from "../../../utils/AssetType.enum";
import { Image } from "react-bootstrap";
import { StylesProvider } from "@material-ui/core/styles";
import { User } from "../../../utils/User";
import Badge from "@material-ui/core/Badge";
import Carousel from "react-material-ui-carousel";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import PopupCard from "./PopupCard/PopupCard";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MapMarker.module.css";

const MapMarker = (props: any) => {
  const showBadge = props.number > 1;
  const markerEl = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const [isBadgeInvisible, setIsBadgeInvisible] = useState(!showBadge);
  const user: User = props.user;
  const assetType =
    user.type === AssetType.WondervilleSession
      ? "session"
      : user.payload.asset?.type.toLowerCase();
  const badgeClasses = {
    root: styles.numberBadgeRoot,
    badge: styles.numberBadge,
  };
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
    setIsBadgeInvisible(true);
    props.onMarkerClick(user.payload.location); // Center map by calling parent function
  };

  const handleClickAway = () => {
    setAnchorEl(null);
    if (showBadge) {
      setIsBadgeInvisible(false);
    }
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
          <Badge
            badgeContent={props.number}
            max={10}
            classes={badgeClasses}
            invisible={isBadgeInvisible}
          />
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
            onMouseEnter={props.onMarkerEnter}
            onMouseLeave={props.onMarkerLeave}
            transition
          >
            {({ TransitionProps }) => (
              <Grow
                in={open}
                style={{ transformOrigin: "bottom" }}
                {...TransitionProps}
              >
                <div>
                  <Carousel
                    navButtonsProps={{
                      style: {
                        height: 20,
                        width: 20,
                        margin: 5,
                      },
                    }}
                    indicators={false}
                    timeout={0}
                    autoPlay={false}
                    navButtonsAlwaysVisible={true}
                  >
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
