import React from 'react';
import { Navigate } from 'react-router-dom';
import isLogin from '../utils/isLogin';

function PrivateRoute({ children }) {
  return isLogin() ? children : <Navigate to="/signin" />;
}

export default PrivateRoute;
