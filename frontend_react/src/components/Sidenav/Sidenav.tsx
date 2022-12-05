import React, { ReactElement, useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import ToggleButton, { FormGroup, InputLabel, Switch } from '@material-ui/core/';
import { StylesProvider } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector } from "react-redux";

import useAnalyticsData from "../../hooks/useAnalyticsData";
import { Logo } from "../../res/assets";
import { AnalyticsData } from "../../utils/AnalyticsData";
import { AppState, LiveCounts } from "../../utils/AppState";
import { User } from "../../utils/User";
import { Location } from "../../utils/Location";
import AnalyticsBox from "../AnalyticsBox";
import styles from "./Sidenav.module.css";
import { toggleHeatmap } from "../../state/actions";
import store from "../../state/store";

const Sidenav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyticsBoxes, setAnalyticsBoxes] = useState<ReactElement[]>([]);
  const [selected, setSelected] = useState(false);
  const [locations, setLocations] = useState<Location[]>([])
  const historicalCounts: { [cat: string]: number } | null = useSelector(
    (state: AppState) => state.historicalCounts
  );
  const liveCounts: LiveCounts = useSelector(
    (state: AppState) => state.liveCounts
  );
  const users: User[] = useSelector(
    (state: any) => state.historicalUsers
  )
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

  useEffect(() => {
    if (selected === true) {
      let locationList: Location[] = []
      users.forEach(user => {
        locationList.push(user.payload.location)
      });
      setLocations(locationList)
      console.log(locationList)
    }
    store.dispatch(toggleHeatmap(selected));
  }, [selected])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleHeatmap = () => {
    setSelected(!selected)
  }

  const getLocations = () => {
    return locations;
  }

  const drawer = (
    <div className={styles.sidenav}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={Logo} alt="wonderville-logo" />
      </div>
      <div className={styles.sidenavContent}>
        <div className={styles.analyticsBoxes}>{analyticsBoxes}</div>
        {/* <Button classes={buttonClasses} variant="contained">
          Dashboardddd
        </Button> */}
        <FormGroup style={{ marginLeft: "auto" }}>
                <InputLabel
                  style={{ color: "white", position: "relative", textAlign: "center" }}
                >
                  Heatmap
                </InputLabel>
                <Switch checked={selected} onClick={handleHeatmap} />
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
