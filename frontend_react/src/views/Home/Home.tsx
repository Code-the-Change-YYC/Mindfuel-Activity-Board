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

interface HomeProps {
  name: string;
}

const users: User[] = sampleData.users;

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const appState: AppState = useSelector((state: AppState) => state);

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
      <Sidenav users={appState.liveUsers}></Sidenav>
      <div className={styles.buttonGroup}>
        <StatsSummary></StatsSummary>
        <SocialsComponent></SocialsComponent>
      </div>
      <div className={styles.map}>
        <Map users={appState.liveUsers} newUser={appState.newUser} center={appState.mapCenter}></Map>
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
