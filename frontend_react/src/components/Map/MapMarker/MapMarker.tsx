import React, { useEffect, useRef, useState } from "react";

import Badge from "@material-ui/core/Badge";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import StylesProvider from "@material-ui/styles/StylesProvider";
import Carousel from "react-material-ui-carousel";
import { getMapMarkerIconForUser } from "utils/helpers";
import { User } from "utils/User";

import styles from "./MapMarker.module.css";
import PopupCard from "./PopupCard/PopupCard";

const MapMarker = (props: any) => {
  const users: User[] = props.users;
  const markerEl = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const [isBadgeInvisible, setIsBadgeInvisible] = useState<boolean>(props.open);
  const [mapMarkerIcon, setMapMarkerIcon] = useState<string>(getMapMarkerIconForUser(users[0]));
  const badgeClasses = {
    root: styles.numberBadgeRoot,
    badge: styles.numberBadge,
  };

  useEffect(() => {
    if (props.open) {
      setAnchorEl(markerEl.current);
    } else {
      setAnchorEl(null);
    }
  }, [props.open, props.newUser]);

  useEffect(() => {
    // Reset map marker icon to the first user after a change in users from props
    setMapMarkerIcon(getMapMarkerIconForUser(users[0]));
  }, [props.open, props.newUser, users]);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget); // Anchor popover
    setIsBadgeInvisible(true);
    props.onMarkerClick(users[0].payload.location); // Center map by calling parent function
  };

  const handleClickAway = () => {
    setMapMarkerIcon(getMapMarkerIconForUser(users[0]));
    setAnchorEl(null);
    setIsBadgeInvisible(false);
  };

  const handleCarouselClick = (now: number) => {
    setMapMarkerIcon(getMapMarkerIconForUser(users[now]));
  };

  const open = Boolean(anchorEl);
  const id = open ? styles.popper : undefined;

  return (
    <StylesProvider injectFirst>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <img
            alt="map-marker"
            ref={markerEl}
            className={styles.icon}
            src={mapMarkerIcon}
            onClick={handleClick}
          />
          {users.length > 1 && (
            <Badge
              badgeContent={users.length}
              max={9}
              classes={badgeClasses}
              invisible={isBadgeInvisible}
              overlap="rectangular"
            />
          )}
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
              <Grow in={open} style={{ transformOrigin: "bottom" }} {...TransitionProps}>
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
                    navButtonsAlwaysInvisible={users.length === 1}
                    navButtonsAlwaysVisible={true}
                    onChange={handleCarouselClick}
                  >
                    {users.map((user: User, index: number) => (
                      <PopupCard
                        key={index}
                        index={index}
                        total={users.length}
                        user={user}
                      ></PopupCard>
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

export default React.memo(MapMarker);
