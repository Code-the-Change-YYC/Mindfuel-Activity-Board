import { Card, Image } from "react-bootstrap";
import { numberFormatter } from "../../utils/helpers";
import React from "react";
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
      <Image className={styles.icon} src={props.icon} />
    </Card>
  );
};

export default AnalyticsBox;
