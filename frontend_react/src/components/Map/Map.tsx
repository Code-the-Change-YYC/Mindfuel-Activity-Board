import { AppState } from "../../utils/AppState";
import { Location } from "../../utils/Location";
import { MapBounds } from "../../utils/MapBounds";
import { Theme, useMediaQuery } from "@material-ui/core";
import { User } from "../../utils/User";
import { useSelector } from "react-redux";
import GoogleMapReact, { ChangeEventValue, Maps } from "google-map-react";
import MapMarker from "./MapMarker/MapMarker";
import React, { ReactElement, useEffect, useState } from "react";
import _ from "lodash";
import styles from "./Map.module.css";
import useGroupedUsers from "../../hooks/useMapMarkers";

type MapProps = {
  onMapBoundsChange: (mapBounds?: MapBounds) => void;
};

const defaultCenter = { lat: 48.354594, lng: -99.99805 };

const Map = (props: MapProps) => {
  const [center, setCenter] = useState(defaultCenter);
  const [mapTypeId, setMapTypeId] = useState("roadmap");
  const [markers, setMarkers] = useState<ReactElement[]>([]);
  const [mapsApi, setMapsApi] = useState<google.maps.Map>();
  const [disableDoubleClickZoom, setDisableDoubleClickZoom] = useState(false);
  const defaultZoom = 4;

  // App state variables
  const liveUsers: User[] = useSelector((state: AppState) => state.liveUsers);
  const historicalUsers: User[] | null = useSelector(
    (state: AppState) => state.historicalUsers
  );
  const newUser: User | null = useSelector((state: AppState) => state.newUser);
  // Set historical markers when historical users prop changes
  const groupedUsers = useGroupedUsers(liveUsers, historicalUsers);

  // Hide map control for mobile screens
  const showMapControl = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const defaultMapOptions = (maps: Maps) => {
    return {
      zoomControl: false,
      disableDoubleClickZoom: disableDoubleClickZoom,
      minZoom: 3,
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

  useEffect(() => {
    if (!_.isNil(groupedUsers)) {
      const markers: ReactElement[] = [];
      Object.entries(groupedUsers).forEach(([, users], index) => {
        // Set the marker as open if the new user is contained in the list of users
        const open = newUser && _.some(users, newUser);
        markers.push(
          <MapMarker
            key={`${index} + ${open}`}
            users={users}
            newUser={_.isNil(historicalUsers) ? newUser : null}
            open={open}
            lat={users[0].payload.location.latitude} // Take the first user's location since they are all the same
            lng={users[0].payload.location.longitude}
            onMarkerClick={handleMarkerClick}
            onMarkerEnter={handleMarkerEnter}
            onMarkerLeave={handleMarkerLeave}
          ></MapMarker>
        );
      });

      setMarkers(markers);

      if (_.isNil(historicalUsers) && !_.isNil(newUser)) {
        setCenter({
          lat: newUser.payload.location.latitude,
          lng: newUser.payload.location.longitude,
        });
      }
    }
  }, [groupedUsers]);

  const getMapBounds = (
    bounds: google.maps.LatLngBounds | undefined
  ): MapBounds | undefined => {
    if (_.isNil(bounds)) {
      return undefined;
    }

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    return {
      latBounds: {
        lower: sw.lat(),
        upper: ne.lat(),
      },
      lngBounds: {
        lower: sw.lng(),
        upper: ne.lng(),
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

  const handleMarkerEnter = () => {
    setDisableDoubleClickZoom(true);
  };

  const handleMarkerLeave = () => {
    setDisableDoubleClickZoom(false);
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
        defaultZoom={defaultZoom}
        center={center}
        options={defaultMapOptions}
        yesIWantToUseGoogleMapApiInternals={true}
      >
        {markers}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
