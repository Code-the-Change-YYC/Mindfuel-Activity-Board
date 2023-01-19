import React, { useEffect, useState } from "react";

import MomentUtils from "@date-io/moment";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { DatePicker } from "@material-ui/pickers/DatePicker";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import moment, { Moment } from "moment";

import styles from "./DateRangePicker.module.css";
import { setAlert } from "state/actions";
import { useAppDispatch } from "state/hooks";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#52247f",
    },
  },
});

type DateRangePickerProps = {
  isOpen: boolean;
  onDateRangeSubmission: (
    startDate: Date | undefined,
    endDate: Date,
    isCustomRange: boolean
  ) => void;
  onCancel: () => void;
};

const DateRangePicker = (props: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState<Moment | null>(moment());
  const [endDate, setEndDate] = useState<Moment | null>(moment());
  const dispatch = useAppDispatch();
  const matches = useMediaQuery("(min-width:600px)"); // Show dialog instead of dropdown on small screens

  const handleDialogueSubmission = () => {
    if (startDate === null || endDate === null) {
      dispatch(setAlert("Please enter both start date and end date", "info"));
      return;
    }
    if (moment(endDate).diff(startDate, "days") > 365) {
      dispatch(setAlert("Please enter two dates that are only a year or less apart", "info"));
      return;
    }
    if (startDate.isAfter(endDate)) {
      dispatch(setAlert("Please enter a valid range of dates", "info"));
      return;
    }

    const apiStartDate = startDate.startOf("day");
    const apiEndDate = endDate.endOf("day");

    props.onDateRangeSubmission(apiStartDate.toDate(), apiEndDate.toDate(), true);
  };

  return (
    <Dialog
      disableEscapeKeyDown
      open={props.isOpen}
      onClose={props.onCancel}
      PaperProps={{
        style: {
          backgroundColor: "#ffdd00",
          color: "#52247f",
          marginLeft: matches ? "265px" : "30px", // Account for SideNav
        },
      }}
    >
      <DialogTitle color={"#52247f"}>Choose Dates</DialogTitle>
      <DialogContent>
        <Box>
          <MuiThemeProvider theme={customTheme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                variant={matches ? "inline" : "dialog"}
                className={styles.datePicker}
                format="MMMM Do, yyyy"
                autoOk
                label="Start Date"
                clearable
                disableFuture
                required
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                variant={matches ? "inline" : "dialog"}
                className={styles.datePicker}
                format="MMMM Do, yyyy"
                autoOk
                label="End Date"
                clearable
                required
                disableFuture
                value={endDate}
                onChange={setEndDate}
              />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button onClick={handleDialogueSubmission}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateRangePicker;
