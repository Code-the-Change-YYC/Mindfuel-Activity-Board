import React, { ReactElement, useEffect, useState } from "react";
import { User } from "../../utils/User";
import { Location } from "../../utils/Location";
import MapMarker from "../MapMarker/MapMarker";
import GoogleMapReact, { ChangeEventValue } from "google-map-react";
import styles from "./Map.module.css";
import _ from "lodash";

type MapProps = {
  newUser: User | null;
  liveUsers: User[];
  historicalUsers: User[] | null;
  center: { lat: number; lng: number };
};

const Map = (props: MapProps) => {
  const [center, setCenter] = useState(props.center);
  const [zoom, setZoom] = useState(4);
  const liveMarkers: ReactElement[] = [];
  const [markers, setMarkers] = useState<ReactElement[]>([]);

  const defaultMapOptions = {
    fullscreenControl: false,
    zoomControl: false,
  };

  // Set historical markers when historical users prop changes
  useEffect(() => {
    const updateMarkers = (users: User[], newUser: User | null) => {
      return users.map((user, index) => {
        const open = newUser && _.isEqual(user, newUser) ? true : false;
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

    let markers: ReactElement[];
    if (_.isNil(props.historicalUsers)) {
      markers = updateMarkers(props.liveUsers, props.newUser);
      setCenter(props.center);
    } else {
      markers = updateMarkers(props.historicalUsers, null);
    }

    setMarkers(markers);
  }, [props.liveUsers, props.historicalUsers]);

  const handleMarkerClick = (userLocation: Location) => {
    setCenter({ lat: +userLocation.latitude, lng: +userLocation.longitude });
  };

  const handleMapChange = (value: ChangeEventValue) => {
    // Capture change in center and zoom position any time the map is moved
    setCenter(value.center);
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
