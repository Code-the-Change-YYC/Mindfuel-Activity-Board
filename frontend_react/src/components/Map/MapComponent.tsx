import React, { useState } from 'react';
import { User } from '../../utils/User';
import MapMarker from '../MapMarker/MapMarker';
import GoogleMapReact from 'google-map-react';
import styles from './Map.module.css';

type MapProps = {
  users: User[],
}

const Map = (props: MapProps) => {
  // Default center of North America
  const [center, setCenter] = useState({ lat: 48.354594, lng: -99.998050 });
  const [zoom, setZoom] = useState(4);

  const handleClick = (event: React.MouseEvent) => {
    setCenter({ lat: 48.354594, lng: -99.998050 });
  };

  const markers = props.users.map((user, index) => {
    return <MapMarker key={index} lat={user.location.lat} lng={user.location.lng} onClick={handleClick}></MapMarker>
  })

  return (
    <div className={styles.map}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: `${[process.env.REACT_APP_GOOGLE_MAPS_API_KEY]}` }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {markers}
      </GoogleMapReact>
    </div>
  );
}

export default Map;

