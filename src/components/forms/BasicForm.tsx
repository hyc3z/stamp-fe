/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component, useContext } from 'react';
import {
    Card,
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
} from 'antd';
import LoginForm from './LoginForm';
import ModalForm from './ModalForm';
import HorizontalForm from './HorizontalForm';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { FormProps } from 'antd/lib/form';
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom';
import FileContext from '../../context/FileContext';
import { Item } from 'devextreme-react/validation-summary';
import Axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;

const resourceTypes = [
    {
        value: 'CPU',
        label: 'Cpu 核心数量',
    }
]

const taskScript = [
    {}
]
const residences = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];

type BasicFormProps = {} & FormProps;

function BasicForms (props: BasicFormProps) {

    const {fstate, changeProgramList, changeFileList, changeScriptList, changeProgramScriptList, refreshFileBrowser} = useContext(FileContext)
    let history = useHistory();
    
    const state = {
        confirmDirty: false,
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
    };
    function convertObjectToOption(file: any, globalList: any[]): any{
        if(!file) return
        const children = file.children
        if(children){
            children.forEach((obj: any) => {convertObjectToOption(obj, globalList)})
        }
        const newFile = {
            value: file.id,
            label: file.name,
        }
        // Chonky folder not openable. Ignoring
        if(!file.isDir){
            globalList.push(newFile)
        }
    }
    const scriptListToCascadeOptions = () => {
        
        let globalList: any[] = [];
        fstate.scripts.forEach((obj: any) => {
            convertObjectToOption(obj, globalList)
        })
        console.log(fstate.scripts, globalList)
        return globalList
    }
        const { getFieldDecorator } = props.form!;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select className="icp-selector" style={{ width: '60px' }}>
                <Option value="86">+86</Option>
            </Select>
        );
        const updateFiles = async () => {
        
            const p = await Axios.get("/file/program").then(data => {return data.data})
            const s = await Axios.get("/file/script").then(data => {return data.data})
            return changeProgramScriptList(p, s, true);
        }
        if(!fstate.initialized){
            updateFiles()
        }

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="任务管理" second="任务创建" />
                <Row>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card title="任务创建" bordered={false}>
                                <Form onSubmit={handleSubmit}>
                                    <FormItem {...formItemLayout} label="名称" hasFeedback>
                                    <Col span={8}>
                                        {getFieldDecorator('task_name', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入任务名称!',
                                                },
                                            ],
                                        })(<Input />)}
                                        </Col>
                                    </FormItem>
                                    {/* <FormItem {...formItemLayout} label="密码" hasFeedback>
                                        {getFieldDecorator('password', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入密码!',
                                                },
                                                {
                                                    validator: this.checkConfirm,
                                                },
                                            ],
                                        })(<Input type="password" />)}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="确认密码" hasFeedback>
                                        {getFieldDecorator('confirm', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请确认你的密码!',
                                                },
                                                {
                                                    validator: this.checkPassword,
                                                },
                                            ],
                                        })(
                                            <Input
                                                type="password"
                                                onBlur={this.handleConfirmBlur}
                                            />
                                        )}
                                    </FormItem> */}
                                    
                                    {/* <FormItem {...formItemLayout} label="资源类型">
                                        {getFieldDecorator('res_type', {
                                            initialValue: ['CPU'],
                        
                                        })(<Cascader options={resourceTypes} />)}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={
                                            <span>
                                                资源数量
                                                <Tooltip title="资源类型为CPU：代表任务需要的CPU核心个数">
                                                    <Icon type="question-circle-o" />
                                                </Tooltip>
                                            </span>
                                        }
                                        hasFeedback
                                    >
                                        {getFieldDecorator('res_amount', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入资源数量!',
                                                    whitespace: false,

                                                },
                                            ],
                                        })(<Input />)}
                                    </FormItem> */}
                                    <FormItem {...formItemLayout} label="任务脚本">
                                        <Col span={8}>
                                        {getFieldDecorator('task_script', {
                                            initialValue: [''],
                        
                                        })(<Cascader options={scriptListToCascadeOptions()} />)}
                                        </Col>
                                        <Col span={2} offset={1}>
                                        <Button onClick={() => {history.push("/hpc/files")}} size="default">
                                            上传脚本
                                        </Button>
                                        </Col>
                                    </FormItem>
                                    {/* <FormItem
                                        {...formItemLayout}
                                        label="验证码"
                                        extra="我们必须确认你不是机器人."
                                    >
                                        <Row gutter={8}>
                                            <Col span={12}>
                                                {getFieldDecorator('captcha', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入你获取的验证码!',
                                                        },
                                                    ],
                                                })(<Input size="large" />)}
                                            </Col>
                                            <Col span={12}>
                                                <Button size="large">获取验证码</Button>
                                            </Col>
                                        </Row>
                                    </FormItem> */}
                                    {/* <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                                        {getFieldDecorator('agreement', {
                                            valuePropName: 'checked',
                                        })(
                                            <Checkbox>
                                                我已经阅读过 <span>协议</span>
                                            </Checkbox>
                                        )}
                                    </FormItem> */}
                                    <FormItem {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" size="large">
                                            提交任务
                                        </Button>
                                    </FormItem>
                                </Form>
                            </Card>
                        </div>
                    </Col>
                    {/* <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card title="登录表单" bordered={false}>
                                <LoginForm />
                            </Card>
                        </div>
                    </Col> */}
                </Row>
                {/* <Row gutter={16}>
                    <Col className="gutter-row" md={14}>
                        <div className="gutter-box">
                            <Card title="水平表单" bordered={false}>
                                <HorizontalForm />
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={10}>
                        <div className="gutter-box">
                            <Card title="弹层表单" bordered={false}>
                                <ModalForm />
                            </Card>
                        </div>
                    </Col>
                </Row> */}
            </div>
        );
}

const BasicForm = Form.create()(withRouter(BasicForms));

export default BasicForm;
