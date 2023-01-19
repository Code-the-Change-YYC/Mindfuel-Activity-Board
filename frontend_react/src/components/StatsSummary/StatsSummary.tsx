import React, { useEffect, useState } from "react";

import MomentUtils from "@date-io/moment";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  StylesProvider,
  Switch,
  createTheme,
  MuiThemeProvider,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { EqualizerOutlined, Whatshot } from "@material-ui/icons";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { AxiosResponse } from "axios";
import moment from "moment";

import ApiService from "../../api/ApiService";
import { setAlert } from "../../state/actions";
import { useAppDispatch } from "../../state/hooks";
import { ActivityStatsApiResponse } from "../../utils/ApiServiceInterface";
import { getTimelineDate } from "../../utils/helpers";
import { Stats } from "../../utils/Stats";
import StatsPieChart from "./StatsPieChart/StatsPieChart";
import styles from "./StatsSummary.module.css";
import StatsTable from "./StatsTable/StatsTable";

const items = [
  {
    value: 100,
    label: "All time",
  },
  {
    value: 75,
    label: "1 day",
  },
  {
    value: 50,
    label: "1 week",
  },
  {
    value: 25,
    label: "1 month",
  },
  {
    value: 0,
    label: "1 year",
  },
];

const StatsSummary = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [stats, setStats] = useState<Stats[]>([]);
  const [chartVisibility, setChartVisibility] = useState<boolean>(false);
  const [trendingVal, setTrendingVal] = useState<number>(items[0].value);
  const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
  const [endDate, setEndDate] = useState<moment.Moment | null>(moment());
  const matches = useMediaQuery("(min-width:600px)");

  const formClasses = {
    root: styles.form,
  };
  const inputLabelClasses = {
    root: styles.colorWhite,
  };
  const selectClasses = {
    root: styles.colorWhite,
    select: styles.colorWhite,
    icon: styles.colorWhite,
  };
  const iconClasses = {
    root: styles.statsButton,
  };

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#52247f",
      },
    },
  });

  useEffect(() => {
    // Get initial data on instantiation
    setLoading(true);
    const startDate = getTimelineDate(trendingVal);
    ApiService.getActivityStats(startDate?.toISOString())
      .then(
        (response: AxiosResponse<ActivityStatsApiResponse>) => {
          setStats(response.data.stats.sort((a, b) => a.rank - b.rank));
        },
        () => handleApiError()
      )
      .finally(() => setLoading(false));
  }, []);

  const handleApiError = () => {
    dispatch(setAlert("Unable to fetch historical stats, please try again!", "error"));
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleTimeValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value != 1000) {
      setLoading(true);
      const val = event.target.value as number;
      setTrendingVal(val);

      const startDate = getTimelineDate(val);
      ApiService.getActivityStats(startDate?.toISOString(), new Date().toISOString())
        .then(
          (response: AxiosResponse<ActivityStatsApiResponse>) => {
            setStats(response.data.stats);
          },
          () => handleApiError()
        )
        .finally(() => setLoading(false));
    }
  };

  const handleChartVisibility = () => {
    if (chartVisibility) setChartVisibility(false);
    else setChartVisibility(true);
  };

  const handleDialogueSubmission = () => {
    if (startDate === null || endDate === null) {
      alert("Please enter both start date and end date");
      return;
    }
    if (moment(endDate).diff(startDate, "days") > 365) {
      alert("Please enter two dates that are only a year or less apart");
      return;
    }

    setLoading(true);
    ApiService.getActivityStats(startDate?.toISOString(), endDate?.toISOString())
      .then(
        (response: AxiosResponse<ActivityStatsApiResponse>) => {
          setStats(response.data.stats);
        },
        () => handleApiError()
      )
      .finally(() => {
        setLoading(false);
        setDialogueOpen(false);
        setTrendingVal(1000);
      });
  };

  return (
    <StylesProvider injectFirst>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        onClick={handleOpen}
        classes={iconClasses}
      >
        <EqualizerOutlined style={{ fontSize: 30, color: "#52247F" }} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        className={styles.modalContainer}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={open}>
          <div className={styles.modal}>
            <FormControl
              classes={formClasses}
              style={{
                display: "flex",
                flexDirection: "row",
                alignContent: "space-between",
              }}
            >
              <InputLabel
                classes={inputLabelClasses}
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icon aria-label="open drawer" color="inherit">
                  <Whatshot style={{ fontSize: 20, color: "#f7901e" }} />
                </Icon>
                Trending
              </InputLabel>
              <Select
                autoWidth={true}
                value={trendingVal}
                onChange={handleTimeValueChange}
                classes={selectClasses}
              >
                {items.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem
                  key={1000}
                  value={1000}
                  onClick={() => {
                    setDialogueOpen(true);
                  }}
                >
                  Custom Range
                </MenuItem>
              </Select>
              <FormGroup style={{ marginLeft: "auto" }}>
                <InputLabel
                  classes={inputLabelClasses}
                  style={{
                    color: "white",
                    position: "relative",
                    textAlign: "right",
                  }}
                >
                  Chart
                </InputLabel>
                <Switch checked={chartVisibility} onClick={handleChartVisibility} />
              </FormGroup>
            </FormControl>
            {chartVisibility && stats.length > 0 && <StatsPieChart stats={stats}></StatsPieChart>}
            {chartVisibility && stats.length <= 0 && (
              <div
                style={{
                  backgroundColor: "white",
                  textAlign: "center",
                  borderRadius: "5px",
                  height: "50px",
                  display: "table",
                  width: "100%",
                }}
              >
                <h3 style={{ verticalAlign: "middle", display: "table-cell" }}>No data</h3>
              </div>
            )}
            {!chartVisibility && <StatsTable stats={stats} loading={loading}></StatsTable>}
          </div>
        </Fade>
      </Modal>
      <Dialog
        disableEscapeKeyDown
        open={dialogueOpen}
        onClose={() => setDialogueOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "#ffdd00",
            color: "#52247f",
            marginLeft: matches ? "265px" : "30px",
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
          <Button onClick={() => setDialogueOpen(false)}>Cancel</Button>
          <Button onClick={handleDialogueSubmission}>Ok</Button>
        </DialogActions>
      </Dialog>
    </StylesProvider>
  );
};

export default StatsSummary;
