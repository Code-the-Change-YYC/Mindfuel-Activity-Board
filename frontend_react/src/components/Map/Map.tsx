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
import useProcessedUsers from "../../hooks/useMapMarkers";

type MapProps = {
  onMapBoundsChange: (mapBounds?: MapBounds) => void;
};

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
  // Set historical markers when historical users prop changes
  const processedUsers = useProcessedUsers(liveUsers, historicalUsers);

  useEffect(() => {
    if (!_.isNil(processedUsers)) {
      const markers = processedUsers?.map((user, index) => {
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
      setMarkers(markers);

      if (_.isNil(historicalUsers) && !_.isNil(newUser)) {
        setCenter({
          lat: newUser.payload.location.latitude,
          lng: newUser.payload.location.longitude,
        });
      }
    }
  }, [processedUsers]);

  // Hide map control for mobile screens
  const showMapControl = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const defaultMapOptions = (maps: Maps) => {
    return {
      zoomControl: false,
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
