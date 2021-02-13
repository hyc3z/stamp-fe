import React from 'react';
import { BrowserRouter as Router, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import App from './App';
import Axios from 'axios';


const authData = async () => {
    // console.log("Validating jwt...", localStorage.getItem("hyc-stamp-jwt"))
    const res = await Axios.get("/user/validate")
    return res.data === "true"
}

interface PrivateRouteProps {
    component?:React.ElementType;
    render?: (props: RouteComponentProps<any>) => React.ReactNode;
    path?: string | string[];
    exact?: boolean;
    sensitive?: boolean;
    strict?: boolean;
}
const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  ...routeProps
}) => {
  const isSignedIn = authData();
  console.log(isSignedIn)
  return (
    <Route
      {...routeProps}
      render={(props) =>
        isSignedIn ? Component : <Redirect to={'/login'} />
      }
    />
  );
};



export default () => (
    
    <Router>
        <Route path = "/" render={() => <Redirect to = '/login' />} />
        <Route path="/404" component={NotFound} />
        <Route path="/login" component={Login} />
        <Route path="/hpc" component={App} />
        {/* <Route component={NotFound} />   */}
    </Router>
);
