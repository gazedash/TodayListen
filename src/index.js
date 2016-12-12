import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./routes";
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
    <MuiThemeProvider>
        <Routes history={browserHistory} />
    </MuiThemeProvider>,
    document.getElementById('root')
);
