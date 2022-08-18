import React, { useEffect, useState } from "react";

import {
  CircularProgress,
  Fade,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TableSortLabel,
  Switch
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { StylesProvider, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { EqualizerOutlined } from "@material-ui/icons";
import { AxiosResponse } from "axios";
import { Image } from "react-bootstrap";
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import ApiService from "../../api/ApiService";
import activityIcon from "../../res/assets/map-marker-activity.svg";
import gameIcon from "../../res/assets/map-marker-game.svg";
import storyIcon from "../../res/assets/map-marker-story.svg";
import videoIcon from "../../res/assets/map-marker-video.svg";
import { setAlert } from "../../state/actions";
import { useAppDispatch } from "../../state/hooks";
import { ActivityStatsApiResponse } from "../../utils/ApiServiceInterface";
import { ChartStat } from "../../utils/ChartStat";
import { getTimelineDate, numberFormatter } from "../../utils/helpers";
import { Stats } from "../../utils/Stats";
import styles from "./StatsSummary.module.css";
import StatsPieChart from "./StatsPieChart/StatsPieChart";

const CustomTableCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(TableCell);

const icons: any = {
  Game: gameIcon,
  Video: videoIcon,
  Activity: activityIcon,
  Story: storyIcon,
};

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
    label: "3 months",
  },
];

const headCells: any[] = [
  { id: "icon", numeric: false, sortable: false, label: "Icon" },
  { id: "type", numeric: false, sortable: true, label: "Category" },
  { id: "name", numeric: false, sortable: true, label: "Activity" },
  { id: "hits", numeric: true, sortable: true, label: "Sessions" },
];

type Order = "asc" | "desc";

interface EnhancedTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Stats) => void;
  order: Order;
  orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const StatsSummary = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Stats>("hits");
  const [stats, setStats] = useState<Stats[]>([]);
  const [chartVisibility, setChartVisibility] = useState<boolean>(false);
  const [trendingVal, setTrendingVal] = useState<number>(items[0].value);

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
  const tableContainerClasses = {
    root: styles.tableContainer,
  };
  const tableHeaderClasses = {
    root: styles.tableHeader,
  };
  const tableRowClasses = {
    root: styles.tableRow,
  };

  useEffect(() => {
    // Get initial data on instantiation
    setLoading(true);
    const fromDate = getTimelineDate(trendingVal);
    ApiService.getActivityStats(fromDate?.toISOString())
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
    setLoading(true);
    const val = event.target.value as number;
    setTrendingVal(val);

    const fromDate = getTimelineDate(val);
    ApiService.getActivityStats(fromDate?.toISOString())
      .then(
        (response: AxiosResponse<ActivityStatsApiResponse>) => {
          setStats(response.data.stats);
        },
        () => handleApiError()
      )
      .finally(() => setLoading(false));
  };

  const handleChartVisibility = () => {
    if (chartVisibility) setChartVisibility(false);
    else {
      setChartVisibility(true);
    }
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Stats) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setStats(
      stats.sort((a, b) => {
        const first = isAsc ? 1 : -1;
        const second = isAsc ? -1 : 1;
        return a[property] < b[property] ? first : a[property] > b[property] ? second : 0;
      })
    );
  };

  const getRows = () => {
    if (loading) {
      return (
        <TableRow classes={tableRowClasses}>
          <CustomTableCell className={styles.loadingContainer} colSpan={4}>
            <CircularProgress style={{ color: "#52247f" }} />
          </CustomTableCell>
        </TableRow>
      );
    } else if (stats.length > 0) {
      return stats.map((row: Stats) => (
        <TableRow key={row.name} classes={tableRowClasses}>
          <CustomTableCell component="th" scope="row">
            <Image src={icons[row.type]} className={styles.icon} />
          </CustomTableCell>
          <CustomTableCell>{row.type}</CustomTableCell>
          <CustomTableCell>{row.name}</CustomTableCell>
          <CustomTableCell align="right">{numberFormatter(row.hits, 1)}</CustomTableCell>
        </TableRow>
      ));
    } else {
      return (
        <TableRow classes={tableRowClasses}>
          <CustomTableCell style={{ textAlign: "center" }} colSpan={4}>
            No data
          </CustomTableCell>
        </TableRow>
      );
    }
  }

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
              style={{ display: "flex", flexDirection: "row", alignContent: "space-between" }}
            >
              <InputLabel classes={inputLabelClasses} style={{ color: "white" }}>
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
              </Select>
              <FormGroup style={{ marginLeft: "auto" }}>
                <InputLabel
                  classes={inputLabelClasses}
                  style={{ color: "white", position: "relative", textAlign: "center" }}
                >
                  Chart
                </InputLabel>
                <Switch checked={chartVisibility} onClick={handleChartVisibility} />
              </FormGroup>
            </FormControl>
            {chartVisibility && StatsPieChart.length > 0 && (
              <StatsPieChart stats={stats}></StatsPieChart>
            )}
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
            {!chartVisibility && (
              <TableContainer classes={tableContainerClasses} component={Paper}>
                <Table classes={tableHeaderClasses} size="small" aria-label="stats table">
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>{getRows()}</TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </Fade>
      </Modal>
    </StylesProvider>
  );
};

export default StatsSummary;
