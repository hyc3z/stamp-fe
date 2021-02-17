import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import App from './App';
import Axios from 'axios';
import LoginContext, {LoginInfo} from './context/LoginContext'


function Page () {
  const initLoginState: LoginInfo = {
    user_name: "",
    user_jwt: "",
    validated: false
}
const [authstate, changeAuthstate] = useState(initLoginState)

const validateLogin = async () => {
    const res = await Axios.get("/user/validate")
    // console.log("I",res.data, res.data.message === "true")
    const curstate = {...authstate}
    curstate.validated = (res.data.message === "true")
    changeAuthstate(curstate)
}

const changeLoginState = (loginstate: LoginInfo) => {
    changeAuthstate(loginstate)
}
return (
  <LoginContext.Provider value={{authstate, validateLogin, changeLoginState}}>
 
  <Router>
  <Route path = "/" render={() => <Redirect to = '/login' />} />
  <Route path="/404" component={NotFound} />
  <Route path="/login" component={Login} />
  <Route path="/hpc" component={App} />
  {/* <Route component={NotFound} />   */}
</Router>
</LoginContext.Provider>
)
}

export default Page;
