import React from "react";

import Card from "@material-ui/core/Card";
import _ from "lodash";

import styles from "./PopupCard.module.css";
import wondervilleLogo from "res/assets/wonderville-logo.png";
import { AssetType } from "utils/AssetType.enum";
import { User } from "utils/User";

type PopupCardProps = {
  user: User;
  index: number;
  total: number;
};

const PopupCard = (props: PopupCardProps) => {
  const user = props.user;
  const loc = user.payload.location;
  const isSession = user.type === AssetType.WondervilleSession;
  const imageUrl =
    isSession || _.isNil(user.payload.asset?.imageUrl)
      ? wondervilleLogo
      : user.payload.asset?.imageUrl;
  const name = isSession ? "Wonderville Session" : user.payload.asset?.name;

  let locString;
  if (loc.city && loc.region_name) {
    locString = `${loc.city}, ${loc.region_name}`;
  } else {
    locString = loc.country_name;
  }

  return (
    <Card className={styles.card + " " + styles.mainWrapper}>
      <div className={styles.assetImageContainer}>
        <img alt="asset-pop-up" className={styles.assetImage} src={imageUrl} />
      </div>
      <div className={styles.dateContainer}>
        <span>{user.date.toLocaleDateString("en-CA")}</span>
      </div>
      {props.total > 1 && (
        <div className={styles.indexContainer}>
          {props.index + 1}/{props.total}
        </div>
      )}

      <div className={styles.wrapper + " " + styles.assetText}>{name}</div>
      <div className={styles.wrapper + " " + styles.locationText}>{locString}</div>
    </Card>
  );
};

export default PopupCard;
