import * as React from 'react';
import Map from '../../components/Map/MapComponent';
import Timeline from '../../components/Timeline/TimelineComponent'
import Sidenav from '../../components/Sidenav/SidenavComponent'
import styles from './Home.module.css';

interface HomeProps {
  name: string,
}

const Home: React.FunctionComponent<HomeProps> = (props) => {

  return (
    <React.Fragment>
      <Sidenav></Sidenav>
      <div className={styles.map}>
        <Map></Map>
        <div className={styles.timelineContainer}>
          <div className={styles.timeline}>
            <Timeline></Timeline>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
