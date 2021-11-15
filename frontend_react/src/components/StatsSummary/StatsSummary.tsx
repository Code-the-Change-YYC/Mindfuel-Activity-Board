import * as React from "react";
import styles from "./StatsSummary.module.css";
import { Stats } from "../../utils/Stats";
import { IconButton } from "@material-ui/core";
import { EqualizerOutlined } from "@material-ui/icons";
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function createData(daily: string, session: number, top: string) {
  return {daily, session, top};
}

const rows = [
  createData('Game', 37895, 'Save The World'),
  createData('Video', 3437, 'Waste No More' ),
  createData('Activity', 2593, 'Pirates of the Lodestone'),
  createData('Story', 400, 'A Cup full of Nano' ),
];


var icons: any = {
  'Game' : 1,
  'Video' : 2,
  'Activity' : 3,
  'Story' : 4
}

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'purple',
  border: '3px solid white',
  boxShadow: '5px 3px 10px white',
  p: 3,
};

const styleTable = {
  bgcolor: 'white'
}

const styleRow = {
  borderBottom:'2px solid purple',
  bgcolor: 'white'
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
    console.log("Stats clicked");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
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
      
    <Box 
    // sx = {styleModal}
    >
    <TableContainer component={Paper}>
      <Table size="small" 
      // sx = { styleTable}
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
              // sx={styleRow}
            >
              <TableCell component = 'th' scope="row">{icons[row.daily]}</TableCell>
              <TableCell>{row.daily}</TableCell>
              <TableCell>{row.session}</TableCell>
              <TableCell>{row.top}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>   
    </Box>
    </Modal>

    </div>
    
  );
};

export default StatsSummary;
