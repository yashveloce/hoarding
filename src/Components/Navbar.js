import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
// import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import StarBorder from '@material-ui/icons/StarBorder';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import GroupIcon from '@material-ui/icons/Group';
import StarBorder from '@material-ui/icons/StarBorder';
import PinDropIcon from '@material-ui/icons/PinDrop';
import FlagIcon from '@material-ui/icons/Flag';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LocationCityIcon from '@material-ui/icons/LocationCity';
// import PinDropIcon from '@material-ui/icons/PinDrop';
import { Link } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    color: 'black',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function Navbar() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const classes = useStyles();
  const [open1, setOpen1] = React.useState(false);

  const handleClick1 = () => {
    setOpen1(!open1);
  };

  return (
    <>
    <h4 style={{textAlign:"center"}}>ADMIN</h4>
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      {/* Dashboard */}
      <Link to='/Dashboard'> 
        <ListItem
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
          style={{color: 'black'}}
          button>
          <ListItemIcon>
            <DashboardIcon style={{ color: 'black' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" className='menu-item-color' style={{ fontStyle: 'bold'}}/>

        </ListItem>
      </Link>

      {/* Master Creation */}

      <ListItem button onClick={handleClick1} style={{ paddingLeft: '30px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
        <ListItemIcon>
          <SettingsIcon style={{ color: 'black' }} />
        </ListItemIcon>
        <ListItemText primary="Master Creation" className='menu-item-color' />
        {open1 ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Employee Master */}
          <Link to='/Employee_Master' >
            <ListItem
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1)}
              button className={classes.nested}>
              <ListItemIcon>
                <FlagIcon style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Employee Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Labour Master */}
          <Link to='/Labour_Master' >
            <ListItem
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2)}
              button
              className={classes.nested}>
              <ListItemIcon>
                <SettingsIcon style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Labour Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Location Master */}
          <Link to='/Location_Master' >

            <ListItem
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
              button
              className={classes.nested}>
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Location Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Customer Master */}
          <Link to='/Customer_Master' >

            <ListItem
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4)}
              button
              className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Customer Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Media Type Master */}
          <Link to='/Media_Type_Master' >

            <ListItem
              selected={selectedIndex === 5}
              onClick={(event) => handleListItemClick(event, 5)}
              button
              className={classes.nested}>
              <ListItemIcon>
                <StarBorder style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Media Type Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Size Master */}
          <Link to='/Size_Master' >

            <ListItem
              selected={selectedIndex === 6}
              onClick={(event) => handleListItemClick(event, 6)}
              button
              className={classes.nested}>
              <ListItemIcon>
                <PinDropIcon style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Size Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* Industry Master */}
          <Link to='/Industry_Master' >

            <ListItem
              selected={selectedIndex === 7}
              onClick={(event) => handleListItemClick(event, 7)}
              button
              className={classes.nested}>
              <ListItemIcon>
                <LocationCityIcon style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Industry Master" className='menu-item-color' />
            </ListItem>
          </Link>
          {/* GST Type Master */}
          <Link to='/GST_Type_Master' >

            <ListItem
              selected={selectedIndex === 8}
              onClick={(event) => handleListItemClick(event, 8)}
              button
              className={classes.nested}>
              <ListItemIcon>
                <PinDropIcon style={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="GST Type Master" className='menu-item-color' />
            </ListItem>
          </Link>
        </List>
      </Collapse>
    </List>
    </>
  );
}