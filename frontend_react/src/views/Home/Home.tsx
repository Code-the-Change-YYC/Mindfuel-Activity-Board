import React, { useEffect, useState } from "react";
import Map from "../../components/Map/Map";
import Timeline from "../../components/Timeline/Timeline";
import Sidenav from "../../components/Sidenav/Sidenav";
import styles from "./Home.module.css";
import SocialsComponent from "../../components/SocialsComponent/SocialsComponent";
import StatsSummary from "../../components/StatsSummary/StatsSummary";
import SocketService from "../../api/SocketService";
import { useSelector } from "react-redux";
import { AppState } from "../../utils/AppState";
import { CircularProgress } from "@material-ui/core";
import AppAlert from "../../components/AppAlert/AppAlert";
import { AlertModel } from "../../utils/Alert.model";
import { MapBounds } from "../../utils/MapBounds";
import { User } from "../../utils/User";
import SearchAreaButton from "../../components/SearchAreaButton/SearchAreaButton";
import _ from "lodash";

const Home = () => {
  const alert: AlertModel | null = useSelector(
    (state: AppState) => state.alert
  );
  const loading = useSelector((state: AppState) => state.loading);
  const historicalUsers: User[] | null = useSelector(
    (state: AppState) => state.historicalUsers
  );
  const [mapBounds, setMapBounds] = useState<MapBounds>();
  const [fromDate, setFromDate] = useState<Date>();
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

  const handleMapBoundsChange = (mapBounds?: MapBounds) => {
    setMapBounds(mapBounds);
    if (!_.isNil(historicalUsers) && historicalUsers.length != 0) {
      setShowAreaButton(true);
    }
  };

  const handleDateChange = (fromDate: Date) => {
    setFromDate(fromDate);
    setShowAreaButton(false);
  };

  return (
    <React.Fragment>
      <Sidenav></Sidenav>
      <div className={styles.buttonGroup}>
        <StatsSummary></StatsSummary>
        <SocialsComponent></SocialsComponent>
      </div>
      <div className={styles.map}>
        {alert && <AppAlert alert={alert}></AppAlert>}
        <Map onMapBoundsChange={handleMapBoundsChange}></Map>
        <div className={styles.centeredContainer}>
          {loading && <CircularProgress classes={loadingClasses} />}
          <div className={styles.searchAreaButton}>
            <SearchAreaButton
              show={showSearchAreaButton}
              mapBounds={mapBounds}
              fromDate={fromDate}
            ></SearchAreaButton>
          </div>
          <div className={styles.timeline}>
            <Timeline
              onDateChange={handleDateChange}
              mapBounds={mapBounds}
            ></Timeline>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
