import React from "react";
import { Route, Redirect } from "react-router-dom";

import TokenService from "../../services/TokenService";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = TokenService.getRefreshTokenValidity();
  /**
   * TODO: @mzekri-madar Add authorization route guard
   **/
  
  const test = TokenService.getLocked()
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated) {
          if (test==="true" || test  === null)
            return (
              <Redirect
                to={{
                  pathname: "/user-pages/lockscreen",
                  state: { from: props.location }
                }}
              />
            );
          else (test==="false")
            return <Component {...props} />;
        } else
          return (
            <Redirect
              to={{
                pathname: "/user-pages/login-1",
                state: { from: props.location }
              }}
            />
          );
      }}
    />
  );
};
