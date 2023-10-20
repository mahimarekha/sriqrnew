import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";
import BookingReport from "../../pages/dashboard/BookingReport"
import Report from "../../pages/dashboard/report"
import Success from "../../pages/dashboard/Success"
import ProfileRegistration from "../../pages/dashboard/ProfileRegistration"
import Coaching from "../../pages/dashboard/Coaching"
import Park from "../../pages/dashboard/Park"

import {Box, IconButton, Link} from '@material-ui/core'
import Icon from '@mdi/react'
import {
  mdiFacebook as FacebookIcon,
  mdiTwitter as TwitterIcon,
  mdiGithub as GithubIcon,
} from '@mdi/js'

import useStyles from "./styles";

import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
// import Dashboard from "../../pages/dashboard/SchoolRegistration";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
// context
import { useLayoutState } from "../../context/LayoutContext";
import { Category } from "@material-ui/icons";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
            <Route path="/app/bookingreport" component={BookingReport} />
            <Route path="/app/report" component={Report} />
            <Route path="/app/profileregistration" component={ProfileRegistration} />
            <Route path="/app/success" component={Success} />
              <Route path="/app/park" component={Park} />
              <Route path="/app/coaching" component={Coaching} />
              <Route path="/app/typography" component={Typography} />
              <Route path="/app/notifications" component={Notifications} />
              <Route
                exact
                path="/app/ui"
                render={() => <Redirect to="/app/ui/icons" />}
              />
              <Route path="/app/ui/reportofactivities" component={Icons} />
              <Route path="/app/ui/charts" component={Charts} />
            </Switch>
            <Box
              mt={5}
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent="space-between"
            >
              {/* <div>
                <Link
                  color={'primary'}
                  href={'https://flatlogic.com/'}
                  target={'_blank'}
                  className={classes.link}
                >
                  Flatlogic
                </Link>
                <Link
                  color={'primary'}
                  href={'https://flatlogic.com/about'}
                  target={'_blank'}
                  className={classes.link}
                >
                  About Us
                </Link>
                <Link
                  color={'primary'}
                  href={'https://flatlogic.com/blog'}
                  target={'_blank'}
                  className={classes.link}
                >
                  Blog
                </Link>
              </div> */}
              {/* <div>
                <Link
                  href={'https://www.facebook.com/flatlogic'}
                  target={'_blank'}
                >
                  <IconButton aria-label="facebook">
                    <Icon
                      path={FacebookIcon}
                      size={1}
                      color="#6E6E6E99"
                    />
                  </IconButton>
                </Link>
                <Link
                  href={'https://twitter.com/flatlogic'}
                  target={'_blank'}
                >
                  <IconButton aria-label="twitter">
                    <Icon
                      path={TwitterIcon}
                      size={1}
                      color="#6E6E6E99"
                    />
                  </IconButton>
                </Link>
                <Link
                  href={'https://github.com/flatlogic'}
                  target={'_blank'}
                >
                  <IconButton
                    aria-label="github"
                    style={{marginRight: -12}}
                  >
                    <Icon
                      path={GithubIcon}
                      size={1}
                      color="#6E6E6E99"
                    />
                  </IconButton>
                </Link>
              </div> */}
            </Box>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
