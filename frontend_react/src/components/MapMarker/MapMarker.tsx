import React from 'react';
import styles from './MapMarker.module.css';
import { Image } from 'react-bootstrap';

const icon = require("../../assets/map-marker.svg")

const MapMarker = (props: any) => {

  return (
    <Image className={styles.icon} src={icon} />
  )
}

export default MapMarker;