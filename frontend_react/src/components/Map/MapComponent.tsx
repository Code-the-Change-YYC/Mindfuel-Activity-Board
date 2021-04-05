import React, { useState } from 'react';
import { User } from '../../utils/User';
import MapMarker from '../MapMarker/MapMarker';
import GoogleMapReact, { ChangeEventValue } from 'google-map-react';
import styles from './Map.module.css';

type MapProps = {
  users: User[],
}

const Map = (props: MapProps) => {
  // Default center of North America
  const [center, setCenter] = useState({ lat: 48.354594, lng: -99.998050 });
  const [zoom, setZoom] = useState(4);

  const handleMarkerClick = (event: React.MouseEvent) => {
    console.log(event)
    setCenter({ lat: 41, lng: -99.95 });
  };

  const handleMapChange = (value: ChangeEventValue) => {
    // Capture change in center position any time the map is moved
    setCenter(value.center)
  };

  const markers = props.users.map((user, index) => {
    return <MapMarker key={index} lat={user.location.lat} lng={user.location.lng} onMarkerClick={handleMarkerClick}></MapMarker>
  })

  return (
    <div className={styles.map}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: `${[process.env.REACT_APP_GOOGLE_MAPS_API_KEY]}` }}
        onChange={handleMapChange}
        defaultZoom={zoom}
        center={center}
      >
        {markers}
      </GoogleMapReact>
    </div>
  );
}

export default Map;

