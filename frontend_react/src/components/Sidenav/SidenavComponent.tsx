import React from 'react';
import AnalyticsBox from '../../components/analyticsBox';
import styles from './Sidenav.module.css';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

const logo = require("../../assets/mindfuel-logo.png")

const data = [
  {
    "numberValue": "56",
    "textValue": "Total Users",
    "icon": require("../../assets/users.svg")
  },
  {
    "numberValue": "3",
    "textValue": "Countries",
    "icon": require("../../assets/flag.svg")
  },
  {
    "numberValue": "16",
    "textValue": "Cities",
    "icon": require("../../assets/location.svg")
  }
]

const Sidenav = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();
  const buttonClasses = {
    root: styles.dashboardButton
  }
  const iconClasses = {
    root: styles.menuIconContainer
  }

  const boxes = data.map(box => {
    return <AnalyticsBox numberValue={box.numberValue} textValue={box.textValue} icon={box.icon}></AnalyticsBox>
  })


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className={styles.sidenav}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} />
      </div>
      <div className={styles.sidenavContent}>
        <div className={styles.analyticsBoxes}>
          {boxes}
        </div>
        <div className={styles.infoPanel}></div>
        <Button classes={buttonClasses} variant="contained">Dashboard</Button>
      </div>
    </div>
  )

  return (
    <React.Fragment>
      <Hidden smUp implementation="css">
        <IconButton
              id="iconContainer"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              classes={iconClasses}
            >
              <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </React.Fragment>
  )
}

export default Sidenav;