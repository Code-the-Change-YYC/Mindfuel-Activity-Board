import React from "react";
import { makeStyles, StylesProvider } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import styles from "./PopupCard.module.css";
import { User } from "../../utils/User";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },

  media: {
    height: 102,
  },
});

type PopupCardProps = {
  user: User;
  ref: any;
};

const PopupCard = (props: PopupCardProps) => {
  const user = props.user;
  const city = user.location.city ? user.location.city + "," : null
  const region = user.location.region ? user.location.region + "," : null
  const classes = useStyles();

  return (
      <Card className={classes.root} variant="elevation">
        <div className="cardActionAreaDiv">
          <CardActionArea>
            <CardMedia className={classes.media} image={user.imageUrl} />
            <div className="cardContentDiv">
              <CardContent className={styles.popupRoot}>
                <Typography gutterBottom variant="h6" component="h2">
                  {user.asset}
                </Typography>
                <Typography className={styles.typographyBody2} variant="body2" color="textSecondary" component="p">
                  {city} {region} {user.location.country}
                </Typography>
              </CardContent>
            </div>
          </CardActionArea>
        </div>
      </Card>
  );
};

export default PopupCard;
