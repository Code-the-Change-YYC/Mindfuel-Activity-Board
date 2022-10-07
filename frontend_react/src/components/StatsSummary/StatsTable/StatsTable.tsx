import React, { useEffect, useState } from "react";

import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  withStyles,
} from "@material-ui/core";
import { Image } from "react-bootstrap";


import activityIcon from "../../../res/assets/map-marker-activity.svg";
import gameIcon from "../../../res/assets/map-marker-game.svg";
import storyIcon from "../../../res/assets/map-marker-story.svg";
import videoIcon from "../../../res/assets/map-marker-video.svg";
import { numberFormatter } from "../../../utils/helpers";
import { Stats } from "../../../utils/Stats";
import styles from "./StatsTable.module.css";

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

const StatsTable = (props: { stats: Stats[]; loading: boolean }) => {
  const [stats, setStats] = useState<Stats[]>(props.stats);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Stats>("hits");

  useEffect(() => {
    setStats(props.stats);
  }, [props.stats]);

  const tableContainerClasses = {
    root: styles.tableContainer,
  };
  const tableHeaderClasses = {
    root: styles.tableHeader,
  };
  const tableRowClasses = {
    root: styles.tableRow,
  };

  const getRows = () => {
    if (props.loading) {
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

  return (
    <TableContainer classes={tableContainerClasses} component={Paper}>
      <Table classes={tableHeaderClasses} size="small" aria-label="stats table">
        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
        <TableBody>{getRows()}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default StatsTable;
