import React from "react";
import styles from "./StatsSummary.module.css";
import { Stats } from "../../utils/Stats";
import { IconButton } from "@material-ui/core";
import { EqualizerOutlined } from "@material-ui/icons";

type StatsProps = {
  stats?: { [category: string]: Stats };
};

const StatsSummary = (props: StatsProps) => {
  const iconClasses = {
    root: styles.statsButton,
  };

  const handleClick = () => {
    console.log("Stats clicked");
  };

  return (
    <IconButton
      aria-label="open drawer"
      color="inherit"
      onClick={handleClick}
      classes={iconClasses}
    >
      <EqualizerOutlined style={{ fontSize: 30, color: "#52247F" }} />
    </IconButton>
  );
};

export default StatsSummary;
