import { AnalyticsData } from "../../utils/AnalyticsData";
import { AppState, LiveCounts } from "../../utils/AppState";
import { StylesProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import AnalyticsBox from "../AnalyticsBox";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import React, { ReactElement, useEffect, useState } from "react";
import logo from "../../res/assets/wonderville-logo.png";
import styles from "./Sidenav.module.css";
import useAnalyticsData from "../../hooks/useAnalyticsData";

const Sidenav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyticsBoxes, setAnalyticsBoxes] = useState<ReactElement[]>([]);
  const historicalCounts: { [cat: string]: number } | null = useSelector(
    (state: AppState) => state.historicalCounts
  );
  const liveCounts: LiveCounts = useSelector(
    (state: AppState) => state.liveCounts
  );
  const analyticsData = useAnalyticsData(liveCounts, historicalCounts);

  const buttonClasses = {
    root: styles.dashboardButton,
  };
  const iconClasses = {
    root: styles.menuIconButton,
  };
  const drawerClasses = {
    paper: styles.drawerPaper,
  };

  useEffect(() => {
    const getAnalyticsBoxes = (data: {
      [id: string]: AnalyticsData;
    }): ReactElement[] => {
      return Object.keys(data).map((key) => {
        return (
          <AnalyticsBox
            numberValue={data[key].number}
            textValue={data[key].text}
            icon={data[key].icon}
            key={data[key].text}
          ></AnalyticsBox>
        );
      });
    };

    setAnalyticsBoxes(getAnalyticsBoxes(analyticsData));
  }, [analyticsData]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className={styles.sidenav}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} alt="wonderville-logo" />
      </div>
      <div className={styles.sidenavContent}>
        <div className={styles.analyticsBoxes}>{analyticsBoxes}</div>
        <Button classes={buttonClasses} variant="contained">
          Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <StylesProvider injectFirst>
      <Hidden smUp implementation="css">
        <IconButton
          aria-label="open drawer"
          color="inherit"
          onClick={handleDrawerToggle}
          classes={iconClasses}
        >
          <MenuIcon style={{ fontSize: 30 }} />
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
    </StylesProvider>
  );
};

export default Sidenav;
