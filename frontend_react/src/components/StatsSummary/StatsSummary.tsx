import React, { useState } from "react";

import { Fade, FormControl, IconButton, InputLabel, MenuItem, Select } from "@material-ui/core";
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

import ApiService from "../../api/ApiService";
import activityIcon from "../../res/assets/map-marker-activity.svg";
import gameIcon from "../../res/assets/map-marker-game.svg";
import storyIcon from "../../res/assets/map-marker-story.svg";
import videoIcon from "../../res/assets/map-marker-video.svg";
import { ActivityStatsApiResponse } from "../../utils/ApiServiceInterface";
import { getTimelineDate, numberFormatter } from "../../utils/helpers";
import { Stats } from "../../utils/Stats";
import styles from "./StatsSummary.module.css";

function createData(category: string, sessions: number, top: string) {
  const formattedSessions = numberFormatter(sessions, 2);
  return { category, formattedSessions, top };
}

const CustomTableCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(TableCell);

const rows = [
  createData("Game", 37895, "Save The World"),
  createData("Video", 3437, "Waste No More"),
  createData("Story", 400, "A Cup full of Nano"),
  createData("Activity", 2593, "Pirates of the Lodestone"),
];

const icons: any = {
  Game: gameIcon,
  Video: videoIcon,
  Activity: activityIcon,
  Story: storyIcon,
};

type StatsProps = {
  stats?: { [category: string]: Stats };
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

const StatsSummary = (props: StatsProps) => {
  const [open, setOpen] = useState(false);
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
  const tableHeaderClasses = {
    root: styles.tableHeader,
  };
  const rowClasses = {
    root: styles.row,
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as number;
    setTrendingVal(val);
  
    const fromDate = getTimelineDate(val);
    ApiService.getActivityStats(fromDate?.toISOString()).then((response: AxiosResponse<ActivityStatsApiResponse>) => {
       console.log(response.data.stats); 
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
              <FormControl classes={formClasses}>
                <InputLabel classes={inputLabelClasses} style={{color: "white"}}>
                  Trending
                </InputLabel>
                <Select
                  autoWidth={true}
                  value={trendingVal}
                  onChange={handleChange}
                  classes={selectClasses}
                >
                  {items.map((item) => (
                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TableContainer component={Paper}>
                <Table size="small" classes={tableHeaderClasses} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <CustomTableCell>Icon</CustomTableCell>
                      <CustomTableCell>Category</CustomTableCell>
                      <CustomTableCell>Top</CustomTableCell>
                      <CustomTableCell align="right">Sessions</CustomTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.category} classes={rowClasses}>
                        <CustomTableCell component="th" scope="row">
                          <Image src={icons[row.category]} className={styles.icon} />
                        </CustomTableCell>
                        <CustomTableCell>{row.category}</CustomTableCell>
                        <CustomTableCell>{row.top}</CustomTableCell>
                        <CustomTableCell align="right">{row.formattedSessions}</CustomTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Fade>
        </Modal>
    </StylesProvider>
  );
};

export default StatsSummary;
