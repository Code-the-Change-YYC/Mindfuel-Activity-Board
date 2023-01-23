import React from "react";

import IconButton from "@material-ui/core/IconButton";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import StylesProvider from "@material-ui/styles/StylesProvider";

import styles from "./MyLocation.module.css";
import { setAlert, setAppUserLocation } from "state/actions";
import { useAppDispatch } from "state/hooks";
import { WVColorTheme } from "utils/ColorTheme.enum";

const MyLocation = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    // Get user location on app initialization
    /* eslint-disable-next-line no-undef */
    const nav: Navigator = navigator;
    if (nav.geolocation) {
      nav.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            setAppUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
        },
        () => dispatch(setAlert("Do not have location permissions.", "info"))
      );
    }
  };

  const iconClasses = {
    root: styles.myLocationButton,
  };

  return (
    <StylesProvider injectFirst>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        onClick={handleClick}
        classes={iconClasses}
      >
        <MyLocationIcon style={{ fontSize: 20, color: WVColorTheme.PURPLE }} />
      </IconButton>
    </StylesProvider>
  );
};

export default MyLocation;
