import React, { Component, useState } from 'react';
import Routes from './routes';
import DocumentTitle from 'react-document-title';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { Layout, notification, Icon } from 'antd';
// import { ThemePicker } from './components/widget';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import LoginContext, { LoginInfo } from './context/LoginContext';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import { AppDispatch, RootState } from './store';

const { Content, Footer } = Layout;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
type AppProps = {
    setAlitaState: (param: any) => void;
    auth: any;
    responsive: any;
};

function App(props: AppProps) {
    const [collapsed, setcollapsed] = useState(false);

    const toggle = () => {
        setcollapsed(!collapsed);
    };
    const title = '';
    const auth = { data: {} };
    const responsive = { data: {} };
    return (
        <DocumentTitle title={title}>
            <Layout>
                {<SiderCustom collapsed={collapsed} />}
                {/* <ThemePicker /> */}
                <Layout style={{ flexDirection: 'column' }}>
                    <HeaderCustom toggle={toggle} collapsed={collapsed} user={auth.data || {}} />
                    <Content style={{ margin: '0 16px', flex: '1 1 0' }}>
                        <Routes />
                    </Content>
                    {/* <Footer style={{ textAlign: 'center' }}>
                            hpc管理系统 v0.1.0 ©{new Date().getFullYear()}
                        </Footer> */}
                </Layout>
            </Layout>
        </DocumentTitle>
    );
}

export default App;
