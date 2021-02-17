/**
 * Created by hao.cheng on 2017/4/16.
 */
import React, { useContext } from 'react';
import { Form, Icon, Input, Button /*Checkbox*/ } from 'antd';
import { PwaInstaller } from '../widget';
import { connectAlita } from 'redux-alita';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { FormProps } from 'antd/lib/form';
import axios from 'axios';
import Axios from 'axios';
import LoginContext, { LoginInfo } from '../../context/LoginContext';
// import { Route, Router } from 'react-router-dom';

const FormItem = Form.Item;
type LoginProps = {
    setAlitaState: (param: any) => void;
    auth: any;
} & RouteComponentProps &
    FormProps;
function Login (props: LoginProps) {
    const {authstate, changeLoginState} = useContext(LoginContext)
    const { getFieldDecorator } = props.form!;
    const { auth: nextAuth = {}, history } = props;
    if(authstate.validated){
        history.push('/hpc/task/taskList');
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { auth: nextAuth = {}, history } = props;
        props.form!.validateFields(async (err, values) => {
            let un = values.userName
            let pwd = values.password
            let res = await axios.get(`/user/login`, {
                headers : {
                    "Stamp_oauth_username" : un,
                    "Stamp_oauth_pwd": pwd
                }
            });
            let msg = res && res.data && res.data.message
            if(msg){
                const curstate: LoginInfo = {
                    user_name: un,
                    user_jwt: msg,
                    validated: true
                }
                changeLoginState(curstate)
                history.push('/hpc/task/taskList');
            } else {
                alert("用户名或密码错误！")
            }
        });
        
        
    };
    
    
        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <span>hpc管理系统</span>
                        <PwaInstaller />
                    </div>
                    <Form onSubmit={handleSubmit} style={{ maxWidth: '300px' }}>
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

export default connectAlita(['auth'])(Form.create()(withRouter(Login)));
