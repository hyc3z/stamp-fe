import React, { Component } from 'react';
import Routes from './routes';
import DocumentTitle from 'react-document-title';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { Layout, notification, Icon } from 'antd';
// import { ThemePicker } from './components/widget';
import { connectAlita } from 'redux-alita';


const { Content, Footer } = Layout;

type AppProps = {
    setAlitaState: (param: any) => void;
    auth: any;
    responsive: any;
};

class App extends Component<AppProps> {
    state = {
        collapsed: false,
        title: '',
    };
    componentWillMount() {
        const { setAlitaState } = this.props;
        let user,
            storageUser = localStorage.getItem('user');
        user = storageUser && JSON.parse(storageUser);
        // user && receiveData(user, 'auth');
        user && setAlitaState({ stateName: 'auth', data: user });
        // receiveData({a: 213}, 'auth');
        // fetchData({funcName: 'admin', stateName: 'auth'});
        this.getClientWidth();
        window.onresize = () => {
            // console.log('屏幕变化了');
            this.getClientWidth();
        };
    }
    componentDidMount() {
        const openNotification = () => {
            notification.open({
                message: '博主-hyc3z',
                description: (
                    <div>
                        <p>
                            GitHub地址：{' '}
                            <a
                                href="https://github.com/hyc3z"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://github.com/hyc3z
                            </a>
                        </p>
                        <p>
                            博客地址：{' '}
                            <a
                                href="https://hyc3z.github.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://hyc3z.github.io/
                            </a>
                        </p>
                    </div>
                ),
                icon: <Icon type="smile-circle" style={{ color: 'red' }} />,
                duration: 0,
            });
            localStorage.setItem('isFirst', JSON.stringify(true));
        };
        const storageFirst = localStorage.getItem('isFirst');
        if (storageFirst) {
            const isFirst = JSON.parse(storageFirst);
            !isFirst && openNotification();
        }
    }
    getClientWidth = () => {
        // 获取当前浏览器宽度并设置responsive管理响应式
        // const { setAlitaState } = this.props;
        const clientWidth = window.innerWidth;
        // console.log(clientWidth);
        // setAlitaState({ stateName: 'responsive', data: { isMobile: clientWidth <= 992 } });
        // receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { title } = this.state;
        const { auth = { data: {} }, responsive = { data: {} } } = this.props;
        return (
            <DocumentTitle title={title}>
                <Layout>
                    {!responsive.data.isMobile && <SiderCustom collapsed={this.state.collapsed} />}
                    {/* <ThemePicker /> */}
                    <Layout style={{ flexDirection: 'column' }}>
                        <HeaderCustom
                            toggle={this.toggle}
                            collapsed={this.state.collapsed}
                            user={auth.data || {}}
                        />
                        <Content style={{ margin: '0 16px', overflow: 'initial', flex: '1 1 0' }}>
                            <Routes />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            hpc管理系统 v0.1.0 ©{new Date().getFullYear()}
                        </Footer>
                    </Layout>
                </Layout>
            </DocumentTitle>
        );
    }
}

export default connectAlita(['auth', 'responsive'])(App);
