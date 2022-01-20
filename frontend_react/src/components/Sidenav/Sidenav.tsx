import React, { ReactElement, useEffect, useState } from "react";
import AnalyticsBox from "../AnalyticsBox";
import styles from "./Sidenav.module.css";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { StylesProvider } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { User } from "../../utils/User";
import { AnalyticsData } from "../../utils/AnalyticsData";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../utils/AppState";

const logo = require("../../res/assets/mindfuel-logo.png");

const initialData: { [id: string]: AnalyticsData } = {
  sessions: {
    number: 0,
    text: "Total Sessions",
    icon: require("../../res/assets/users.svg"),
  },
  countries: {
    number: 0,
    text: "Countries",
    icon: require("../../res/assets/flag.svg"),
  },
  cities: {
    number: 0,
    text: "Cities",
    icon: require("../../res/assets/location.svg"),
  },
};

const Sidenav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyticsBoxes, setAnalyticsBoxes] = useState<ReactElement[]>([]);
  const [data, setData] =
    useState<{ [id: string]: AnalyticsData }>(initialData);
  const liveUsers: User[] = useSelector((state: AppState) => state.liveUsers);
  const historicalUsers: User[] | null = useSelector(
    (state: AppState) => state.historicalUsers
  );
  const historicalCounts: { [cat: string]: number } = useSelector(
    (state: AppState) => state.historicalCounts
  );

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
    const updateData = (
      sessions: number,
      countries: number,
      cities: number
    ): { [id: string]: AnalyticsData } => {
      const updatedData = { ...data };
      updatedData.sessions.number = sessions;
      updatedData.countries.number = countries;
      updatedData.cities.number = cities;
      return updatedData;
    };

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

    let updatedData: { [id: string]: AnalyticsData };
    if (_.isNil(historicalUsers)) {
      const sessions = liveUsers.length;
      const countries = new Set(
        liveUsers.map((user) => user.payload.location.country_name)
      ).size;
      const cities = new Set(
        liveUsers
          .filter((user) => (user.payload.location.city === "" ? false : true))
          .map((user) => user.payload.location.city)
      ).size;
      updatedData = updateData(sessions, countries, cities);
    } else {
      updatedData = updateData(
        historicalCounts.sessions,
        historicalCounts.countries,
        historicalCounts.cities
      );
    }
    setData(updatedData);
    setAnalyticsBoxes(getAnalyticsBoxes(updatedData));
  }, [liveUsers, historicalUsers]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className={styles.sidenav}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} alt="mindfuel-logo" />
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
