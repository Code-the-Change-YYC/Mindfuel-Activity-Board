import React, { ReactElement } from "react";
import { User } from "../../utils/User";
import { Location } from "../../utils/Location";
import MapMarker from "../MapMarker/MapMarker";
import GoogleMapReact, { ChangeEventValue } from "google-map-react";
import styles from "./Map.module.css";
import { useEffect } from "react";

type MapProps = {
  users: User[];
  newUser: User | null;
  center: { lat: number; lng: number };
};

const Map = (props: MapProps) => {
  const [center, setCenter] = React.useState(props.center);
  const [zoom, setZoom] = React.useState(4);
  const [markers, setMarkers] = React.useState<ReactElement[]>([]);

  const defaultMapOptions = {
    fullscreenControl: false,
    zoomControl: false,
  };

  // Set center every time the center prop changes
  useEffect(() => {
    setCenter(props.center);
  }, [props.center]);

  useEffect(() => {
    setMarkers(updateMarkers(props.users, props.newUser));
  }, [props.users]);

  const handleMarkerClick = (userLocation: Location) => {
    setCenter({ lat: +userLocation.latitude, lng: +userLocation.longitude });
  };

  const handleMapChange = (value: ChangeEventValue) => {
    // Capture change in center and zoom position any time the map is moved
    setCenter(value.center);
  };

  const updateMarkers = (users: User[], newUser: User | null) => {
    return users.map((user, index) => {
      const open = newUser && user === newUser ? true : false;
      return (
        <MapMarker
          key={index}
          user={user}
          open={open}
          lat={user.location.latitude}
          lng={user.location.longitude}
          onMarkerClick={handleMarkerClick}
        ></MapMarker>
      );
    });
  };

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
