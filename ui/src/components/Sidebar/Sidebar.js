import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import CategoryServices from "../../services/CategoryServices";

import {
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  HotTub as HotTub,
  ArtTrack as ArtTrack,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  SvgIconComponent as SvgIconComponent,
  CalendarToday as CalendarToday,
  AccessAlarmSharp as AccessAlarmSharp,
  Create as Create,
  SupervisedUserCircle,
  HowToVoteSharp ,
  HistorySharp,
  OpenInNew,
  EvStation
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
// styles
import useStyles from "./styles";
// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";
// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

let structure = [
  
  
];

let batches = [
  
  {
    id: 1,
    label: "Batches",
    link: "/app/coaching",
    icon: <HotTub />,
  },
  // {
  //   id: 2,
  //   label: "Booking Reports",
  //   link: "/app/bookingreport",
  //   icon: <HowToVoteSharp />,
  // },
  // {
  //   id: 3,
  //   label: "Reports",
  //   link: "/app/report",
  //   icon: <SupervisedUserCircle />,
  // },
];

const userDetails = JSON.parse(localStorage.getItem("userDetail"));

if(userDetails && userDetails.registrationType === 'coaching'){
  structure = batches;
}else{
  structure = [
  
    {
      id: 1,
      label: "Park",
      link: "/app/park",
      icon: <HotTub />,
    },
    {
      id: 2,
      label: "Detailed Report",
      link: "/app/bookingreport",
      icon: <HowToVoteSharp />,
    },
    {
      id: 3,
      label: "Reports",
      link: "/app/report",
      icon: <SupervisedUserCircle />,
    },
  ]
}
function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );
  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;
    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
