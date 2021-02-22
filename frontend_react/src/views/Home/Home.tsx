import * as React from "react";
import Map from "../../components/Map/MapComponent";
import Timeline from "../../components/Timeline/TimelineComponent";
import Sidenav from "../../components/Sidenav/SidenavComponent";
import { Location } from "../../utils/Location";
import styles from "./Home.module.css";

interface HomeProps {
  name: string;
}

const locations: Location[] = [
  {lat: 51.0447, lng: -114.0719},
  {lat: 51.5447, lng: -114.1719},
  {lat: 53.278046, lng: -108.005470},
  {lat: 45.630001, lng: -73.519997},
  {lat: 49.2827, lng: -123.1207},
  {lat: 49.3527, lng: -123.5207},
  {lat: 45.3527, lng: -110.2207},
];

const Home: React.FunctionComponent<HomeProps> = (props) => {
  return (
    <React.Fragment>
      <Sidenav></Sidenav>
      <div className={styles.map}>
        <Map locations={locations}></Map>
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
