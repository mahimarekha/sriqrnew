import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Fab,
  withStyles,
  Button
} from "@material-ui/core";
import { Grid, Card, Box, FormControl, Select, InputLabel, TextField } from "@material-ui/core";
import Login from "../../pages/login/Login";
import {

  Link
} from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import SchoolRegistration from "../../pages/dashboard/SchoolRegistration";
import {
  Menu as MenuIcon,

 
  Send as SendIcon,
  ArrowBack as ArrowBackIcon
} from "@material-ui/icons";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";

import { Badge, Typography } from "../Wrappers/Wrappers";

import UserAvatar from "../UserAvatar/UserAvatar";

const messages = [
  {
    id: 0,
    variant: "warning",
    name: "Jane Hew",
    message: "Hey! How is it going?",
    time: "9:32"
  },
  {
    id: 1,
    variant: "success",
    name: "Lloyd Brown",
    message: "Check out my new Dashboard",
    time: "9:18"
  },
  {
    id: 2,
    variant: "primary",
    name: "Mark Winstein",
    message: "I want rearrange the appointment",
    time: "9:15"
  },
  {
    id: 3,
    variant: "secondary",
    name: "Liana Dutti",
    message: "Good news from sale department",
    time: "9:09"
  }
];




const HeaderView = ({ classes, isSidebarOpened, toggleSidebar, ...props }) => (
  <AppBar position="fixed" className={classes.appBar} style={{backgroundColor : 'white'}}>
    <Toolbar className={classes.toolbar} >
      
  
      <Typography variant="h6" weight="medium" className={classes.logotype} style={{ fontSize:"calc(2.142rem)", fontWeight:"600", color:'#ff6b81'}}>Admin</Typography>
      <div className={classes.grow} />
    


  {/* <Grid item xs>
  <li  style={{ display:"block"}}>
          <Link to="/montessori/ticketbooking" style={{color:"white", textDecoration: "none", color:'#6c0f0e'}}>Ticket Booking</Link>
          </li>
  </Grid>
  
  <Grid item xs>
  <li style={{ display:"block"}}>
          <Link to="/montessori/login" style={{color:"white", textDecoration: "none", color:'#6c0f0e' }}>Login</Link>
          </li>
  </Grid> */}

 


      


   
      

     
      <Menu
        id="profile-menu"
        open={Boolean(props.profileMenu)}
        anchorEl={props.profileMenu}
        onClose={props.closeProfileMenu}
        className={classes.headerMenu}
        classes={{ paper: classes.profileMenu }}
        disableAutoFocusItem
      >
        <div className={classes.profileMenuUser}>
          <Typography variant="h4" weight="medium">
            John Smith
          </Typography>
          <Typography
            className={classes.profileMenuLink}
            component="a"
            color="primary"
            href="https://flatlogic.com"
          >
            Flalogic.com
          </Typography>
        </div>
      
       
        <div className={classes.profileMenuUser}>
          <Typography
            className={classes.profileMenuLink}
            color="primary"
            onClick={props.signOut}
          >
            Sign Out
          </Typography>
        </div>
      </Menu>
    </Toolbar>
  </AppBar>
);

const styles = theme => ({
  logotype: {
    color: "white",
    marginLeft: theme.spacing.unit * 2.5,
    marginRight: theme.spacing.unit * 2.5,
    fontWeight: 500,
    fontSize: 18,
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  appBar: {
    width: "100vw",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  toolbar: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  hide: {
    display: "none"
  },
  grow: {
    flexGrow: 1
  },
 
 
  
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    height: 36,
    padding: 0,
    paddingRight: 36 + theme.spacing.unit * 1.25,
    width: "100%"
  },
  messageContent: {
    display: "flex",
    flexDirection: "column"
  },
  headerMenu: {
    marginTop: theme.spacing.unit * 7
  },
  headerMenuList: {
    display: "flex",
    flexDirection: "column"
  },
  headerMenuItem: {
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
      color: "white"
    }
  },
  headerMenuButton: {
    marginLeft: theme.spacing.unit * 2,
    padding: theme.spacing.unit / 2
  },
  headerMenuButtonCollapse: {
    marginRight: theme.spacing.unit * 2
  },
  headerIcon: {
    fontSize: 28,
    color: "rgba(255, 255, 255, 0.35)"
  },
  headerIconCollapse: {
    color: "white"
  },
  profileMenu: {
    minWidth: 265
  },
  profileMenuUser: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing.unit * 2
  },
  profileMenuItem: {
    color: theme.palette.text.hint
  },
  profileMenuIcon: {
    marginRight: theme.spacing.unit * 2,
    color: theme.palette.text.hint
  },
  profileMenuLink: {
    fontSize: 16,
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer"
    }
  },
 
 
  sendMessageButton: {
    margin: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    textTransform: "none"
  },
  sendButtonIcon: {
    marginLeft: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(HeaderView);
