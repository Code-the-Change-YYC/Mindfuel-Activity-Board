import * as React from 'react';
import Map from '../../components/Map/MapComponent';
import styles from './Home.module.css';
interface HomeProps {
    name: string,
}


const Home: React.FunctionComponent<HomeProps> = (props) => {
    return (
      <Map></Map>
    );
}

export default Home;