import React from 'react';
import styles from './Sidenav.module.css';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { StylesProvider } from '@material-ui/core/styles';

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className={styles.sidenav}>
      <div className={styles.sidenavContent}>
        <div className={styles.infoPanel}></div>
        <Button classes={buttonClasses} variant="contained">Dashboard</Button>
      </div>
    </div>
  )

  return (
    <StylesProvider injectFirst>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        onClick={handleDrawerToggle}
        classes={iconClasses}
      >
        <MenuIcon style={{ fontSize: 40 }} />
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
    </StylesProvider>
  )
}

export default Sidenav;