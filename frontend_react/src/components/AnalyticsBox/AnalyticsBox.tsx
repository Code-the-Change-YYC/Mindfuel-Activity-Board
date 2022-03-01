import { Card, Image } from "react-bootstrap";
import React from "react";
import styles from "./AnalyticsBox.module.css";

type AnalyticsBox = {
  numberValue: number;
  textValue: string;
  icon: string;
};

const AnalyticsBox = (props: AnalyticsBox) => {
  const numberFormatter = (num: number, digits: number) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
  };
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
