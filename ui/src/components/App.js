import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

import Home from "../pages/home";

// context
import { useUserState } from "../context/UserContext";
// import SchoolRegistration from "../pages/dashboard/SchoolRegistration";
import TicketBooking from "../pages/dashboard/TicketBooking";
import LoginLayout from "./LoginLayout/LoginLayout";

export default function App() {
  // global
  var { isAuthenticated } = useUserState();

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        {/* <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}
        /> */}
        <PrivateRoute path="/app" component={Layout} />
        <PublicRoute path="/ticketbooking/:parkId" component={TicketBooking} />
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/home" component={Home} />
        <PublicRoute path="/sriqr" component={LoginLayout} />
        
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/sriqr/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
