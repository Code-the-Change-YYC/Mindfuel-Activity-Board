import React, { useEffect, useState } from "react";

import { StylesProvider } from "@material-ui/core/styles";
import { Image } from "react-bootstrap";

import styles from "./Filter.module.css";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";

import filterIcon from "../../res/assets/filter-icon.png";
import { MapBounds } from "../../utils/MapBounds";
import { Stats } from "../../utils/Stats";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

type FilterProps = {
  mapBounds: MapBounds;
  activityOptions: Stats[];
};

const Filter = (props: FilterProps) => {
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
        <div className={styles.filterContainer}>
          <Autocomplete
            id="grouped-demo"
            options={props.activityOptions.sort((a, b) => -b.name.localeCompare(a.name))}
            groupBy={(option) => option.type}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="With categories" variant="outlined" />
            )}
          />
        </div>
      </Popover>
    </StylesProvider>
  );
};

export default Filter;
