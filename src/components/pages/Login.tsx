/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Form, Icon, Input, Button /*Checkbox*/ } from 'antd';
import { PwaInstaller } from '../widget';
import { connectAlita } from 'redux-alita';
import { Redirect, RouteComponentProps } from 'react-router';
import { FormProps } from 'antd/lib/form';
import axios from 'axios';
// import { Route, Router } from 'react-router-dom';

const FormItem = Form.Item;
type LoginProps = {
    setAlitaState: (param: any) => void;
    auth: any;
} & RouteComponentProps &
    FormProps;
class Login extends React.Component<LoginProps> {
    componentDidMount() {
        const { setAlitaState } = this.props;
        setAlitaState({ stateName: 'auth', data: null });
    }
    componentDidUpdate(prevProps: LoginProps) {
        // React 16.3+弃用componentWillReceiveProps
        const { auth: nextAuth = {}, history } = this.props;
        // const { history } = this.props;
        if (nextAuth.data && nextAuth.data.uid) {
            // 判断是否登陆
            localStorage.setItem('user', JSON.stringify(nextAuth.data));
            history.push('/');
        }
    }
    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.form!.validateFields(async (err, values) => {
            let un = values.userName
            let pwd = values.password
            let res = await axios.get(`http://localhost:3078/user/login?username=${un}&password=${pwd}`);
            let msg = res && res.data && res.data.message
            if(msg){
                localStorage.setItem("hyc-stamp-jwt", msg);
                localStorage.setItem("stamp-user-name",un );
                this.props.history.push('/hpc/task/taskList');
            } else {
                alert("用户名或密码错误！")
            }
        });
        
        
    };
    gitHub = () => {
        window.location.href =
            'https://github.com/login/oauth/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin';
    };
    render() {
        const { getFieldDecorator } = this.props.form!;
        if(localStorage.getItem("hyc-stamp-jwt")){
            return <Redirect to={'/hpc/task/tasklist'}/>
        }
        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <span>hpc管理系统</span>
                        <PwaInstaller />
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                    // placeholder="管理员输入admin, 游客输入guest"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                    type="password"
                                    // placeholder="管理员输入admin, 游客输入guest"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {/* {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>记住我</Checkbox>)} */}
                            {/* <span className="login-form-forgot" style={{ float: 'right' }}>
                                忘记密码
                            </span> */}
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                style={{ width: '100%' }}
                            >
                                登录
                            </Button>
                            {/* <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>或 现在就去注册!</span>
                                <span onClick={this.gitHub}>
                                    <Icon type="github" />
                                    (第三方登录)
                                </span>
                            </p> */}
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Form.create()(Login));
