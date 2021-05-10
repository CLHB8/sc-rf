import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Results from './Results'
import {ROUTES} from './utils/Routes'
import LandingPage from './LandingPage'

export default function App() {
    const renderApp = () => (
        <Switch>
            <Route
                key={ROUTES.LANDING}
                exact
                path={ROUTES.LANDING}
                component={LandingPage}
            />
            <Route
                key={ROUTES.RESULTS}
                exact
                path={ROUTES.RESULTS}
                component={Results}
            />
        </Switch>
    );

    return (
        <div>
            <Router>
                <Switch>{renderApp()}</Switch>
            </Router>
        </div>
    );
}
