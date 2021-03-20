/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component, useContext, useState } from 'react';
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
    message,
} from 'antd';
import LoginForm from './LoginForm';
import ModalForm from './ModalForm';
import HorizontalForm from './HorizontalForm';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { FormProps, FormComponentProps } from 'antd/lib/form';
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom';
import FileContext from '../../context/FileContext';
import { Item } from 'devextreme-react/validation-summary';
import Axios from 'axios';
import JobContext from '../../context/JobCreateContext';

const FormItem = Form.Item;
const Option = Select.Option;

const resourceTypes = [
    {
        value: 'CPU',
        label: 'Cpu 核心数量',
    }
]

const taskState = [
    {}
]


type BasicFormProps = {} & FormProps;
function formatNumber(value: string) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }
  
  function NumericInput(this: any, props:any): JSX.Element{
    const onChange = (e: { target: { value: any; }; }) => {
      const { value } = e.target;
      const reg = /^(0|[1-9]\d{0,9})$/;
      if ((!isNaN(value) && reg.test(value))) {
        props.onChange(value);
      }
    };
  
    // '.' at the end or only '-' in the input box.
    const onBlur = () => {
      const { value, onBlur, onChange } = props;
      let valueTemp = value;
      if (value.charAt(value.length - 1) === '.' || value === '-') {
        valueTemp = value.slice(0, -1);
      }
      onChange(valueTemp.replace(/0*(\d+)/, '$1'));
      if (onBlur) {
        onBlur();
      }
    };

    
        const { value } = props;
        const title = value ? (
          <span className="numeric-input-title">{value !== '-' ? formatNumber(value) : '-'}</span>
        ) : (
          'Input a number'
        );
        return (
          <Tooltip
            trigger={'focus'}
            title={title}
            placement="topLeft"
            overlayClassName="numeric-input"
          >
            <Input
              {...props}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Input a number"
              maxLength={25}
            />
          </Tooltip>
        );
      
}
function BasicForms (props: BasicFormProps) {

    const {fstate, changeProgramList, changeFileList, changeScriptList, changeProgramScriptList, refreshFileBrowser} = useContext(FileContext)
    const {jobState, changeJobScript, changeJobSpec, changeJobStatus} = useContext(JobContext)
    let history = useHistory();
    const state = {
        confirmDirty: false,
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.form?.validateFields((err:any, values: any) => {
            Axios({
                method: 'GET',
                url: 'task/create',
                headers: { 
                    "Content-Type": "text/plain",
                    "taskname": jobState.jobSpec.name,
                    "filename": jobState.jobScript.name,
                    "resource-Type": values.res_type[0],
                    "resource-Amount": values.res_amount,
                }
            }).then(({data}) => {
                message.success("创建成功")
                history.push("/hpc/task/taskList")
                // console.log(data)
            }).catch((err) =>{
                message.error("创建失败")
                // console.log(err)
            }).finally(() =>{
                
            })
        })
        
        
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
    function changeScriptName(e:any) {
        const curScript =  {...jobState.jobScript}
        curScript.name  = e
        changeJobScript(curScript)
    }

    function changeTaskName(e:any) {
        const cstate =  {...jobState.jobSpec}
        // console.log(e)
        cstate.name  = e
        changeJobSpec(cstate)
    }
    const scriptListToCascadeOptions= () => {
        
        let globalList: any[] = [];
        fstate.scripts.forEach((obj: any) => {
            convertObjectToOption(obj, globalList)
        })
        // console.log(fstate.scripts, globalList)
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
                                        })(<Input onChange={(e) => {
                                            changeTaskName(e.target.value)
                                            //changeScriptPath()
                                        }}/>)}
                                        </Col>
                                    </FormItem>
                                    
                                     <FormItem {...formItemLayout} label="资源类型">
                                    <Col span={8}>

                                        {getFieldDecorator('res_type', {
                                            initialValue: ['CPU'],
                        
                                        })(<Cascader options={resourceTypes} />)}
                                    </Col>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={
                                            <span>
                                                资源数量
                                                <Tooltip title="代表任务需要的资源数量">
                                                    <Icon type="question-circle-o" />
                                                </Tooltip>
                                            </span>
                                        }
                                        hasFeedback
                                    >
                                    <Col span={8}>

                                        {getFieldDecorator('res_amount', {
                                            initialValue: '0',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入资源数量!',
                                                    
                                                },
                                                {
                                                    whitespace: false,
                                                    
                                                }
                                            ],
                                        })(<NumericInput min={0}/>)}
                                    </Col>
                                    </FormItem> 
                                    <FormItem {...formItemLayout} label="任务脚本">
                                        <Col span={8}>
                                        {getFieldDecorator('script', {
                                            initialValue: jobState.jobScript.name,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入脚本名称!',
                                                    
                                                },
                                            ],
                                        })(
                                        <Input
                                        prefix={<Icon type="book" style={{ fontSize: 13 }} />}
                                        placeholder={jobState.jobScript.name}
                                        onChange={(e) => {
                                            changeScriptName(e.target.value)
                                            //changeScriptPath()
                                        }}
                                        />)}
                                        </Col>
                                        <Col span={2} offset={1}>
                                        <Button onClick={() => {history.push("/hpc/files")}} size="default">
                                            上传/选择脚本
                                        </Button>
                                        </Col>
                                    </FormItem>
                
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
