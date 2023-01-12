import React from "react";

import Card from "@material-ui/core/Card";

import { numberFormatter } from "../../utils/helpers";
import styles from "./AnalyticsBox.module.css";

type AnalyticsBox = {
  numberValue: number;
  textValue: string;
  icon: string;
};

const AnalyticsBox = (props: AnalyticsBox) => {
  let numberValue = numberFormatter(props.numberValue, 2);
  numberValue = numberValue === "0" ? "-" : numberValue;

  return (
    <Card className={styles.card + " " + styles.mainWrapper}>
      <div className={styles.textWrapper}>
        <div className={styles.totalNumber}>{numberValue}</div>
        <div className={styles.totalText}>{props.textValue}</div>
      </div>
      <img alt="analytics-icon" className={styles.icon} src={props.icon} />
    </Card>
  );
};

export default AnalyticsBox;
