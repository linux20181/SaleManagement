import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import App from './App';
import Login from './Authentication/Login/Login';
var isLogin = function () {
    if(localStorage.getItem('ID')){
        return true;
    }else{
        return false;
    }
};
ReactDOM.render(
    <div>
        <Router>
            {isLogin() ? <div>
                <App/>
                </div>
             :
                <div>
                <Route path='/login' component={Login} />
                <Redirect to="/login" />             
                </div>
            }
        </Router>
    </div>
    , document.getElementById('root'));

