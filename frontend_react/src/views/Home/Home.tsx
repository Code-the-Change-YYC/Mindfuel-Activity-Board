import React, { useEffect, useState } from "react";

import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { useSelector } from "react-redux";

import SocketService from "../../api/SocketService";
import AppAlert from "../../components/AppAlert/AppAlert";
import Filter from "../../components/Filter/Filter";
import Map from "../../components/Map/Map";
import MyLocation from "../../components/MyLocation/MyLocation";
import SearchAreaButton from "../../components/SearchAreaButton/SearchAreaButton";
import Sidenav from "../../components/Sidenav/Sidenav";
import Socials from "../../components/Socials/Socials";
import StatsSummary from "../../components/StatsSummary/StatsSummary";
import Timeline from "../../components/Timeline/Timeline";
import { fetchHistoricalUsers, setLoading, updateHistoricalUsers } from "../../state/actions";
import { useAppDispatch } from "../../state/hooks";
import { AlertModel } from "../../utils/Alert.model";
import { AppState } from "../../utils/AppState";
import { ActivityFilter } from "../../utils/FilterOption.model";
import { MapBounds } from "../../utils/MapBounds";
import { User } from "../../utils/User";
import styles from "./Home.module.css";

const Home = () => {
  const dispatch = useAppDispatch();
  const alert: AlertModel | null = useSelector((state: AppState) => state.alert);
  const loading = useSelector((state: AppState) => state.loading);
  const historicalUsers: User[] | null = useSelector((state: AppState) => state.historicalUsers);
  const heatmapToggle: boolean = useSelector((state: AppState) => state.heatmapEnabled);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>();
  const [mapBounds, setMapBounds] = useState<MapBounds>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [showSearchAreaButton, setShowAreaButton] = useState<boolean>(false);
  const loadingClasses = {
    root: styles.loadingIndicatorRoot,
    colorPrimary: styles.loadingIndicatorColor,
  };

  useEffect(() => {
    // Connect to socket on mount
    const websocketAddress = `${[process.env.REACT_APP_MINDFUEL_WEBSOCKET]}`;

    SocketService.connect(websocketAddress);

    // Call disconnect() on unmount
    return () => {
      SocketService.disconnect();
    };
  }, []); // Pass in an empty array to only run an effect once.

  useEffect(() => {
    getHistoricalUsers();
  }, [heatmapToggle]);

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
      // Reset filter
      setActivityFilter(undefined);
    }
  };

  const handleFilterChange = (activityFilter?: ActivityFilter) => {
    setActivityFilter(activityFilter);
    // Filter option is only visible when startDate and mapBounds are not null
    dispatch(fetchHistoricalUsers(startDate!.toISOString(), mapBounds!, activityFilter));
  };

  const getHistoricalUsers = () => {
    if (!_.isNil(startDate) && !_.isNil(mapBounds)) {
      dispatch(fetchHistoricalUsers(startDate.toISOString(), mapBounds, activityFilter));
    }
  };

  return (
    <React.Fragment>
      <Sidenav></Sidenav>
      <div className={styles.map}>
        {alert && <AppAlert alert={alert}></AppAlert>}
        <div className={styles.buttonGroup}>
          <Socials></Socials>
          <StatsSummary></StatsSummary>
          {startDate && mapBounds && <Filter onFilterChange={handleFilterChange}></Filter>}
        </div>
        <div className={styles.myLocationButton}>
          <MyLocation></MyLocation>
        </div>
        <Map onMapBoundsChange={handleMapBoundsChange}></Map>
        <div className={styles.centeredContainer}>
          {loading && <CircularProgress classes={loadingClasses} />}
          <div className={styles.searchAreaButton}>
            {showSearchAreaButton && (
              <SearchAreaButton handleClick={handleSearchAreaClick}></SearchAreaButton>
            )}
          </div>
          <div className={styles.timeline}>
            {/* Ensure initial map bounds are captured before rendering timeline */}
            {mapBounds && <Timeline onDateChange={handleDateChange}></Timeline>}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
