import React, { useEffect, useState } from "react";


import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Popover from "@material-ui/core/Popover";
import { StylesProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AxiosResponse } from "axios";
import _ from "lodash";
import { Image } from "react-bootstrap";

import ApiService from "../../api/ApiService";
import filterIcon from "../../res/assets/filter-icon.png";
import { fetchHistoricalUsers, setAlert } from "../../state/actions";
import { useAppDispatch } from "../../state/hooks";
import { ActivityFilterField } from "../../utils/ActivityFIlterField.enum";
import { FilterOptionsApiResponse } from "../../utils/ApiServiceInterface";
import { ActivityFilter, FilterOption } from "../../utils/FilterOption.model";
import { MapBounds } from "../../utils/MapBounds";
import styles from "./Filter.module.css";

type FilterProps = {
  mapBounds: MapBounds;
  fromDate: Date;
  onFilterChange: (activityFilter?: ActivityFilter) => void;
};

const Filter = (props: FilterProps) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<FilterOption | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const loadingClasses = {
    colorPrimary: styles.loadingIndicator,
    bar: styles.loadingBar,
  };
  const iconClasses = {
    root: styles.filterIconButton,
  };
  const popoverClasses = {
    paper: styles.popoverPaper,
  };

  useEffect(() => {
    setLoading(true);
    ApiService.getActivityFilterOptions()
      .then(
        (response: AxiosResponse<FilterOptionsApiResponse>) => {
          setFilterOptions(response.data.options);
        },
        () => handleApiError()
      )
      .finally(() => setLoading(false));
  }, []);

  const handleApiError = () => {
    dispatch(setAlert("Unable to fetch filters, please try again!", "error"));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event: React.ChangeEvent<{}>, newInputValue: FilterOption | null) => {
    setSelectedValue(newInputValue);
    // Make request using fromDate and mapbounds
    if (!_.isNil(newInputValue)) {
      const filter: ActivityFilter = {
        field:
          newInputValue.type === "Category"
            ? ActivityFilterField.Category
            : ActivityFilterField.ActivityType,
        value: newInputValue.name,
      };
      dispatch(fetchHistoricalUsers(props.fromDate.toISOString(), props.mapBounds, filter));
      props.onFilterChange(filter);
    } else {
      // User cleared search, send request without a filter
      dispatch(fetchHistoricalUsers(props.fromDate.toISOString(), props.mapBounds));
      props.onFilterChange();
    }
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
            value={selectedValue}
            disabled={loading}
            options={filterOptions}
            onChange={handleFilterChange}
            groupBy={(option) => option.type}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by activity or category" />
            )}
          />
          {loading && <LinearProgress classes={loadingClasses} />}
        </div>
      </Popover>
    </StylesProvider>
  );
};

export default Filter;
