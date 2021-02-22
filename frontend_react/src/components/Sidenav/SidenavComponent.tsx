import React from 'react';
import AnalyticsBox from '../AnalyticsBox';
import styles from './Sidenav.module.css';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
  const buttonClasses = {
    root: styles.dashboardButton
  }
  const iconClasses = {
    root: styles.menuIconContainer,
  }
  const drawerClasses = {
    paper: styles.drawerPaper
  }

  const boxes = data.map(box => {
    return <AnalyticsBox numberValue={box.numberValue} textValue={box.textValue} icon={box.icon} key={box.textValue}></AnalyticsBox>
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
              aria-label="open drawer"
              color="inherit"
              onClick={handleDrawerToggle}
              classes={iconClasses}
            >
              <MenuIcon style={{ fontSize: 30 }}/>
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: drawerClasses.paper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: drawerClasses.paper,
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