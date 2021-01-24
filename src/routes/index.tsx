
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import AllComponents from '../components';
import routesConfig, { IFMenuBase, IFMenu } from './config';
import queryString from 'query-string';
// import App from '../App';
// import NotFound from '../components/pages/NotFound';
// import Login from '../components/pages/Login';
// import AuthData from '../App'
type CRouterProps = {
    auth: any;
};

export default class CRouter extends Component<CRouterProps> {

    requireAuth = (permission: any, component: React.ReactElement) => {
        const { auth } = this.props;
        const { permissions } = auth.data;
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    requireLogin = (component: React.ReactElement) => {
      
        const permissions = () => {
            return { data: localStorage.getItem("hyc-stamp-jwt")}
        }
        if (!permissions) {
            // 线上环境判断是否登录
            return <Redirect to={'/login'} />;
        }
        return component;
    };
    render() {
        return (
            
            <Switch>
                
                {Object.keys(routesConfig).map(key =>
                    routesConfig[key].map((r: IFMenu) => {
                        const route = (r: IFMenuBase) => {
                            const Component = r.component && AllComponents[r.component];
                            return (
                                <Route
                                    key={r.route || r.key}
                                    exact
                                    path={r.route || r.key}
                                    render={props => {
                                        const reg = /\?\S*/g;
                                        // 匹配?及其以后字符串
                                        const queryParams = window.location.hash.match(reg);
                                        // 去除?的参数
                                        const { params } = props.match;
                                        Object.keys(params).forEach(key => {
                                            params[key] =
                                                params[key] && params[key].replace(reg, '');
                                        });
                                        props.match.params = { ...params };
                                        const merge = {
                                            ...props,
                                            query: queryParams
                                                ? queryString.parse(queryParams[0])
                                                : {},
                                        };
                                        // 重新包装组件
                                        const wrappedComponent = (
                                            <DocumentTitle title={r.title}>
                                                <Component {...merge} />
                                            </DocumentTitle>
                                        );
                                        return r.login
                                            ? wrappedComponent
                                            : this.requireLogin(wrappedComponent);
                                    }}
                                />
                            );
                        };
                        return r.component
                            ? route(r)
                            : r.subs && r.subs.map((r: IFMenuBase) => route(r));
                    })
                )}

            </Switch>
        );
    }
}

