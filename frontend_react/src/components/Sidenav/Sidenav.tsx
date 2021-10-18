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

type SidenavProps = {
  users: User[];
};

const logo = require("../../assets/mindfuel-logo.png");

const initialData: { [id: string]: AnalyticsData } = {
  totalSessions: {
    numberValue: 0,
    textValue: "Total Sessions",
    icon: require("../../assets/users.svg"),
  },
  totalCountries: {
    numberValue: 0,
    textValue: "Countries",
    icon: require("../../assets/flag.svg"),
  },
  totalCities: {
    numberValue: 0,
    textValue: "Cities",
    icon: require("../../assets/location.svg"),
  },
};

const Sidenav = (props: SidenavProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyticsBoxes, setAnalyticsBoxes] = useState<ReactElement[]>([]);
  const [data, setData] =
    useState<{ [id: string]: AnalyticsData }>(initialData);

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
    const updateData = (users: User[]): { [id: string]: AnalyticsData } => {
      const updatedData = { ...data };
      updatedData.totalSessions.numberValue = users.length;
      updatedData.totalCountries.numberValue = new Set(
        users.map((user) => user.location.country_name)
      ).size;
      updatedData.totalCities.numberValue = new Set(
        users
          .filter((user) => (user.location.city === "" ? false : true))
          .map((user) => user.location.city)
      ).size;
      return updatedData;
    };

    const updateAnalyticsBoxes = (data: {
      [id: string]: AnalyticsData;
    }): ReactElement[] => {
      return Object.keys(data).map((key) => {
        return (
          <AnalyticsBox
            numberValue={data[key].numberValue}
            textValue={data[key].textValue}
            icon={data[key].icon}
            key={data[key].textValue}
          ></AnalyticsBox>
        );
      });
    };

    setData(updateData(props.users));
    setAnalyticsBoxes(updateAnalyticsBoxes(data));
  }, [props.users]);

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
