import React from "react";
import styles from "./PopupCard.module.css";
import { User } from "../../utils/User";
import { Card, Image } from "react-bootstrap";

type PopupCardProps = {
  user: User;
  ref: any;
};

const PopupCard = (props: PopupCardProps) => {
  const user = props.user;
  const city = user.location.city ? user.location.city + "," : null;

  return (
    <Card className={styles.card + " " + styles.mainWrapper}>
      <Image className={styles.assetImage} src={user.imageUrl} />
      <div className={styles.assetWrapper}>{user.asset}</div>
      <div className={styles.locationWrapper}>
        {city} {user.location.region}
      </div>
    </Card>
  );
};

export default PopupCard;
