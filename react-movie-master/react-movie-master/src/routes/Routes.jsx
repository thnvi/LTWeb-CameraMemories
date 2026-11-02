import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import * as Config from "../constants/Config";

const Routes = () => {
  return (
    <Switch>
      <Route path={`/${Config.HOME_PAGE}/login`} component={Login} />
      <Route path={`/${Config.HOME_PAGE}/register`} component={Register} />
      <ProtectedRoute
        path={`/${Config.HOME_PAGE}/admin`}
        component={AdminDashboard}
        requireAdmin={true}
      />
      <Route
        path={`/${Config.HOME_PAGE}/:category/search/:keyword`}
        component={Catalog}
      />
      <Route path={`/${Config.HOME_PAGE}/:category/:id`} component={Detail} />
      <Route path={`/${Config.HOME_PAGE}/:category`} component={Catalog} />
      <Route path={`/${Config.HOME_PAGE}`} exact component={Home} />
    </Switch>
  );
};

export default Routes;
