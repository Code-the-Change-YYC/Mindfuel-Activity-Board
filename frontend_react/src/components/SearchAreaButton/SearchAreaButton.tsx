import React from "react";

import Button from "@material-ui/core/Button";
import { StylesProvider } from "@material-ui/core/styles";

import styles from "./SearchAreaButton.module.css";

type SearchAreaButtonProps = {
  onClick: () => void;
};

const SearchAreaButton = (props: SearchAreaButtonProps) => {
  const buttonClasses = {
    root: styles.dashboardButton,
  };

  return (
    <StylesProvider injectFirst>
      <Button size="small" classes={buttonClasses} variant="contained" onClick={props.onClick}>
        Search this area
      </Button>
    </StylesProvider>
  );
};

export default SearchAreaButton;
