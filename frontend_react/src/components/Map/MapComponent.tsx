import React, { useState } from 'react';
import MapMarker from '../MapMarker/MapMarker'
import GoogleMapReact from 'google-map-react';
import styles from './Map.module.css';

const Map = () => {
    // Default center of North America
    const [center, setCenter] = useState({ lat: 48.354594, lng: -99.998050 });
    const [zoom, setZoom] = useState(4);
    return (
      <div className={styles.map}>
        <GoogleMapReact
          bootstrapURLKeys= {{key: `${[process.env.REACT_APP_GOOGLE_MAPS_API_KEY]}`}}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <MapMarker></MapMarker>
        </GoogleMapReact>
      </div>
    );
}

export default Map;

