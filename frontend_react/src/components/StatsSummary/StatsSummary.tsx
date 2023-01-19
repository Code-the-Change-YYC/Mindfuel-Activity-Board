import React, { useEffect, useState } from "react";

import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import { EqualizerOutlined, Whatshot } from "@material-ui/icons";
import StylesProvider from "@material-ui/styles/StylesProvider";
import { AxiosResponse } from "axios";

import DateRangePicker from "./DateRangePicker";
import StatsPieChart from "./StatsPieChart/StatsPieChart";
import styles from "./StatsSummary.module.css";
import StatsTable from "./StatsTable/StatsTable";
import { setAlert } from "state/actions";
import { useAppDispatch } from "state/hooks";
import { ActivityStatsApiResponse } from "utils/ApiServiceInterface";
import { getTimelineDate } from "utils/helpers";
import { Stats } from "utils/Stats";

import ApiService from "../../api/ApiService";

const items = [
  {
    value: 100,
    label: "All time",
  },
  {
    value: 75,
    label: "Past day",
  },
  {
    value: 50,
    label: "Past week",
  },
  {
    value: 25,
    label: "Past month",
  },
  {
    value: 0,
    label: "Past year",
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
  const CUSTOM_RANGE_VAL = 1000;

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
    setStats([]);
  };

  const handleTimeValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value != CUSTOM_RANGE_VAL) {
      const val = event.target.value as number;
      setTrendingVal(val);
      const startDate = getTimelineDate(val);
      fetchActivityStats(startDate!, new Date(), false);
    }
  };

  const fetchActivityStats = (
    startDate: Date | undefined,
    endDate: Date,
    isCustomRange: boolean
  ) => {
    setLoading(true);
    ApiService.getActivityStats(startDate?.toISOString(), endDate.toISOString())
      .then(
        (response: AxiosResponse<ActivityStatsApiResponse>) => {
          setStats(response.data.stats);
        },
        () => handleApiError()
      )
      .finally(() => {
        setLoading(false);
        setDialogueOpen(false);

        if (isCustomRange) {
          setTrendingVal(CUSTOM_RANGE_VAL);
        }
      });
  };

  return (
    <StylesProvider injectFirst>
      <IconButton
        aria-label="open drawer"
        color="inherit"
        onClick={() => setOpen(true)}
        classes={iconClasses}
      >
        <EqualizerOutlined style={{ fontSize: 30, color: "#52247F" }} />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
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
                  key={CUSTOM_RANGE_VAL}
                  value={CUSTOM_RANGE_VAL}
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
                <Switch
                  checked={chartVisibility}
                  onClick={() => setChartVisibility(!chartVisibility)}
                />
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
      <DateRangePicker
        isOpen={dialogueOpen}
        onDateRangeSubmission={fetchActivityStats}
        onCancel={() => setDialogueOpen(false)}
      />
    </StylesProvider>
  );
};

export default StatsSummary;
