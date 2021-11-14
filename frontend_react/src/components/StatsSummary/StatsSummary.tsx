import * as React from "react";
import styles from "./StatsSummary.module.css";
import { Stats } from "../../utils/Stats";
import { IconButton } from "@material-ui/core";
import { EqualizerOutlined } from "@material-ui/icons";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
      
    <Box sx = {styleModal}>
    <TableContainer component={Paper}>
      <Table size="small" sx = { styleTable}aria-label="simple table">
        <TableHead>
          <TableRow sx = {{bgcolor:'#FFDD00'}}>
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
              sx={styleRow}
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
