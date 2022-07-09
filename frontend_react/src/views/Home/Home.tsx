import React, { Suspense, useEffect, useState } from "react";

import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { useSelector } from "react-redux";

import SocketService from "../../api/SocketService";
import AppAlert from "../../components/AppAlert/AppAlert";
import Map from "../../components/Map/Map";
import SearchAreaButton from "../../components/SearchAreaButton/SearchAreaButton";
import Sidenav from "../../components/Sidenav/Sidenav";
import Socials from "../../components/Socials/Socials";
import StatsSummary from "../../components/StatsSummary/StatsSummary";
import Timeline from "../../components/Timeline/Timeline";
import { fetchHistoricalUsers } from "../../state/actions";
import { useAppDispatch } from "../../state/hooks";
import { AlertModel } from "../../utils/Alert.model";
import { AppState } from "../../utils/AppState";
import { MapBounds } from "../../utils/MapBounds";
import { User } from "../../utils/User";
import styles from "./Home.module.css";
import { AppUserLocation } from "../../utils/AppUserLocation.model";

const Home = () => {
  const dispatch = useAppDispatch();
  const alert: AlertModel | null = useSelector((state: AppState) => state.alert);
  const loading = useSelector((state: AppState) => state.loading);
  const historicalUsers: User[] | null = useSelector((state: AppState) => state.historicalUsers);
  const [appUserLocation, setAppUserLocation] = useState<AppUserLocation>();
  const [mapBounds, setMapBounds] = useState<MapBounds>();
  const [fromDate, setFromDate] = useState<Date | null>();
  const [showSearchAreaButton, setShowAreaButton] = useState<boolean>(false);
  const loadingClasses = {
    root: styles.loadingIndicatorRoot,
    colorPrimary: styles.loadingIndicatorColor,
  };

  useEffect(() => {
    // Get user location on app load
    navigator.geolocation.getCurrentPosition((position) => {
      setAppUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });

    // Connect to socket on mount
    const websocketAddress = `${[process.env.REACT_APP_MINDFUEL_WEBSOCKET]}`;
    // const websocketAddress = `${[process.env.REACT_APP_LOCAL_WEBSOCKET]}`;

    SocketService.connect(websocketAddress);

    // Call disconnect() on unmount
    return () => {
      SocketService.disconnect();
    };
  }, []); // Pass in an empty array to only run an effect once.

  const handleMapBoundsChange = (mapBounds?: MapBounds) => {
    setMapBounds(mapBounds);
    if (!_.isNil(historicalUsers)) {
      setShowAreaButton(true);
    }
  };

  const getHistoricalUsers = () => {
    if (!_.isNil(fromDate) && !_.isNil(mapBounds)) {
      dispatch(fetchHistoricalUsers(fromDate.toISOString(), mapBounds));
    }
  };

  const handleSearchAreaClick = () => {
    getHistoricalUsers();
    setShowAreaButton(false);
  };

  const handleDateChange = (fromDate?: Date) => {
    setFromDate(fromDate);
    setShowAreaButton(false);
  };

  return (
    <React.Fragment>
      <Sidenav></Sidenav>
      <div className={styles.buttonGroup}>
        <StatsSummary></StatsSummary>
        <Socials></Socials>
      </div>
      {appUserLocation && (
        <div className={styles.map}>
          {alert && <AppAlert alert={alert}></AppAlert>}
          <Map
            onMapBoundsChange={handleMapBoundsChange}
            center={{ lat: appUserLocation.latitude, lng: appUserLocation.longitude }}
          ></Map>
          <div className={styles.centeredContainer}>
            {loading && <CircularProgress classes={loadingClasses} />}
            <div className={styles.searchAreaButton}>
              {showSearchAreaButton && (
                <SearchAreaButton handleClick={handleSearchAreaClick}></SearchAreaButton>
              )}
            </div>
            <div className={styles.timeline}>
              {/* Ensure initial map bounds are captured before rendering timeline */}
              {mapBounds && (
                <Timeline onDateChange={handleDateChange} mapBounds={mapBounds}></Timeline>
              )}
            </div>
          </div>
        </div>
      )}
      {!appUserLocation && (
        <div>
          <CircularProgress classes={loadingClasses} />
        </div>
      )}
    </React.Fragment>
  );
};

export default Home;
