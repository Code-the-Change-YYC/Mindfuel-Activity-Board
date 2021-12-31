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
  const loc = user.payload.location;
  const imageUrl =
    user.type === "wondervilleSession"
      ? wondervilleLogo
      : user.payload.asset?.imageUrl;
  const name =
    user.type === "wondervilleSession"
      ? "Wonderville Session"
      : user.payload.asset?.name;

  if (loc.city && loc.region_name) {
    var locString = `${loc.city}, ${loc.region_name}`;
  } else {
    locString = loc.country_name;
  }

  return (
    <Card className={styles.card + " " + styles.mainWrapper}>
      <Image className={styles.assetImage} src={imageUrl} />
      <div className={styles.wrapper + " " + styles.assetText}>
        {name}
      </div>
      <div className={styles.wrapper + " " + styles.locationText}>
        {locString}
      </div>
    </Card>
  );
};

export default PopupCard;
