import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./routes";
import { hashHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
    <MuiThemeProvider>
        <Routes history={hashHistory} />
    </MuiThemeProvider>,
    document.getElementById('root')
);
