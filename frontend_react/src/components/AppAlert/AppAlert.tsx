import React from "react";
import styles from "./AppAlert.module.css";
import { setError } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";
import Alert, { Color } from "@material-ui/lab/Alert";

type AlertProps = {
  message: String;
  severity: Color | undefined;
};

const AppAlert = (props: AlertProps) => {
  const dispatch = useAppDispatch();
  const alertClasses = {
    root: styles.alertRoot,
  };

  const onClose = () => {
    dispatch(setError(null));
  };

  return (
    <Alert onClose={onClose} classes={alertClasses} severity={props.severity}>
      {props.message}
    </Alert>
  );
};

export default AppAlert;
