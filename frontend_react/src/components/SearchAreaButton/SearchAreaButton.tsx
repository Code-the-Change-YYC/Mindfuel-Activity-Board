import Button from "@material-ui/core/Button";
import React from "react";
import styles from "./SearchAreaButton.module.css";

type SearchAreaButtonProps = {
  handleClick: () => void;
};

const SearchAreaButton = (props: SearchAreaButtonProps) => {
  const buttonClasses = {
    root: styles.dashboardButton,
  };

  return (
    <Button
      size="small"
      classes={buttonClasses}
      variant="contained"
      onClick={props.handleClick}
    >
      Search this area
    </Button>
  );
};

export default SearchAreaButton;
