import * as React from "react";
import { EqualizerOutlined } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { Image } from "react-bootstrap";
import { Stats } from "../../utils/Stats";
import { StylesProvider } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import activityIcon from "../../res/assets/map-marker-activity.svg";
import gameIcon from "../../res/assets/map-marker-game.svg";
import storyIcon from "../../res/assets/map-marker-story.svg";
import styles from "./StatsSummary.module.css";
import videoIcon from "../../res/assets/map-marker-video.svg";

function createData(daily: string, session: number, top: string) {
  return {daily, session, top};
}

const rows = [
  createData('Game', 37895, 'Save The World'),
  createData('Video', 3437, 'Waste No More' ),
  createData('Story', 400, 'A Cup full of Nano' ),
  createData('Activity', 2593, 'Pirates of the Lodestone')
];


const icons: any = {
  'Game' : gameIcon,
  'Video' : videoIcon,
  'Activity' : activityIcon,
  'Story' : storyIcon
}

const styleModal = {
  root: styles.styleModal
};

const styleTableHeader = {
  root: styles.styleTableHeader
}

const styleRow = {
  root: styles.styleRow
}

type StatsProps = {
  stats?: { [category: string]: Stats };
};

const StatsSummary = (props: StatsProps) => {
  
  const [open, setOpen] = React.useState(false);
  
  const iconClasses = {
    root: styles.statsButton,
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
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >

    <div className={styles.styleModal}>  
    <TableContainer component={Paper}>
      <Table 
      size="small" 
      classes = {styleTableHeader}
      aria-label="simple table">
        <TableHead>
          <TableRow >
            <TableCell>Icon</TableCell>
            <TableCell>Daily</TableCell>
            <TableCell>Sessions</TableCell>
            <TableCell>Top</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.daily}
              classes = {styleRow}
            >
              <TableCell component = 'th' scope="row"><Image src= {icons[row.daily]} className={styles.icon} /></TableCell>
              <TableCell>{row.daily}</TableCell>
              <TableCell>{row.session}</TableCell>
              <TableCell>{row.top}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>   
    </div>
    </Modal>
    </div>
    </StylesProvider>
    
  );
};

export default StatsSummary;
