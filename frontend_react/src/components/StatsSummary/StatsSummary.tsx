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
  const [chartValues, setChartValues] = useState<ChartStat[]>([]);
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

  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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
    dispatch(setAlert("Unable to complete request, please try again!", "error"));
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
          updateChart(response.data.stats)
        },
        () => handleApiError()
      )
      .finally(() => setLoading(false));
  };

  const handleChartVisibility = () => {
    if (chartVisibility) setChartVisibility(false)
    else {
      updateChart(stats)
      setChartVisibility(true)
    }
  }

  const updateChart = (newStats: Stats[]) => {
    const newChart: ChartStat[] = []
    let totalHits = 0
    for (let i = 0; i < newStats.length; i++) {
      totalHits += newStats[i].hits
    }

    loop1:
    for (let i = 0; i < newStats.length; i++) {
      const newStat: ChartStat = {value: 0, name: "", color: "", percentage: 0.0}
      for (let j = 0; j < newChart.length; j++) {
        if (newChart[j].name === newStats[i].type) {
          newChart[j].value += newStats[i].hits
          continue loop1;
        }
      }
      newStat.value = newStats[i].hits;
      newStat.name = newStats[i].type;
      newStat.percentage = newStats[i].hits/totalHits * 100
      switch (newStats[i].type) {
        case "Activity":
          newStat.color = "#1F64AF"
          break;
        case "Game":
          newStat.color = "#F7901E"
          break;
        case "Video":
          newStat.color = "#00613e"
          break;
        case "Story":
          newStat.color = "#787400"
          break;
        default:
          newStat.color = colors[i]
          break;
      }
      newChart.push(newStat)
    }
    setChartValues(newChart)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{backgroundColor: "#ffdd00",
        padding: "5px",
        display: "flex", 
        flexDirection: "column"}}>
          <table>
            <tr>
              <th align="left">
                <text style={{color: "#52247f"}}>{payload[0].payload.name}</text>
              </th>
            </tr>
            <tr>
              <td>
                <text style={{color: "#52247f"}}>Hits</text>
              </td>
              <td style={{paddingLeft: "10px"}}>
                <text style={{color: "#52247f"}}>{numberFormatter(payload[0].payload.value, 1)}</text>
              </td>
            </tr>
            <tr>
              <td>
                <text style={{color: "#52247f"}}>Percentage</text>
              </td>
              <td style={{paddingLeft: "10px"}}>
                <text style={{color: "#52247f"}}>{payload[0].payload.percentage.toFixed(1)}%</text>
              </td>
            </tr>
          </table>
        </div>
      );
    }
    return null;
  };

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
              style={{display:"flex", flexDirection:"row", alignContent:"space-between"}}
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
              <FormGroup style={{marginLeft: "auto"}}>
                <InputLabel classes={inputLabelClasses} style={{ color: "white", position: "relative", textAlign: "center" }}>
                  Chart
                </InputLabel>
                <Switch onClick={handleChartVisibility}/>
              </FormGroup>
            </FormControl>
            {chartVisibility && chartValues.length>0 && 
              <PieChart width={450} height={400} style={{backgroundColor: "white", borderRadius: "5px", margin: "25px auto"}}>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={chartValues}
                  cx={"50%"}
                  cy={"50%"}
                  outerRadius={"80%"}
                  innerRadius={"60%"}
                  paddingAngle={5}
                  fill="#ffdd00"
                  stroke='#52247f'
                  label
                  labelLine={false}
                >
                  {
                    chartValues.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color}/>
                    ))
                  }
                </Pie>
                <Tooltip content={<CustomTooltip />}/>
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            }
            {chartVisibility && chartValues.length<=0 && 
              <div style={{backgroundColor: "white", textAlign: "center", borderRadius: "5px", height: "50px", display:"table", width: "100%"}}>
                <h3 style={{verticalAlign: "middle", display: "table-cell"}}>No data</h3>
              </div>
            }
            {!chartVisibility &&
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
            }
          </div>
        </Fade>
      </Modal>
    </StylesProvider>
  );
};

export default StatsSummary;
