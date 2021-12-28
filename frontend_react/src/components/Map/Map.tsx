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
  const [markers, setMarkers] = useState<ReactElement[]>([]);

  const defaultMapOptions = {
    fullscreenControl: false,
    zoomControl: false,
  };

  // Set historical markers when historical users prop changes
  useEffect(() => {
    // Group a user list by location
    const groupByLocation = (users: any[]): { [location: string]: any } => {
      return users.reduce((storage, user) => {
        // Create a string key based on combination of lat/long
        const group = `${user.location.latitude}_${user.location.longitude}`;
        storage[group] = storage[group] || [];
        storage[group].push(user);
        return storage;
      }, {});
    };

    const updateMarkers = (users: User[], newUser: User | null) => {
      const processedUsers: User[] = [];

      // Group users by location
      const groupedUsers = groupByLocation(users);

      // For each location keep the latest user by date
      for (const key in groupedUsers) {
        const users: User[] = groupedUsers[key];
        let latestUser: User = users[0];

        users.forEach(user => latestUser = user.date > latestUser.date ? user : latestUser);

        processedUsers.push(latestUser);
      };

      // Sort in descending order by latitude to avoid overlapping on map
      processedUsers.sort(
        (a: User, b: User) => b.location.latitude - a.location.latitude
      );

      return processedUsers.map((user, index) => {
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
    console.log(markers.length);
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
