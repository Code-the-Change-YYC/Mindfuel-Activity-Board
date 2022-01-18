import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { MapBounds } from "../../utils/MapBounds";
import styles from "./SearchAreaButton.module.css";
import _ from "lodash";
import { useEffect } from "react";
import { fetchHistoricalUsers } from "../../redux/actions";
import { useAppDispatch } from "../../redux/hooks";

type SearchAreaButtonProps = {
  show: boolean;
  mapBounds?: MapBounds;
  fromDate?: Date;
};

const SearchAreaButton = (props: SearchAreaButtonProps) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(props.show);
  const buttonClasses = {
    root: styles.dashboardButton,
  };

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  const handleClick = () => {
    if (!_.isNil(props.mapBounds) && !_.isNil(props.fromDate)) {
      dispatch(fetchHistoricalUsers(props.fromDate.toISOString(), props.mapBounds));
    }
    setShow(false);
  };

  return (
    <React.Fragment>
      {show && (
        <Button
          size="small"
          classes={buttonClasses}
          variant="contained"
          onClick={handleClick}
        >
          Search this area
        </Button>
      )}
    </React.Fragment>
  );
};

export default SearchAreaButton;
