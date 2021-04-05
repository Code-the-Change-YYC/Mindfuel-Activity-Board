import * as React from "react";
import * as sampleData from "../../api/SampleUserData.json";
import Map from "../../components/Map/MapComponent";
import Timeline from "../../components/Timeline/TimelineComponent";
import Sidenav from "../../components/Sidenav/SidenavComponent";
import { User} from "../../utils/User";
import styles from "./Home.module.css";

interface HomeProps {
  name: string;
}

const users: User[] = sampleData.users;

const Home: React.FunctionComponent<HomeProps> = (props) => {
  return (
    <React.Fragment>
      <Sidenav></Sidenav>
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
