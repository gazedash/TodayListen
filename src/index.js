import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import {hashHistory} from "react-router";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DocumentTitle from "react-document-title";
import injectTapEventPlugin from "react-tap-event-plugin";
import "./index.css";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
    <DocumentTitle title='TodayIlisten'>
        <MuiThemeProvider>
            <Routes history={hashHistory}/>
        </MuiThemeProvider>
    </DocumentTitle>,
    document.getElementById('root')
);
