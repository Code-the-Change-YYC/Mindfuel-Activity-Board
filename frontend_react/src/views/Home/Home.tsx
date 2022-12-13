import React, { useEffect, useState } from "react";

import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { useSelector } from "react-redux";

import SocketService from "../../api/SocketService";
import AppAlert from "../../components/AppAlert/AppAlert";
import Filter from "../../components/Filter/Filter";
import Map from "../../components/Map/Map";
import SearchAreaButton from "../../components/SearchAreaButton/SearchAreaButton";
import Sidenav from "../../components/Sidenav/Sidenav";
import Socials from "../../components/Socials/Socials";
import StatsSummary from "../../components/StatsSummary/StatsSummary";
import Timeline from "../../components/Timeline/Timeline";
import { fetchHistoricalUsers, setLoading, updateHistoricalUsers } from "../../state/actions";
import { useAppDispatch } from "../../state/hooks";
import { AlertModel } from "../../utils/Alert.model";
import { AppState } from "../../utils/AppState";
import { AppUserLocation } from "../../utils/AppUserLocation.model";
import { ActivityFilter } from "../../utils/FilterOption.model";
import { MapBounds } from "../../utils/MapBounds";
import { User } from "../../utils/User";
import styles from "./Home.module.css";

const DEFAULT_APP_USER_LOCATION: AppUserLocation = {
  latitude: 48.354594,
  longitude: -99.99805,
};

const Home = () => {
  const dispatch = useAppDispatch();
  const alert: AlertModel | null = useSelector((state: AppState) => state.alert);
  const loading = useSelector((state: AppState) => state.loading);
  const historicalUsers: User[] | null = useSelector((state: AppState) => state.historicalUsers);
  const heatmapToggle: boolean = useSelector((state: AppState) => state.heatmapEnabled);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>();
  const [appUserLocation, setAppUserLocation] = useState<AppUserLocation>();
  const [mapBounds, setMapBounds] = useState<MapBounds>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [initializationText, setInitializationText] = useState<string>("Loading application...");
  const [showSearchAreaButton, setShowAreaButton] = useState<boolean>(false);
  const loadingClasses = {
    root: styles.loadingIndicatorRoot,
    colorPrimary: styles.loadingIndicatorColor,
  };
  const appLoadingClasses = {
    colorPrimary: styles.loadingIndicatorColor,
  };

  useEffect(() => {
    // If no geolocation response is received within a timeout interval, set to default location
    const appUserLocationTimeout = setTimeout(() => {
      setInitializationText("Setting default location...");
      setTimeout(() => setAppUserLocation(DEFAULT_APP_USER_LOCATION), 500);
    }, 2500);

    // Get user location on app initialization
    if (!navigator.geolocation) {
      setAppUserLocation(DEFAULT_APP_USER_LOCATION);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(setLoading(true));
          setAppUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          dispatch(setLoading(false));
          clearTimeout(appUserLocationTimeout);
        },
        // Set to default location if user blocks geolocation or on timeout
        () => {
          setAppUserLocation(DEFAULT_APP_USER_LOCATION);
          clearTimeout(appUserLocationTimeout);
        },
        { timeout: 3000 } // The amount of time the device can take to return a position
      );
    }

    // Connect to socket on mount
    const websocketAddress = `${[process.env.REACT_APP_MINDFUEL_WEBSOCKET]}`;

    SocketService.connect(websocketAddress);

    // Call disconnect() on unmount
    return () => {
      SocketService.disconnect();
    };
  }, []); // Pass in an empty array to only run an effect once.

  useEffect(() => {
    getHistoricalUsers()
  }, [heatmapToggle])

  const handleMapBoundsChange = (mapBounds?: MapBounds) => {
    setMapBounds(mapBounds);
    if (!_.isNil(historicalUsers)) {
      setShowAreaButton(true);
    }
  };

  // Make a request on 'Search Area' click 
  const handleSearchAreaClick = () => {
    getHistoricalUsers();
    setShowAreaButton(false);
  };

  // Make a request on timeline date selection
  const handleDateChange = (startDate?: Date) => {
    setStartDate(startDate);
    setShowAreaButton(false);
    if (!_.isNil(startDate)) {
      dispatch(fetchHistoricalUsers(startDate.toISOString(), mapBounds!, activityFilter));
    } else {
      dispatch(updateHistoricalUsers(null));
    }
  };

  const handleFilterChange = (activityFilter?: ActivityFilter) => {
    setActivityFilter(activityFilter);
    // Filter option is only visible when startDate and mapBounds are not null
    dispatch(fetchHistoricalUsers(startDate!.toISOString(), mapBounds!, activityFilter));
  }

  const getHistoricalUsers = () => {
    if (!_.isNil(startDate) && !_.isNil(mapBounds)) {
      dispatch(fetchHistoricalUsers(startDate.toISOString(), mapBounds, activityFilter));
    }
  };

  return (
    <React.Fragment>
      <Sidenav></Sidenav>
      {appUserLocation && (
        <div className={styles.map}>
          {alert && <AppAlert alert={alert}></AppAlert>}
          <div className={styles.buttonGroup}>
            <Socials></Socials>
            <StatsSummary></StatsSummary>
            {startDate && mapBounds && <Filter onFilterChange={handleFilterChange}></Filter>}
          </div>
          <Map onMapBoundsChange={handleMapBoundsChange} center={appUserLocation!}></Map>
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
                <Timeline onDateChange={handleDateChange}></Timeline>
              )}
            </div>
          </div>
        </div>
      )}
      {!appUserLocation && (
        <div className={styles.initializationContainer}>
          {initializationText}
          <div className={styles.appLoadingContainer}>
            <CircularProgress classes={appLoadingClasses} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Home;
