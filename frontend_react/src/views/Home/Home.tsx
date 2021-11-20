import React, { useEffect } from "react";
import * as sampleData from "../../api/SampleUserData.json";
import Map from "../../components/Map/Map";
import Timeline from "../../components/Timeline/Timeline";
import Sidenav from "../../components/Sidenav/Sidenav";
import { User } from "../../utils/User";
import styles from "./Home.module.css";
import SocialsComponent from "../../components/SocialsComponent/SocialsComponent";
import StatsSummary from "../../components/StatsSummary/StatsSummary";
import SocketService from "../../api/SocketService";
import { useSelector } from "react-redux";
import { AppState } from "../../utils/AppState";
import { CircularProgress } from "@material-ui/core";
import AppAlert from "../../components/AppAlert/AppAlert";

const users: User[] = sampleData.users;

const Home = () => {
  const appState: AppState = useSelector((state: AppState) => state);
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

  return (
    <React.Fragment>
      <Sidenav users={appState.displayedUsers}></Sidenav>
      <div className={styles.buttonGroup}>
        <StatsSummary></StatsSummary>
        <SocialsComponent></SocialsComponent>
      </div>
      <SocialsComponent></SocialsComponent>
      <div className={styles.map}>
        {appState.alert && (
          <AppAlert alert={appState.alert}></AppAlert>
        )}
        {appState.loading && <CircularProgress classes={loadingClasses} />}
        <Map
          users={appState.displayedUsers}
          newUser={appState.newUser}
          center={appState.mapCenter}
        ></Map>
        <div className={styles.timelineContainer}>
          <div className={styles.timeline}>
            <Timeline></Timeline>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
