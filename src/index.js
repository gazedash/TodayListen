import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import {hashHistory} from "react-router";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DocumentTitle from "react-document-title";
import injectTapEventPlugin from "react-tap-event-plugin";
import Raven from 'raven-js';
import "./index.css";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
Raven.config('https://2d77581fea2b483c9fb980ad92a9a50b@sentry.io/124949').install();

ReactDOM.render(
    <DocumentTitle title='TodayIlisten'>
        <MuiThemeProvider>
            <Routes history={hashHistory}/>
        </MuiThemeProvider>
    </DocumentTitle>,
    document.getElementById('root')
);
