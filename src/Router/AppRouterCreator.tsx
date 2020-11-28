import React from 'react';
import {Router, Switch, Redirect} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {IRoute} from './Models';
import {HRoute} from './HRoute';

const history = createBrowserHistory();

export function createAppRouter(config: IRoute[]): JSX.Element {
    function parseRouterConfig(route: IRoute) {
        const {loadChildren, component, routes, redirect = '', path} = route;

        return redirect ? (
            <Redirect from={path} to={redirect} key={path + redirect} />
        ) : routes?.length ? (
            component || loadChildren ? (
                <HRoute {...route} key={path}>
                    <Switch>{routes.map(parseRouterConfig)}</Switch>
                </HRoute>
            ) : (
                <Switch key={path + 'switch'}>{routes.map(parseRouterConfig)}</Switch>
            )
        ) : (
            <HRoute {...route} key={path} />
        );
    }

    return <Router history={history}>{config.map(parseRouterConfig)}</Router>;
}
