import React, { useEffect, useState } from "react";

import Chip from "@material-ui/core/Chip";
import { StylesProvider } from "@material-ui/core/styles";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import { useSelector } from "react-redux";

import { AppState } from "../../utils/AppState";
import styles from "./WSConnectionStatus.module.css";

type WSConnectionStatusProps = {
  isVisible: boolean;
};

const WSConnectionStatus = (props: WSConnectionStatusProps) => {
  const [showConnected, setShowConnected] = useState<boolean>(false);
  const isWebSocketConnected: boolean = useSelector(
    (state: AppState) => state.isWebSocketConnected
  );

  const offlineClasses = {
    root: styles.offlineChip,
    icon: styles.offlineIcon,
  };
  const onlineClasses = {
    root: styles.onlineChip,
    icon: styles.onlineIcon,
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (props.isVisible && isWebSocketConnected) {
      setShowConnected(true);
      // Automatically close connected chip after 5 seconds
      timer = setTimeout(() => {
        if (props.isVisible && isWebSocketConnected) {
          setShowConnected(false);
        }
      }, 5000);
    } else {
      setShowConnected(false);
    }

    // Clear timeout on unmount
    return () => {
      clearTimeout(timer);
    };
  }, [props.isVisible, isWebSocketConnected]);

  return (
    <StylesProvider injectFirst>
      {!isWebSocketConnected && (
        <Chip icon={<CloudOffIcon />} label="Reconnecting..." classes={offlineClasses} />
      )}
      {isWebSocketConnected && showConnected && (
        <Chip icon={<CloudDoneIcon />} label="Connected!" classes={onlineClasses} />
      )}
    </StylesProvider>
  );
};

export default WSConnectionStatus;
