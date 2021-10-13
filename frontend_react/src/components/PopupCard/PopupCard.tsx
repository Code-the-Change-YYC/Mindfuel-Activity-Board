import React from "react";
import styles from "./PopupCard.module.css";
import { User } from "../../utils/User";
import { Card, Image } from "react-bootstrap";
import wondervilleLogo from "../../assets/wonderville-logo.png";

type PopupCardProps = {
  user: User;
};

const PopupCard = (props: PopupCardProps) => {
  const user = props.user;
  const city = user.location.city ? user.location.city + "," : null;
  const imageUrl =
    user.type === "wondervilleSession" ? wondervilleLogo : user.asset?.imageUrl;

  return (
    <Card className={styles.card + " " + styles.mainWrapper}>
      <Image className={styles.assetImage} src={imageUrl} />
      <div className={styles.wrapper + " " + styles.assetText}>
        {user.asset?.name}
      </div>
      <div className={styles.wrapper + " " + styles.locationText}>
        {city} {user.location.region}
      </div>
    </Card>
  );
};

export default PopupCard;
