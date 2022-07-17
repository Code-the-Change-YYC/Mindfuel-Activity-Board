import React, { useEffect, useState } from "react";

import { StylesProvider } from "@material-ui/core/styles";
import { Image } from "react-bootstrap";

import styles from "./Filter.module.css";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";

import filterIcon from "../../res/assets/filter-icon.png";

const Filter = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const iconClasses = {
    root: styles.filterIconButton,
  };
  const popoverClasses = {
    paper: styles.popoverPaper,
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StylesProvider injectFirst>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        onClick={handleClick}
        classes={iconClasses}
      >
        <Image className={styles.filterIcon} src={filterIcon} />
      </IconButton>
      <Popover
        classes={popoverClasses}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        Test
      </Popover>
    </StylesProvider>
  );
};

export default Filter;
