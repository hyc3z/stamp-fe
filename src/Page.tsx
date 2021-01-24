import React from 'react';
import { BrowserRouter as Router, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import App from './App';


const authData = () => {
    console.log("Validating jwt...", localStorage.getItem("hyc-stamp-jwt"))
    return localStorage.getItem("hyc-stamp-jwt")
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
        isSignedIn ? <Redirect to={'/hpc/task/taskList'} /> : <Redirect to={'/login'} />
      }
    />
  );
};



export default () => (
    
    <Router>
        <PrivateRoute path = "/" render={() => <Redirect to = '/hpc/task/taskList' />} />
        <Route path="/404" component={NotFound} />
        <Route path="/login" component={Login} />
        <Route path="/hpc" component={App} />
        <Route component={NotFound} />  
    </Router>
);
