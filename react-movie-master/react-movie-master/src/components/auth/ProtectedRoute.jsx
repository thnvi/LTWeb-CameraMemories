import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as Config from '../../constants/Config';

const ProtectedRoute = ({ component: Component, requireAdmin = false, ...rest }) => {
  const { user, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) return null;
        if (!user) return <Redirect to={`/${Config.HOME_PAGE}/login`} />;
        if (requireAdmin && user.role !== 'admin') return <Redirect to={`/${Config.HOME_PAGE}`} />;
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
