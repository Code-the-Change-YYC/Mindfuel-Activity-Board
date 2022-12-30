import React, { ReactElement, useEffect, useState } from "react";

import { FormControlLabel, FormGroup, Switch } from "@material-ui/core/";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { StylesProvider } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector } from "react-redux";

import useAnalyticsData from "../../hooks/useAnalyticsData";
import { Logo } from "../../res/assets";
import { toggleHeatmap } from "../../state/actions";
import store from "../../state/store";
import { AnalyticsData } from "../../utils/AnalyticsData";
import { AppState, LiveCounts } from "../../utils/AppState";
import { Location } from "../../utils/Location";
import { User } from "../../utils/User";
import AnalyticsBox from "../AnalyticsBox";
import styles from "./Sidenav.module.css";

const Sidenav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyticsBoxes, setAnalyticsBoxes] = useState<ReactElement[]>([]);
  const [selected, setSelected] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const historicalCounts: { [cat: string]: number } | null = useSelector(
    (state: AppState) => state.historicalCounts
  );
  const liveCounts: LiveCounts = useSelector((state: AppState) => state.liveCounts);
  const users: User[] = useSelector((state: any) => state.historicalUsers);
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
  const switchClasses = {
    switchBase: styles.switchBase,
    checked: styles.checked,
    track: styles.switchButton,
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
          ></AnalyticsBox>
        );
      });
    };

    setAnalyticsBoxes(getAnalyticsBoxes(analyticsData));
  }, [analyticsData]);

  useEffect(() => {
    store.dispatch(toggleHeatmap(selected));
  }, [selected]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleHeatmap = () => {
    setSelected(!selected);
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
            style={{ color: "#ffdd00" }}
            control={
              <Switch
                checked={selected}
                onClick={handleHeatmap}
                color="default"
                size="medium"
                classes={{
                  track: switchClasses.track,
                  switchBase: switchClasses.switchBase,
                  checked: switchClasses.checked,
                }}
              />
            }
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

export default Sidenav;
