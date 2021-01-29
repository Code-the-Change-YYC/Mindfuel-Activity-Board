import * as React from 'react';
import Map from '../../components/Map/MapComponent';
import AnalyticsBox from '../../components/analyticsBox';
import styles from './Home.module.css';

interface HomeProps {
    name: string,
}

const data = [
    {
        "numberValue": "56",
        "textValue": "Total Users",
        "icon": require("../../assets/users.svg")
    },
    {
        "numberValue": "3",
        "textValue": "Countries",
        "icon": require("../../assets/flag.svg")
    },
    {
        "numberValue": "16",
        "textValue": "Cities",
        "icon": require("../../assets/location.svg")
    }
]

const Home: React.FunctionComponent<HomeProps> = (props) => {
    const boxes = data.map(box => {
        return <AnalyticsBox numberValue={box.numberValue} textValue={box.textValue} icon={box.icon}></AnalyticsBox>
    })

    return (
      <React.Fragment>
        <div className={styles.analyticboxes}>
            { boxes }
        </div>
        <div className={styles.map}>
          <Map></Map>
        </div>
      </React.Fragment>
    );
}

export default Home;
