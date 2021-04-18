/**
 * Created by hao.cheng on 2017/4/13.
 */
import { connect } from 'react-redux';
import React, { Component, Dispatch, useContext, useEffect, useState } from 'react';
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
import BreadcrumbCustom from '../BreadcrumbCustom';
import { FormProps, FormComponentProps } from 'antd/lib/form';
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom';
import FileContext from '../../context/FileContext';
import { Item } from 'devextreme-react/validation-summary';
import Axios from 'axios';
import JobContext from '../../context/JobCreateContext';
import { TPartition } from '../../typings/partition';
import { RootState } from '../../store';
import { PartitionTableAttributes } from '../../common/const/partition';
import { getPartitionData } from '../../axios/common';
import { changePartition } from '../../store/action/partition';
import { TReduxAction } from '../../common/const';
import { TConfig } from '../../common/const/config';
import { changeConfig } from '../../store/action/config';
import { setConfig } from 'redux-alita';

const FormItem = Form.Item;
const Option = Select.Option;


type ClusterConfigFormProps = {
    configs: TConfig[];
    setConfig: Function;
} & FormProps;
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

function NumericInput(this: any, props: any): JSX.Element {
    const onChange = (e: { target: { value: any } }) => {
        const { value } = e.target;
        const reg = /^([1-9]\d{0,9})$/;
        if (value === '' || reg.test(value)) {
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
function ClusterConfigForms(props: ClusterConfigFormProps) {
    function getConfigs() {
        Axios({
            method: 'GET',
            url: 'config/get',
            headers: {
                'Content-Type': 'text/plain',
            },
        })
        .then(({ data }) => {
            props.setConfig(data)
        })
    }
    useEffect(() => {
        getConfigs()
    }, [])
    let history = useHistory();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.form?.validateFields((err: any, values: any) => {
            Axios({
                method: 'POST',
                url: 'config/set',
                headers: {
                    'Content-Type': 'text/plain',
                },
                data: {
                    values
                }
            })
                .then(({ data }) => {
                    message.success('修改成功');
                    // console.log(data)
                })
                .catch((err) => {
                    message.error('修改失败');
                    // console.log(err)
                })
                .finally(() => {});
        });
    };
    
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
    
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="集群管理" second="集群配置" />
            <Row>
                <Col className="gutter-row">
                    <div className="gutter-box">
                        <Card title="集群配置" bordered={false}>
                            <Form onSubmit={handleSubmit}>
                                {props.configs.map((config: TConfig) => {
                                    return (
                                        <FormItem {...formItemLayout} label={Object.keys(config)[0]} hasFeedback>
                                    <Col span={8}>
                                        {getFieldDecorator(Object.keys(config)[0], {
                                            initialValue: Object.values(config)[0],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: `请输入${Object.keys(config)[0]}!`,
                                                },
                                            ],
                                        })(
                                            <Input
                                                onChange={(e) => {
                                                    //changeScriptPath()
                                                }}
                                            />
                                        )}
                                    </Col>
                                </FormItem>
                                    )
                                })}
                                <FormItem {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" size="large">
                                        提交配置修改
                                    </Button>
                                </FormItem>
                              </Form>
                                </Card>
                                </div>
                                </Col>
                                </Row>
        </div>
    );
}

function mapStateToProps(state: RootState): Pick<ClusterConfigFormProps, 'configs'> {
    return {
        configs: [...state.Configs.clusterConfig].map(
            (config: TConfig): TConfig => {
                return config;
            }
        ),
    };
}
function mapDispatchToProps(
    dispatch: Dispatch<TReduxAction>
): Pick<ClusterConfigFormProps, 'setConfig'> {
    return {
        setConfig: (configs: TConfig[]) => {
            dispatch(changeConfig(configs));
        },
    };
}
const ClusterConfigForm = Form.create()(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(ClusterConfigForms))
);

export default ClusterConfigForm;
