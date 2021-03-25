import React from 'react';
import { makeStyles, StylesProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import './PopupCard.css';

const useStyles = makeStyles({
    root: {
      maxWidth: 217,
    },

    media: {
      height: 102,
    },

  });



export default function PopupCard(props){

    const classes = useStyles();

return (
    <StylesProvider injectFirst>
    <Card className={classes.root} variant="elevation">
      <div className="cardActionAreaDiv">
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image= {props.image}
        />
        
        <div className="cardContentDiv">
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.location}
          </Typography>
        </CardContent>
        </div>
        
      </CardActionArea>
      </div>
      
    
    </Card>
    </StylesProvider>
  );
}