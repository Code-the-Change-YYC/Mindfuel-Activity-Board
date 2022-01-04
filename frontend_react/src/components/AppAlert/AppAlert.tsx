import React from "react";
import styles from "./AppAlert.module.css";
import { setAlert } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import Alert from "@material-ui/lab/Alert";
import { AlertModel } from "../../utils/Alert.model";

type AlertProps = {
  alert: AlertModel;
};

const AppAlert = (props: AlertProps) => {
  const dispatch = useAppDispatch();
  const alertClasses = {
    root: styles.alertRoot,
  };

  const onClose = () => {
    dispatch(setAlert(null));
  };

  // Automatically close success alerts after 5 seconds
  setTimeout(() => {
    if (props.alert.severity === "success" || props.alert.severity === "info") {
      onClose();
    }
  }, 5000);

  return (
    <Alert
      onClose={onClose}
      classes={alertClasses}
      severity={props.alert.severity}
    >
      {props.alert.message}
    </Alert>
  );
};

export default AppAlert;
