import React from "react";
import { User } from "../../utils/User";
import { Location } from "../../utils/Location";
import MapMarker from "../MapMarker/MapMarker";
import GoogleMapReact, { ChangeEventValue } from "google-map-react";
import styles from "./Map.module.css";

type MapProps = {
  users: User[];
};

const Map = (props: MapProps) => {
  // Default center of North America
  const [center, setCenter] = React.useState({
    lat: 48.354594,
    lng: -99.99805,
  });
  const [zoom, setZoom] = React.useState(4);
  const defaultMapOptions = {
    fullscreenControl: false,
    zoomControl: false,
  };

  const handleMarkerClick = (userLocation: Location) => {
    setCenter({ lat: +userLocation.lat, lng: +userLocation.lng });
  };

  const handleMapChange = (value: ChangeEventValue) => {
    // Capture change in center and zoom position any time the map is moved
    setCenter(value.center);
  };

  const markers = props.users.map((user, index) => {
    return (
      <MapMarker
        key={index}
        user={user}
        lat={user.location.lat}
        lng={user.location.lng}
        onMarkerClick={handleMarkerClick}
      ></MapMarker>
    );
  });

  return (
    <div className={styles.map}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: `${[process.env.REACT_APP_GOOGLE_MAPS_API_KEY]}`,
        }}
        onChange={handleMapChange}
        defaultZoom={zoom}
        center={center}
        options={defaultMapOptions}
      >
        {markers}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
