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
import { CircularProgress, StylesProvider } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const users: User[] = sampleData.users;

const Home = () => {
  const appState: AppState = useSelector((state: AppState) => state);
  const loadingClasses = {
    root: styles.loadingIndicatorRoot,
    colorPrimary: styles.loadingIndicatorColor,
  };
  const alertClasses = {
    root: styles.alertRoot,
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
    <StylesProvider injectFirst>
      <Alert classes={alertClasses} onClose={() => {}} severity="error">
        {/* <AlertTitle>Error</AlertTitle> */}
        Something went wrong — <strong>check it out!</strong>
      </Alert>
      <Sidenav users={appState.liveUsers}></Sidenav>
      <div className={styles.buttonGroup}>
        <StatsSummary></StatsSummary>
        <SocialsComponent></SocialsComponent>
      </div>
      <div className={styles.map}>
        {appState.loading && <CircularProgress classes={loadingClasses} />}
        <Map
          users={appState.liveUsers}
          newUser={appState.newUser}
          center={appState.mapCenter}
        ></Map>
        <div className={styles.timelineContainer}>
          <div className={styles.timeline}>
            <Timeline></Timeline>
          </div>
        </div>
      </div>
    </StylesProvider>
  );
};

export default Home;
