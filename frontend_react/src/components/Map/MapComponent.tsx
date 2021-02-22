import React, { useState } from 'react';
import MapMarker from '../MapMarker/MapMarker'
import GoogleMapReact from 'google-map-react';
import styles from './Map.module.css';

type Location = {
  latitude: string,
  longitude: string,
}

type MapProps = {
  locations?: Location[],
}

const Map = (props: MapProps) => {
    // Default center of North America
    const [center, setCenter] = useState({ lat: 48.354594, lng: -99.998050 });
    const [zoom, setZoom] = useState(4);
    // const markers = props.locations.map(loc => {
    //   return <MapMarker lat={loc.latitude} lng={loc.longitude}></MapMarker>
    // })
  
    return (
      <div className={styles.map}>
        <GoogleMapReact
          bootstrapURLKeys= {{key: `${[process.env.REACT_APP_GOOGLE_MAPS_API_KEY]}`}}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <MapMarker lat={51.0447} lng={-114.0719}></MapMarker>
        </GoogleMapReact>
      </div>
    );
}

export default Map;

