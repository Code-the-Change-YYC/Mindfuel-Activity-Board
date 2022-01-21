import React, { ReactElement, useEffect, useState } from "react";
import { User } from "../../utils/User";
import { Location } from "../../utils/Location";
import MapMarker from "../MapMarker/MapMarker";
import GoogleMapReact, { ChangeEventValue, Maps } from "google-map-react";
import styles from "./Map.module.css";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../utils/AppState";
import { Theme, useMediaQuery } from "@material-ui/core";
import { MapBounds } from "../../utils/MapBounds";

type MapProps = {
  onMapBoundsChange: (mapBounds?: MapBounds) => void;
}

const defaultCenter = { lat: 48.354594, lng: -99.99805 };

const Map = (props: MapProps) => {
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(4);
  const [mapTypeId, setMapTypeId] = useState("roadmap");
  const [markers, setMarkers] = useState<ReactElement[]>([]);
  const [mapsApi, setMapsApi] = useState<google.maps.Map>();

  // App state variables
  const liveUsers: User[] = useSelector((state: AppState) => state.liveUsers);
  const historicalUsers: User[] | null = useSelector(
    (state: AppState) => state.historicalUsers
  );
  const newUser: User | null = useSelector((state: AppState) => state.newUser);

  // Hide map control for mobile screens
  const showMapControl = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const defaultMapOptions = (maps: Maps) => {
    return {
      zoomControl: false,
      minZoom: 2.5,
      restriction: {
        latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
      },
      mapTypeControl: showMapControl,
      mapTypeId: mapTypeId,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: maps.ControlPosition.LEFT_TOP,
        mapTypeIds: [
          maps.MapTypeId.ROADMAP,
          maps.MapTypeId.SATELLITE,
          maps.MapTypeId.HYBRID,
        ],
      },
    };
  };

  // Set historical markers when historical users prop changes
  useEffect(() => {
    // Group a user list by location
    const groupByLocation = (users: any[]): { [location: string]: any } => {
      return users.reduce((storage, user) => {
        // Create a string key based on combination of lat/long
        const group = `${user.payload.location.latitude}_${user.payload.location.longitude}`;
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

        users.forEach((user) => {
          if (!_.isNil(user.date) && !_.isNil(latestUser.date)) {
            latestUser = user.date > latestUser.date ? user : latestUser;
          }
        });

        processedUsers.push(latestUser);
      }

      // Sort in descending order by latitude to avoid overlapping on map
      processedUsers.sort(
        (a: User, b: User) =>
          b.payload.location.latitude - a.payload.location.latitude
      );

      return processedUsers.map((user, index) => {
        const open = newUser && _.isEqual(user, newUser) ? true : false;
        return (
          <MapMarker
            key={index}
            user={user}
            open={open}
            lat={user.payload.location.latitude}
            lng={user.payload.location.longitude}
            onMarkerClick={handleMarkerClick}
          ></MapMarker>
        );
      });
    };

    let markers: ReactElement[];
    if (_.isNil(historicalUsers)) {
      markers = updateMarkers(liveUsers, newUser);
      if (!_.isNil(newUser)) {
        setCenter({
          lat: newUser.payload.location.latitude,
          lng: newUser.payload.location.longitude,
        });
      }
    } else {
      markers = updateMarkers(historicalUsers, null);
    }

    setMarkers(markers);
  }, [liveUsers, historicalUsers]);

  const getMapBounds = (bounds: google.maps.LatLngBounds | undefined): MapBounds | undefined => {
    if (_.isNil(bounds)) {
      return undefined;
    }

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    return {
      latBounds: {
        lower: Math.min(sw.lat(), ne.lat()),
        upper: Math.max(sw.lat(), ne.lat()),
      },
      lngBounds: {
        lower: Math.min(sw.lng(), ne.lng()),
        upper: Math.max(sw.lng(), ne.lng()),
      },
    };
  };

  const handleGoogleApiLoad = (maps: { map: google.maps.Map }) => {
    setMapsApi(maps.map);
    props.onMapBoundsChange(getMapBounds(maps.map.getBounds()));
  };

  const handleMapChange = (value: ChangeEventValue) => {
    // Capture change in center position and bounds when the map is moved
    setCenter(value.center);
    props.onMapBoundsChange(getMapBounds(mapsApi?.getBounds()));
  };

  const handleMapTypeIdChange = (mapTypeId: string) => {
    setMapTypeId(mapTypeId);
  };

  const handleMarkerClick = (userLocation: Location) => {
    setCenter({ lat: +userLocation.latitude, lng: +userLocation.longitude });
  };

  return (
    <div className={styles.map}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: `${[process.env.REACT_APP_GOOGLE_MAPS_API_KEY]}`,
        }}
        onGoogleApiLoaded={handleGoogleApiLoad}
        onChange={handleMapChange}
        onMapTypeIdChange={handleMapTypeIdChange}
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
