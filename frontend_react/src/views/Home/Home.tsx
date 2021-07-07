import React from "react";
import * as sampleData from "../../api/SampleUserData.json";
import Map from "../../components/Map/Map";
import Timeline from "../../components/Timeline/Timeline";
import Sidenav from "../../components/Sidenav/Sidenav";
import SocialsCompoment from "../../components/SocialsComponent/SocialsComponent";
import { User} from "../../utils/User";
import styles from "./Home.module.css";
import SocialsComponent from "../../components/SocialsComponent/SocialsComponent";

interface HomeProps {
  name: string;
}

const users: User[] = sampleData.users;

const Home: React.FunctionComponent<HomeProps> = (props) => {
  return (
    <React.Fragment>
      <Sidenav></Sidenav>
      <SocialsComponent></SocialsComponent>
      <div className={styles.map}>
        <Map users={users}></Map>
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
