import React, { ReactElement, useEffect, useState } from "react";

import Drawer from "@material-ui/core/Drawer";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";
import MenuIcon from "@material-ui/icons/Menu";
import StylesProvider from "@material-ui/styles/StylesProvider";
import { useSelector } from "react-redux";

import useAnalyticsData from "../../hooks/useAnalyticsData";
import { Logo } from "../../res/assets";
import { toggleHeatmap } from "../../state/actions";
import store from "../../state/store";
import { AnalyticsData } from "../../utils/AnalyticsData";
import { AppState, LiveCounts } from "../../utils/AppState";
import AnalyticsBox from "../AnalyticsBox";
import styles from "./SideNav.module.css";

const SideNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyticsBoxes, setAnalyticsBoxes] = useState<ReactElement[]>([]);
  const [heatMapEnabled, setHeatMapEnabled] = useState(false);
  const historicalCounts: { [cat: string]: number } | null = useSelector(
    (state: AppState) => state.historicalCounts
  );
  const liveCounts: LiveCounts = useSelector((state: AppState) => state.liveCounts);
  const analyticsData = useAnalyticsData(liveCounts, historicalCounts);

  const iconClasses = {
    root: styles.menuIconButton,
  };
  const drawerClasses = {
    paper: styles.drawerPaper,
  };

  useEffect(() => {
    const getAnalyticsBoxes = (data: { [id: string]: AnalyticsData }): ReactElement[] => {
      return Object.keys(data).map((key) => {
        return (
          <AnalyticsBox
            numberValue={data[key].number}
            textValue={data[key].text}
            icon={data[key].icon}
            key={data[key].text}
          />
        );
      });
    };

    setAnalyticsBoxes(getAnalyticsBoxes(analyticsData));
  }, [analyticsData]);

  useEffect(() => {
    store.dispatch(toggleHeatmap(heatMapEnabled));
  }, [heatMapEnabled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleHeatmap = () => {
    setHeatMapEnabled(!heatMapEnabled);
  };

  const drawer = (
    <div className={styles.sidenav}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={Logo} alt="wonderville-logo" />
      </div>
      <div className={styles.sidenavContent}>
        <div className={styles.analyticsBoxes}>{analyticsBoxes}</div>
        <FormGroup>
          <FormControlLabel
            style={{ color: "white" }}
            control={<Switch checked={heatMapEnabled} onClick={handleHeatmap} size="medium" />}
            label="Heat Map"
            labelPlacement="start"
          />
        </FormGroup>
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

export default SideNav;
