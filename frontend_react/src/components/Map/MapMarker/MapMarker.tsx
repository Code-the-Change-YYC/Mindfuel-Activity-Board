import { Image } from "react-bootstrap";
import { StylesProvider } from "@material-ui/core/styles";
import { User } from "../../../utils/User";
import { getMapMarkerIconForUser } from "../../../utils/helpers";
import Badge from "@material-ui/core/Badge";
import Carousel from "react-material-ui-carousel";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import PopupCard from "./PopupCard/PopupCard";
import React, { useEffect, useRef, useState } from "react";
import styles from "./MapMarker.module.css";

const MapMarker = (props: any) => {
  const users: User[] = props.users;
  const showBadge = users.length > 1;
  const markerEl = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const [isBadgeInvisible, setIsBadgeInvisible] = useState(!showBadge);
  const [mapMarkerIcon, setMapMarkerIcon] = useState<string>(
    getMapMarkerIconForUser(users[0])
  );
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
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

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget); // Anchor popover
    setIsBadgeInvisible(true);
    props.onMarkerClick(users[0].payload.location); // Center map by calling parent function
  };

  const handleClickAway = () => {
    setAnchorEl(null);
    if (showBadge) {
      setIsBadgeInvisible(false);
    }
  };

  const handleCarouselClick = (now: number) => {
    setCarouselIndex(now);
    setMapMarkerIcon(getMapMarkerIconForUser(users[now]));
  };

  const open = Boolean(anchorEl);
  const id = open ? styles.popper : undefined;

  return (
    <StylesProvider injectFirst>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Badge
            badgeContent={users.length}
            max={9}
            classes={badgeClasses}
            invisible={isBadgeInvisible}
          />
          <Image
            ref={markerEl}
            className={styles.icon}
            src={mapMarkerIcon}
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
                    index={carouselIndex}
                    indicators={false}
                    timeout={0}
                    autoPlay={false}
                    navButtonsAlwaysInvisible={!showBadge}
                    navButtonsAlwaysVisible={true}
                    onChange={handleCarouselClick}
                  >
                    {users.map((user: User, index: number) => (
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
