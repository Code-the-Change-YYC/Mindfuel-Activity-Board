import React from "react";
import styles from "./AnalyticsBox.module.css";
import { Card, Image } from "react-bootstrap";

type AnalyticsBox = {
  numberValue: number;
  textValue: string;
  icon: string;
};

const AnalyticsBox = (props: AnalyticsBox) => {
  const numberValue = props.numberValue === 0 ? "-" : props.numberValue;

  return (
    <Card className={styles.card + " " + styles.mainWrapper}>
      <div className={styles.textWrapper}>
        <div>
          <span className={styles.totalNumber}>{numberValue}</span>
        </div>
        <div>
          <span className={styles.totalText}>{props.textValue}</span>
        </div>
      </div>
      <Image className={styles.icon} src={props.icon} />
    </Card>
  );
};

export default AnalyticsBox;
