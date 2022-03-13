import * as React from "react";
import { EqualizerOutlined } from "@material-ui/icons";
import { Fade, IconButton } from "@material-ui/core";
import { Image } from "react-bootstrap";
import { Stats } from "../../utils/Stats";
import { StylesProvider, withStyles } from "@material-ui/core/styles";
import { numberFormatter } from "../../utils/helpers";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import activityIcon from "../../res/assets/map-marker-activity.svg";
import gameIcon from "../../res/assets/map-marker-game.svg";
import storyIcon from "../../res/assets/map-marker-story.svg";
import styles from "./StatsSummary.module.css";
import videoIcon from "../../res/assets/map-marker-video.svg";

function createData(category: string, sessions: number, top: string) {
  const formattedSessions = numberFormatter(sessions, 2);
  return { category, formattedSessions, top };
}



const CustomTableCell = withStyles({
  root: {
    borderBottom: "none"
  }
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

const StatsSummary = (props: StatsProps) => {
  const [open, setOpen] = React.useState(false);

  const iconClasses = {
    root: styles.statsButton,
  };
  const tableHeaderClasses = {
    root: styles.tableHeader,
  };
  const rowClasses = {
    root: styles.row,
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <StylesProvider injectFirst>
      <div>
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
              <TableContainer component={Paper}>
                <Table
                  size="small"
                  classes={tableHeaderClasses}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <CustomTableCell>Icon</CustomTableCell>
                      <CustomTableCell>Category</CustomTableCell>
                      <CustomTableCell>Top</CustomTableCell>
                      <CustomTableCell align="right">
                        Sessions
                      </CustomTableCell>
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
                        <CustomTableCell align="right">
                          {row.formattedSessions}
                        </CustomTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Fade>
        </Modal>
      </div>
    </StylesProvider>
  );
};

export default StatsSummary;
